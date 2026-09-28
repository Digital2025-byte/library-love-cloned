// PM2 process config for the FlyCham CMS backend (Hostinger VPS).
//   Start:   pm2 start ecosystem.config.cjs
//   Reload:  pm2 reload flycham-cms   (zero-downtime after a new build)
//   Logs:    pm2 logs flycham-cms
//   Boot:    pm2 startup && pm2 save   (restart on server reboot)
//
// The VPS already runs traefik on port 80/443, so this app is exposed directly
// on port 3000 (HOST 0.0.0.0 = all interfaces) and the frontends call
// http://<vps-ip>:3000. The Supabase publishable key is a PUBLIC key (the same
// one shipped in the other apps' client bundles) — no service_role secret here.
module.exports = {
  apps: [
    {
      name: "flycham-cms",
      script: ".output/server/index.mjs",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "3000",
        SUPABASE_URL: "https://xbqrfakpcisqunyugrqt.supabase.co",
        SUPABASE_PUBLISHABLE_KEY: "sb_publishable_DVuilPL7OZyKMZ266JYJGA_eEaVyfpL",
      },
    },
  ],
};
