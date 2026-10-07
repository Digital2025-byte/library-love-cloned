# Deploying the FlyCham CMS backend to a Hostinger VPS

This app is a **backend-only** service. The editing UI lives in `flychamadmin`
(the `cms2` module); this app only exposes the public CMS API and reads/writes
the Supabase database.

**Endpoints** (all under `/api/public`):

| Method | Path | Auth | Used by |
| --- | --- | --- | --- |
| GET  | `/api/public/get-pages` | none | website + admin |
| GET  | `/api/public/get-page?slug=<slug>[&lang=<lang>]` | none | website + admin |
| POST | `/api/public/create-component` | `Authorization: Bearer <supabase token>` | admin |
| POST | `/api/public/update-component` | `Authorization: Bearer <supabase token>` | admin |
| POST | `/api/public/delete-component` | `Authorization: Bearer <supabase token>` | admin |

The build is a **Node server** (Nitro `node-server` preset) → `.output/server/index.mjs`,
run with `node .output/server/index.mjs`. It listens on `HOST`/`PORT` (default
`0.0.0.0:3000`). Writes are authorized by the caller's Supabase token + row-level
security — there is **no `service_role` secret** on this server.

> Requires a **Hostinger VPS** (KVM, root, Node 20+). Shared/web hosting cannot
> run a Node server.

## Fresh or wiped VPS: one command

[deploy/bootstrap-vps.sh](deploy/bootstrap-vps.sh) rebuilds the whole stack:
this backend (`:3000`), the public site from `fly-cham-cms` (`:4000`), Caddy
with HTTPS for `cms-flycham.alpatrose.com` and `cms-api.cms-flycham.alpatrose.com`,
pm2-on-boot and the GitHub Actions login key. As root on the VPS:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Digital2025-byte/library-love-cloned/main/deploy/bootstrap-vps.sh)
```

It pauses once to have you add the site repo's deploy key on GitHub, and writes
the CI secrets for both repos to `/root/flycham-ci-secrets.txt`. Sections 1–9
below are the manual steps it automates.

---

## 1. DNS

Point a subdomain at the VPS IP:

```
cms.flycham.com   A   <your-vps-ip>
```

## 2. One-time server setup (SSH as root)

```bash
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs nginx
npm install -g pm2

# App directory
mkdir -p /var/www/flycham-cms
```

## 3. Get the code onto the server

Copy the `cms/` folder to `/var/www/flycham-cms` (git clone, `scp`, or rsync).
Do **not** copy `node_modules` or `.output` — they are rebuilt on the server.

## 4. Build

```bash
cd /var/www/flycham-cms
cp .env.production.example .env.production   # values are already filled in
npm ci
npm run build          # produces .output/server/index.mjs (Node server)
```

`.env.production` supplies `VITE_SUPABASE_*`, which Vite bakes into the build.

## 5. Run with PM2

`ecosystem.config.cjs` already carries the runtime env (`PORT=3000`,
`HOST=127.0.0.1`, and the public Supabase URL + publishable key).

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # run the command it prints, so it restarts on reboot
pm2 logs flycham-cms   # verify: "Listening on http://127.0.0.1:3000/"
```

Quick local check:

```bash
curl http://127.0.0.1:3000/api/public/get-pages
```

## 6. nginx + HTTPS

```bash
cp deploy/nginx.conf.example /etc/nginx/sites-available/cms.flycham.com
# edit server_name to your subdomain
ln -s /etc/nginx/sites-available/cms.flycham.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d cms.flycham.com    # adds HTTPS + auto-renewal
```

Verify from anywhere:

```bash
curl https://cms.flycham.com/api/public/get-pages
```

## 7. Point the other apps at it (stop using localhost)

Set these to `https://cms.flycham.com`, then **rebuild & redeploy each app**
(Vite bakes the value at build time):

- `new_fly_cham/.env` and `new_fly_cham/.env.production`
  → `VITE_CMS_API_BASE_URL=https://cms.flycham.com`
- `flychamadmin/.env.development` and `flychamadmin/.env.production`
  → `VITE_CMS2_API_BASE_URL=https://cms.flycham.com`

## 8. Updating after a code change

Pushing to `main` deploys automatically (section 9). To deploy by hand, run on
the server:

```bash
update-cms              # latest origin/main
update-cms <commit>     # a specific commit (e.g. to go back to an older release)
FORCE=1 update-cms      # rebuild the current commit
```

