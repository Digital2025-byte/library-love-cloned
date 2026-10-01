/**
 * Repair CMS links to cms-media PNG/JPEG objects that no longer exist
 * (deleted by the 2026-09-23 media sync):
 *   - if <path>.webp already exists in the bucket → repoint to it
 *   - else if the original is in the 2026-09-23 backup → encode it to WebP
 *     (≤ 400 KB), upload as <path>.webp, repoint
 * Scans components.content/style, site_header.data, site_footer.data.
 *
 *   node scripts/fix-dangling-media-links.mjs [--dry-run]
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(resolve(process.cwd(), "../flychamwebsite/node_modules/sharp"));
}

for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  const eq = t.indexOf("=");
  if (!t || t.startsWith("#") || eq === -1) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!process.env[k]) process.env[k] = v;
}
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const BUCKET = "cms-media";
const BACKUP = resolve(process.cwd(), "scripts/.media-backup/2026-09-23T10-11-06-172Z");
const TARGET = 396 * 1024;
const DRY_RUN = process.argv.includes("--dry-run");

const auth = await (
  await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
  })
).json();
if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
const headers = (extra = {}) => ({ apikey: key, Authorization: `Bearer ${auth.access_token}`, ...extra });
const exists = async (p) =>
  (await fetch(`${url}/storage/v1/object/public/${BUCKET}/${encodeURI(p)}`, { method: "HEAD" })).ok;

async function toWebp(input) {
  const meta = await sharp(input).metadata();
  const full = Math.max(meta.width, meta.height);
  const sizes = [full];
  for (let d = Math.min(2560, Math.floor(full * 0.85)); d >= 480; d = Math.floor(d * 0.85)) sizes.push(d);
  for (const dim of sizes) {
    let lo = 50, hi = 90, best = null;
    while (lo <= hi) {
      const q = Math.floor((lo + hi) / 2);
      const buf = await sharp(input).rotate()
        .resize(dim, dim, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: q, effort: 6, smartSubsample: true, alphaQuality: 100 }).toBuffer();
      if (buf.length <= TARGET) { best = buf; lo = q + 1; } else hi = q - 1;
    }
    if (best) return best;
  }
  throw new Error("cannot fit 400 KB");
}

const TABLES = [
  { table: "components", cols: ["content", "style"] },
  { table: "site_header", cols: ["data"] },
  { table: "site_footer", cols: ["data"] },
];
const rows = {};
let text = "";
for (const { table, cols } of TABLES) {
  rows[table] = await (await fetch(`${url}/rest/v1/${table}?select=id,${cols.join(",")}`, { headers: headers() })).json();
  text += JSON.stringify(rows[table]);
}

const linked = [...new Set([...text.matchAll(/\/cms-media\/([^"?#]+\.(?:png|jpe?g))(?=["?#])/gi)].map((m) => m[1]))];
const map = {};
for (const p of linked) {
  if (await exists(p)) continue; // not dangling
  const next = p.replace(/\.(png|jpe?g)$/i, ".webp");
  if (await exists(next)) {
    map[p] = next;
    console.log(`  repoint  ${p} → ${next} (already in bucket)`);
    continue;
  }
  const file = join(BACKUP, ...p.split("/"));
  if (!existsSync(file)) {
    console.log(`  MISSING  ${p} — no webp and no backup, left as is`);
    continue;
  }
  const buf = await toWebp(readFileSync(file));
  if (!DRY_RUN) {
    const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodeURI(next)}`, {
      method: "POST",
      headers: headers({ "Content-Type": "image/webp", "cache-control": "3600", "x-upsert": "true" }),
      body: buf,
    });
    if (!up.ok) throw new Error(`upload ${next}: ${up.status} ${await up.text()}`);
  }
  map[p] = next;
  console.log(`  restore  ${p} → ${next} ${(buf.length / 1024).toFixed(0)} KB (from backup)`);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
mkdirSync(resolve(process.cwd(), "scripts/.media-backup"), { recursive: true });
writeFileSync(resolve(process.cwd(), `scripts/.media-backup/dangling-rows-${stamp}.json`), JSON.stringify(rows, null, 2));

let total = 0;
for (const { table, cols } of TABLES) {
  for (const row of rows[table]) {
    const patch = {};
    for (const c of cols) {
      let s = JSON.stringify(row[c]);
      let hits = 0;
      for (const [from, to] of Object.entries(map)) {
        const re = new RegExp(`/${BUCKET}/${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=["?#])`, "g");
        s = s.replace(re, () => (hits++, `/${BUCKET}/${to}`));
      }
      if (hits) { patch[c] = JSON.parse(s); total += hits; }
    }
    if (!Object.keys(patch).length || DRY_RUN) continue;
    const p = await fetch(`${url}/rest/v1/${table}?id=eq.${row.id}`, {
      method: "PATCH",
      headers: headers({ "Content-Type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify(patch),
    });
    const j = await p.json();
    if (!p.ok || !Array.isArray(j) || j.length !== 1)
      throw new Error(`PATCH ${table} ${row.id} failed: ${p.status} ${JSON.stringify(j).slice(0, 300)}`);
  }
}
console.log(`${DRY_RUN ? "Would repoint" : "Repointed"} ${total} link(s).`);
