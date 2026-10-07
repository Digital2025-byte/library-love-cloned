#!/usr/bin/env bash
# bootstrap-vps — rebuild the whole FlyCham stack on a fresh (or wiped) VPS.
#
#   Run once, as root, on Ubuntu 22.04/24.04:
#     bash <(curl -fsSL https://raw.githubusercontent.com/Digital2025-byte/library-love-cloned/main/deploy/bootstrap-vps.sh)
#
# What it sets up (safe to re-run — every step skips what already exists):
#
#   CMS backend   /var/www/flycham-cms  pm2 flycham-cms  :3000  update-cms
#   Public site   /var/www/flycham-web  pm2 flycham-web  :4000  update-flycham
#   Caddy         HTTPS (Let's Encrypt) for both domains → the two ports
#   GitHub Actions login key, so both CI/CD pipelines can deploy again
#
# The site repo is private: the script prints a deploy key and waits until you
# have added it on GitHub. At the end it writes the values for the GitHub
# secrets to /root/flycham-ci-secrets.txt.
#
# Override defaults with env vars: SITE_DOMAIN, API_DOMAIN, SSH_HOST, NODE_MAJOR.

main() {
  set -Eeuo pipefail

  local site_domain="${SITE_DOMAIN:-cms-flycham.alpatrose.com}"
  local api_domain="${API_DOMAIN:-cms-api.cms-flycham.alpatrose.com}"
  local ssh_host="${SSH_HOST:-187.127.155.20}"
  local node_major="${NODE_MAJOR:-22}"

  local cms_dir=/var/www/flycham-cms
  local web_dir=/var/www/flycham-web
  local cms_repo=https://github.com/Digital2025-byte/library-love-cloned.git
  local web_repo=git@github-flycham-web:Digital2025-byte/fly-cham-cms.git
  local secrets_file=/root/flycham-ci-secrets.txt

  log() { printf '\n\033[1;34m[bootstrap]\033[0m %s\n' "$*"; }
  fail() { printf '\n\033[1;31m[bootstrap] ERROR:\033[0m %s\n' "$*"; exit 1; }

  [[ $EUID -eq 0 ]] || fail "run as root"
  export DEBIAN_FRONTEND=noninteractive

  # Caddy needs ports 80/443. Refuse to fight another proxy (e.g. a panel's traefik).
  local busy
  busy="$(ss -ltnpH '( sport = :80 or sport = :443 )' 2>/dev/null | grep -v caddy || true)"
  [[ -z "$busy" ]] || fail "ports 80/443 are used by another program:
$busy
Stop it (or route $site_domain → :4000 and $api_domain → :3000 in it) and re-run."

  # --- 1. System packages -----------------------------------------------------
  log "installing system packages"
  apt-get update -qq
  apt-get install -y -qq git curl ca-certificates gnupg util-linux openssh-client \
    debian-keyring debian-archive-keyring apt-transport-https >/dev/null

  if ! command -v node >/dev/null || (( $(node -p 'process.versions.node.split(".")[0]') < node_major )); then
    log "installing Node.js $node_major"
    curl -fsSL "https://deb.nodesource.com/setup_${node_major}.x" | bash - >/dev/null
    apt-get install -y -qq nodejs >/dev/null
  fi
  log "node $(node -v), npm $(npm -v)"

  command -v pm2 >/dev/null || { log "installing pm2"; npm install -g pm2 --no-audit --no-fund >/dev/null; }

  if ! command -v caddy >/dev/null; then
    log "installing Caddy"
    curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
      | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
      > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -qq
    apt-get install -y -qq caddy >/dev/null
  fi

  mkdir -p /var/www ~/.ssh
  chmod 700 ~/.ssh
  touch ~/.ssh/known_hosts
  ssh-keygen -F github.com >/dev/null || ssh-keyscan -t ed25519,rsa github.com >> ~/.ssh/known_hosts 2>/dev/null

  # --- 2. CMS backend (public repo, pulled over https) -------------------------
  if [[ ! -d $cms_dir/.git ]]; then
    log "cloning the CMS backend"
    rm -rf "$cms_dir"
    git clone -q "$cms_repo" "$cms_dir"
  fi
  printf '#!/bin/sh\nexec bash %s/deploy/update-cms.sh "$@"\n' "$cms_dir" > /usr/local/bin/update-cms
  chmod +x /usr/local/bin/update-cms
  log "building + starting the CMS backend"
  FORCE=1 update-cms

  # --- 3. Public site (private repo, read-only deploy key) ---------------------
  if [[ ! -f ~/.ssh/flycham_web_repo ]]; then
    ssh-keygen -q -t ed25519 -N "" -C "flycham-web server" -f ~/.ssh/flycham_web_repo
  fi
  if ! grep -q 'Host github-flycham-web' ~/.ssh/config 2>/dev/null; then
    printf 'Host github-flycham-web\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/flycham_web_repo\n  IdentitiesOnly yes\n' >> ~/.ssh/config
    chmod 600 ~/.ssh/config
  fi
  until git ls-remote "$web_repo" HEAD >/dev/null 2>&1; do
    log "the server cannot read the private site repo yet. Add this deploy key:"
    echo "  GitHub → Digital2025-byte/fly-cham-cms → Settings → Deploy keys → Add deploy key"
    echo "  (title: flycham-web server, leave 'Allow write access' OFF)"
    echo
    cat ~/.ssh/flycham_web_repo.pub
    echo
    read -r -p "Press Enter once it is added... " </dev/tty
  done
  if [[ ! -d $web_dir/.git ]]; then
    log "cloning the public site"
    rm -rf "$web_dir"
    git clone -q "$web_repo" "$web_dir"
  fi
  printf '#!/bin/sh\nexec bash %s/deploy/update-flycham.sh "$@"\n' "$web_dir" > /usr/local/bin/update-flycham
  chmod +x /usr/local/bin/update-flycham
  log "building + starting the public site"
  FORCE=1 update-flycham

  # --- 4. Survive reboots -------------------------------------------------------
  log "enabling pm2 on boot"
  pm2 startup systemd -u root --hp /root >/dev/null
  pm2 save >/dev/null

  # --- 5. HTTPS ----------------------------------------------------------------
  log "configuring Caddy: $site_domain → :4000, $api_domain → :3000"
  cat > /etc/caddy/Caddyfile <<EOF
# Managed by deploy/bootstrap-vps.sh (library-love-cloned repo).
$site_domain {
	encode gzip
	reverse_proxy 127.0.0.1:4000
}

$api_domain {
	reverse_proxy 127.0.0.1:3000
}
EOF
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null
  systemctl enable --now caddy >/dev/null
  systemctl reload caddy

  # Open the ports only if a firewall is actually on (never switch one on here).
  if command -v ufw >/dev/null && ufw status | grep -q 'Status: active'; then
    log "opening firewall ports 80, 443, 3000"
    ufw allow OpenSSH >/dev/null; ufw allow 80/tcp >/dev/null
    ufw allow 443/tcp >/dev/null; ufw allow 3000/tcp >/dev/null
  fi

  # --- 6. Login key for GitHub Actions -----------------------------------------
  if [[ ! -f ~/.ssh/github_actions ]]; then
    ssh-keygen -q -t ed25519 -N "" -C "github-actions flycham" -f ~/.ssh/github_actions
  fi
  touch ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  grep -qF "$(cut -d' ' -f2 ~/.ssh/github_actions.pub)" ~/.ssh/authorized_keys \
    || cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

  local known_hosts
  known_hosts="$ssh_host $(cut -d' ' -f1,2 /etc/ssh/ssh_host_ed25519_key.pub)"
  umask 077
  {
    echo "GitHub secrets for BOTH repos (Settings → Secrets and variables → Actions)."
    echo "Delete this file once they are saved:  rm $secrets_file"
    echo
    echo "library-love-cloned (CMS)      fly-cham-cms (site)        value"
    echo "CMS_SSH_HOST                   VPS_SSH_HOST               $ssh_host"
    echo "CMS_SSH_USER                   VPS_SSH_USER               root"
    echo "CMS_SSH_KNOWN_HOSTS            VPS_SSH_KNOWN_HOSTS        $known_hosts"
    echo "CMS_SSH_KEY                    VPS_SSH_KEY                the whole private key below"
    echo
    cat ~/.ssh/github_actions
  } > "$secrets_file"

  # --- 7. Check -----------------------------------------------------------------
  log "checking"
  sleep 3
  local c
  c="$(curl -s -o /dev/null -m 10 -w '%{http_code}' http://127.0.0.1:3000/api/public/get-pages)"; echo "  CMS  local  :3000  HTTP $c"
  c="$(curl -s -o /dev/null -m 10 -w '%{http_code}' http://127.0.0.1:4000/healthz)";              echo "  site local  :4000  HTTP $c"
  c="$(curl -s -o /dev/null -m 30 -w '%{http_code}' "https://$api_domain/api/public/get-pages")"; echo "  https://$api_domain  HTTP $c"
  c="$(curl -s -o /dev/null -m 30 -w '%{http_code}' "https://$site_domain/")";                    echo "  https://$site_domain  HTTP $c"
  echo "  (HTTPS shows 000 for a minute while Caddy gets the certificates — check again with curl -I)"

  log "done. Next: add the GitHub secrets listed in $secrets_file, then re-run both workflows."
}

main "$@"
