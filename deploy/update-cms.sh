#!/usr/bin/env bash
# update-cms — deploy the FlyCham CMS backend on the VPS.
#
#   update-cms            deploy the latest origin/main
#   update-cms <sha>      deploy that exact commit (what GitHub Actions does)
#   FORCE=1 update-cms    rebuild even when already on the target commit
#
# Steps: fetch → checkout the target commit → npm ci → build → pm2 reload →
# health check. A failed build or health check restores the previous commit
# and build, so the running site is never left on a broken release.
#
# Installed once as /usr/local/bin/update-cms (see DEPLOY.md, "Automatic
# deploys"). Override defaults with APP_DIR / BRANCH / PM2_APP / HEALTH_URL.
#
# Everything runs inside main(): bash reads a script lazily, and `git reset`
# below rewrites this very file — parsing the whole function first keeps the
# running deploy unaffected by its own update.

main() {
  set -Eeuo pipefail

  local app_dir="${APP_DIR:-/var/www/flycham-cms}"
  local branch="${BRANCH:-main}"
  local pm2_app="${PM2_APP:-flycham-cms}"
  local health_url="${HEALTH_URL:-http://127.0.0.1:3000/api/public/get-pages}"
  local target="${1:-}"

  log() { printf '[update-cms %s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
  fail() { log "ERROR: $*"; exit 1; }

  # One deploy at a time (a second push waits up to 10 minutes).
  exec 9>/tmp/update-cms.lock
  flock -w 600 9 || fail "another deploy is still running"

  cd "$app_dir" || fail "$app_dir does not exist"
  git rev-parse --git-dir >/dev/null 2>&1 || fail "$app_dir is not a git clone (see DEPLOY.md)"

  log "fetching origin/$branch"
  git fetch --prune origin "$branch"
  target="$(git rev-parse --verify "${target:-origin/$branch}^{commit}")" \
    || fail "unknown commit: ${1:-origin/$branch}"

  local previous
  previous="$(git rev-parse HEAD)"
  if [[ "$previous" == "$target" && -f .output/server/index.mjs && "${FORCE:-0}" != 1 ]]; then
    log "already on ${target:0:7} — nothing to deploy (FORCE=1 to rebuild)"
    return 0
  fi
  log "deploying ${previous:0:7} → ${target:0:7}"

  # This folder is deploy-only: local edits are discarded (.env.production is
  # git-ignored, so it survives).
  git reset --hard "$target"
  [[ -f .env.production ]] || cp .env.production.example .env.production

  # Keep the current build: `vite build` empties .output before writing.
  rm -rf .output.prev
  [[ -d .output ]] && cp -a .output .output.prev

  restore_previous() {
    log "rolling back to ${previous:0:7}"
    git reset --hard "$previous"
    if [[ -d .output.prev ]]; then
      rm -rf .output
      mv .output.prev .output
    fi
  }

  log "installing dependencies"
  if ! npm ci --no-audit --no-fund; then
    restore_previous
    fail "npm ci failed — the running server was not touched"
  fi

  log "building"
  if ! npm run build; then
    restore_previous
    fail "build failed — the running server was not touched"
  fi

  log "reloading pm2 app $pm2_app"
  pm2 startOrReload ecosystem.config.cjs --update-env

  if ! wait_healthy "$health_url"; then
    restore_previous
    pm2 startOrReload ecosystem.config.cjs --update-env || true
    fail "health check failed on ${target:0:7} — previous release restored"
  fi

  pm2 save >/dev/null
  log "deployed ${target:0:7}: $(git log -1 --format='%s')"
}

# Healthy = the API answers with a status below 500. A crashed server gives no
# answer and a broken bundle answers 500, so both roll back. (So would a
# Supabase outage during the deploy — rerun `update-cms` once it recovers.)
wait_healthy() {
  local url="$1" code
  for _ in $(seq 1 15); do
    code="$(curl -s -o /dev/null -m 5 -w '%{http_code}' "$url" || true)"
    if [[ "$code" =~ ^[1-4][0-9][0-9]$ ]]; then
      printf '[update-cms] health check OK (HTTP %s)\n' "$code"
      return 0
    fi
    sleep 2
  done
  printf '[update-cms] health check failed (last HTTP %s)\n' "${code:-none}"
  return 1
}

main "$@"
exit $?
