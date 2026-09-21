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

```bash
cd /var/www/flycham-cms
git pull                # or re-copy the folder
npm ci
npm run build
pm2 reload flycham-cms  # zero-downtime restart
```

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