`update-cms` ([deploy/update-cms.sh](deploy/update-cms.sh)) fetches, checks out
the commit, runs `npm ci` + `npm run build`, reloads PM2 and health-checks
`/api/public/get-pages`. If the build or the health check fails it restores the
previous commit and build, so the live API keeps serving the last good release.

## 9. Automatic deploys (CI/CD)

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs on GitHub
Actions:

| Event | What runs |
| --- | --- |
| Pull request to `main` | typecheck + build (nothing is deployed) |
| Push to `main` | typecheck + build, then SSH to the VPS and run `update-cms <sha>` |
| Actions → **CMS CI/CD** → *Run workflow* | same as a push (manual redeploy) |

A commit that fails the typecheck or the build never reaches the server.

### One-time setup

**A. Make the server folder a git clone.** The server pulls from GitHub, so it
needs a read-only *deploy key* for the repo:

```bash
# on the VPS, as the user that runs pm2 (root)
apt-get install -y git curl util-linux        # git, curl, flock
ssh-keygen -t ed25519 -N "" -C "flycham-cms server" -f ~/.ssh/flycham_cms_repo
cat >> ~/.ssh/config <<'EOF'
Host github-flycham-cms
  HostName github.com
  User git
  IdentityFile ~/.ssh/flycham_cms_repo
  IdentitiesOnly yes
EOF
cat ~/.ssh/flycham_cms_repo.pub
```

Add that public key in GitHub → repo **Settings → Deploy keys → Add deploy key**
(leave *Allow write access* off). Then replace the copied folder with a clone,
keeping the env file:

```bash
cd /var/www
mv flycham-cms flycham-cms.old
git clone git@github-flycham-cms:Digital2025-byte/library-love-cloned.git flycham-cms
cp flycham-cms.old/.env.production flycham-cms/ 2>/dev/null || true

# install the command
printf '#!/bin/sh\nexec bash /var/www/flycham-cms/deploy/update-cms.sh "$@"\n' > /usr/local/bin/update-cms
chmod +x /usr/local/bin/update-cms

FORCE=1 update-cms                             # first build from the clone
rm -rf /var/www/flycham-cms.old                # once the API answers again
```

**B. Let GitHub Actions log in to the VPS.** Create a key pair used *only* by
the pipeline (on your own machine):

```bash
ssh-keygen -t ed25519 -N "" -C "github-actions flycham-cms" -f cms_actions
ssh-copy-id -i cms_actions.pub root@187.127.155.20     # or append to ~/.ssh/authorized_keys
ssh-keyscan -t ed25519 187.127.155.20                    # → CMS_SSH_KNOWN_HOSTS
```

**C. Add the repository secrets** (GitHub → **Settings → Secrets and variables →
Actions → New repository secret**):

| Secret | Value |
| --- | --- |
| `CMS_SSH_HOST` | `187.127.155.20` |
| `CMS_SSH_USER` | `root` (the user that owns the pm2 process) |
| `CMS_SSH_KEY` | full contents of the private key `cms_actions` |
| `CMS_SSH_KNOWN_HOSTS` | the `ssh-keyscan` output line |
| `CMS_SSH_PORT` | optional, only if SSH is not on port 22 |

Then delete the local `cms_actions` private key. The deploy job uses the GitHub
environment **production** (created automatically on the first run); add
*Required reviewers* to it if deploys should wait for a manual approval.

**D. Test it:** Actions → **CMS CI/CD** → *Run workflow*. The *Deploy to VPS*
log shows the `update-cms` output, ending with `deployed <sha>: <message>`.

---

## Troubleshooting

- **`__commonJSMin is not a function` at runtime** — the build code-split the
  CommonJS-interop helper away from the router chunk. Fixed by
  `nitro: { inlineDynamicImports: true }` in `vite.config.ts` (single-chunk
  server). Do not remove that option.
- **Build produced `wrangler.json` / a Cloudflare Worker** — the Nitro preset
  fell back to cloudflare. Ensure `nitro: { preset: "node-server" }` is set in
  `vite.config.ts`.
- **`get-pages` returns a 500 HTML error page** — check `pm2 logs flycham-cms`.
  Usually a missing/incorrect `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY`.
- **Admin writes return 401** — the admin must send `Authorization: Bearer
  <supabase access token>`; `403` means RLS rejected the token (not an admin).
