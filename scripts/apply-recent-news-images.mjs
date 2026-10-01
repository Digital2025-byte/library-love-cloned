/**
 * One-off admin task: give the Recent News blocks real Media Library images.
 *
 *   1. Convert each article image in flychamadmin/public to WebP (sharp),
 *      highest quality that fits under 400 KB; longest side capped at 2560 px.
 *   2. Upload to cms-media/recent-news/<name>.webp (upsert).
 *   3. Rewrite imageUrl in every "recent-news" component (EN + AR) from the
 *      old relative path to the bucket URL. Old content is saved to
 *      scripts/.media-backup/recent-news-content-<ts>.json first.
 *
 *   node scripts/apply-recent-news-images.mjs [--dry-run]
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(resolve(process.cwd(), "../flychamwebsite/node_modules/sharp"));
}

function loadEnv() {
  const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const BUCKET = "cms-media";
const FOLDER = "recent-news";
const PUBLIC_DIR = resolve(process.cwd(), "../flychamadmin/public");
const TARGET = 396 * 1024;
const MAX_DIM = 2560;
const DRY_RUN = process.argv.includes("--dry-run");

// Old relative imageUrl (as stored in content) → new object name.
const IMAGES = {
  "/media-center/latest-news.jpg": "latest-news.webp",
  "/media-center/news-grid-2.jpg": "news-grid-2.webp",
  "/media-center/news-grid-3.jpg": "news-grid-3.webp",
  "/our-destinations/damascus.jpeg": "damascus.webp",
  "/our-destinations/istanbul.jpg": "istanbul.webp",
  "/our-destinations/dubai.jpg": "dubai.webp",
};

let token = "";
const headers = (extra = {}) => ({ apikey: key, Authorization: `Bearer ${token}`, ...extra });
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

async function signIn() {
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(j)}`);
  token = j.access_token;
}

/** Highest-quality WebP under TARGET; shrinks 15% per step if q50 won't fit. */
async function toWebp(file) {
  const meta = await sharp(file).metadata();
  let dim = Math.min(MAX_DIM, Math.max(meta.width, meta.height));
  for (; dim >= 480; dim = Math.floor(dim * 0.85)) {
    let lo = 50, hi = 90, best = null;
    while (lo <= hi) {
      const q = Math.floor((lo + hi) / 2);
      const buf = await sharp(file)
        .rotate()
        .resize(dim, dim, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: q, effort: 6, smartSubsample: true })
        .toBuffer();
      if (buf.length <= TARGET) {
        best = { buf, q };
        lo = q + 1;
      } else hi = q - 1;
    }
    if (best) {
      const out = await sharp(best.buf).metadata();
      return { ...best, dims: `${meta.width}x${meta.height} → ${out.width}x${out.height}` };
    }
  }
  throw new Error(`${file}: cannot fit ${kb(TARGET)}`);
}

await signIn();

// 1+2: convert and upload, one by one.
const newUrl = {};
for (const [oldPath, name] of Object.entries(IMAGES)) {
  const file = resolve(PUBLIC_DIR, "." + oldPath);
  const before = readFileSync(file).length;
  const { buf, q, dims } = await toWebp(file);
  const objectPath = `${FOLDER}/${name}`;
  console.log(`  ${oldPath}  ${kb(before)} → ${objectPath} ${kb(buf.length)}  q=${q}  ${dims}`);
  if (!DRY_RUN) {
    const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${objectPath}`, {
      method: "POST",
      headers: headers({ "Content-Type": "image/webp", "cache-control": "3600", "x-upsert": "true" }),
      body: buf,
    });
    if (!up.ok) throw new Error(`upload ${objectPath}: ${up.status} ${await up.text()}`);
  }
  newUrl[oldPath] = `${url}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

// 3: repoint every recent-news component.
const r = await fetch(`${url}/rest/v1/components?select=id,content&type=eq.recent-news`, {
  headers: headers(),
});
const rows = await r.json();
if (!Array.isArray(rows)) throw new Error(`Read components failed: ${JSON.stringify(rows)}`);

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = resolve(process.cwd(), "scripts/.media-backup");
mkdirSync(backupDir, { recursive: true });
writeFileSync(resolve(backupDir, `recent-news-content-${stamp}.json`), JSON.stringify(rows, null, 2));

for (const row of rows) {
  let changed = 0;
  for (const lang of Object.values(row.content || {})) {
    for (const item of lang?.items || []) {
      if (newUrl[item.imageUrl]) {
        item.imageUrl = newUrl[item.imageUrl];
        changed += 1;
      }
    }
  }
  console.log(`  component ${row.id}: ${changed} image(s) repointed`);
  if (!changed || DRY_RUN) continue;
  const p = await fetch(`${url}/rest/v1/components?id=eq.${row.id}`, {
    method: "PATCH",
    headers: headers({ "Content-Type": "application/json", Prefer: "return=representation" }),
    body: JSON.stringify({ content: row.content }),
  });
  const j = await p.json();
  // RLS silently filters updates it refuses, so confirm a row came back.
  if (!p.ok || !Array.isArray(j) || j.length !== 1)
    throw new Error(`PATCH ${row.id} failed: ${p.status} ${JSON.stringify(j).slice(0, 300)}`);
}
console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
