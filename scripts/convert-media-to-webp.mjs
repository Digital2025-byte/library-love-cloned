/**
 * Convert every PNG/JPEG in the "cms-media" bucket to WebP (≤ 400 KB) and
 * repoint everything that links to it. SVGs are left alone. The old PNG/JPEG
 * objects are NOT deleted — remove them yourself once you've checked the site.
 *
 *   1. List the bucket; targets = image/png + image/jpeg objects.
 *   2. One by one: download → back up → encode WebP at the highest quality
 *      that fits (full resolution when possible; otherwise longest side capped
 *      at 2560 px, then shrunk 15% per step) → upload as <same path>.webp.
 *   3. Rewrite every link to the old object in components.content/style,
 *      site_header.data and site_footer.data (row backups saved first).
 *
 *   node scripts/convert-media-to-webp.mjs --dry-run   # encode + report only
 *   node scripts/convert-media-to-webp.mjs
 *
 * Backups: scripts/.media-backup/webp-<timestamp>/ (originals, _rows.json,
 * _plan.json = old path → new path list).
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
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
const TARGET = 396 * 1024;
const MAX_DIM = 2560;
const DRY_RUN = process.argv.includes("--dry-run");

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let token = "";
const headers = (extra = {}) => ({ apikey: key, Authorization: `Bearer ${token}`, ...extra });

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

async function listAll(prefix = "") {
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const r = await fetch(`${url}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefix, limit: 1000, offset }),
    });
    const rows = await r.json();
    if (!Array.isArray(rows)) throw new Error(`List failed: ${JSON.stringify(rows)}`);
    for (const o of rows) {
      const path = prefix ? `${prefix}/${o.name}` : o.name;
      if (o.id) out.push({ path, size: o.metadata?.size ?? 0, type: o.metadata?.mimetype || "" });
      else out.push(...(await listAll(path)));
    }
    if (rows.length < 1000) break;
  }
  return out;
}

/** WebP at the highest quality ≤ TARGET: full size first, then smaller. */
async function toWebp(input) {
  const meta = await sharp(input).metadata();
  const full = Math.max(meta.width, meta.height);
  const sizes = [full];
  for (let d = Math.min(MAX_DIM, Math.floor(full * 0.85)); d >= 480; d = Math.floor(d * 0.85))
    sizes.push(d);
  for (const dim of sizes) {
    let lo = 50, hi = 90, best = null;
    while (lo <= hi) {
      const q = Math.floor((lo + hi) / 2);
      const buf = await sharp(input)
        .rotate()
        .resize(dim, dim, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: q, effort: 6, smartSubsample: true, alphaQuality: 100 })
        .toBuffer();
      if (buf.length <= TARGET) {
        best = { buf, q };
        lo = q + 1;
      } else hi = q - 1;
    }
    if (best) {
      const out = await sharp(best.buf).metadata();
      const d = `${meta.width}x${meta.height}`;
      return { ...best, dims: dim === full ? d : `${d} → ${out.width}x${out.height}` };
    }
  }
  throw new Error("cannot fit 400 KB");
}

const toWebpPath = (p) => p.replace(/\.(png|jpe?g)$/i, ".webp");
const publicUrl = (p) => `${url}/storage/v1/object/public/${BUCKET}/${p}`;

await signIn();
const all = await listAll();
const existing = new Set(all.map((o) => o.path));
const targets = all
  .filter((o) => o.type === "image/png" || o.type === "image/jpeg")
  .sort((a, b) => b.size - a.size);

// A same-named .webp already in the bucket might be a different picture that
// something else links to — never overwrite it; use a -2 suffix instead.
const plan = targets.map((o) => {
  let next = toWebpPath(o.path);
  if (existing.has(next)) next = next.replace(/\.webp$/, "-2.webp");
  return { ...o, next };
});

console.log(
  `Bucket: ${all.length} object(s); ${plan.length} PNG/JPEG to convert${DRY_RUN ? " (dry run)" : ""}.`
);

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = resolve(process.cwd(), "scripts/.media-backup", `webp-${stamp}`);
const converted = [];

for (const [i, o] of plan.entries()) {
  process.stdout.write(`(${i + 1}/${plan.length}) ${o.path} `);
  try {
    const r = await fetch(publicUrl(encodeURI(o.path)));
    if (!r.ok) throw new Error(`download ${r.status}`);
    const input = Buffer.from(await r.arrayBuffer());
    const file = join(backupRoot, ...o.path.split("/"));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, input);

    const { buf, q, dims } = await toWebp(input);
    if (!DRY_RUN) {
      const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodeURI(o.next)}`, {
        method: "POST",
        headers: headers({ "Content-Type": "image/webp", "cache-control": "3600", "x-upsert": "true" }),
        body: buf,
      });
      if (!up.ok) throw new Error(`upload ${up.status} ${await up.text()}`);
    }
    console.log(`${kb(input.length)} → ${o.next} ${kb(buf.length)} q=${q} ${dims}`);
    converted.push({ path: o.path, next: o.next });
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
  }
}

// ---- repoint links ---------------------------------------------------------
// Object paths can appear raw or URI-encoded (spaces etc.).
const replacements = converted.flatMap((o) => {
  const pairs = [[`/${BUCKET}/${o.path}`, `/${BUCKET}/${o.next}`]];
  const enc = encodeURI(o.path);
  if (enc !== o.path) pairs.push([`/${BUCKET}/${enc}`, `/${BUCKET}/${encodeURI(o.next)}`]);
  return pairs;
});
// Match whole names only: the path must end at a quote, ? or #.
function rewrite(value) {
  let text = JSON.stringify(value);
  let hits = 0;
  for (const [from, to] of replacements) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[\"?#])", "g");
    text = text.replace(re, () => {
      hits += 1;
      return to;
    });
  }
  return { value: JSON.parse(text), hits };
}

const TABLES = [
  { table: "components", cols: ["content", "style"] },
  { table: "site_header", cols: ["data"] },
  { table: "site_footer", cols: ["data"] },
];

const rowBackups = {};
const updates = [];
for (const { table, cols } of TABLES) {
  const r = await fetch(`${url}/rest/v1/${table}?select=id,${cols.join(",")}`, { headers: headers() });
  const rows = await r.json();
  if (!Array.isArray(rows)) throw new Error(`Read ${table} failed: ${JSON.stringify(rows)}`);
  rowBackups[table] = rows;
  for (const row of rows) {
    const patch = {};
    let hits = 0;
    for (const c of cols) {
      const res = rewrite(row[c]);
      if (res.hits) {
        patch[c] = res.value;
        hits += res.hits;
      }
    }
    if (hits) updates.push({ table, id: row.id, patch, hits });
  }
}
mkdirSync(backupRoot, { recursive: true });
writeFileSync(join(backupRoot, "_rows.json"), JSON.stringify(rowBackups, null, 2));
writeFileSync(join(backupRoot, "_plan.json"), JSON.stringify(converted, null, 2));

console.log(`\nLinks to repoint: ${updates.reduce((s, u) => s + u.hits, 0)} in ${updates.length} row(s).`);
for (const u of updates) console.log(`  ${u.table} ${u.id}: ${u.hits}`);

if (DRY_RUN) {
  console.log(`\nDry run — nothing uploaded or updated. Backups: ${backupRoot}`);
  process.exit(0);
}

for (const u of updates) {
  const p = await fetch(`${url}/rest/v1/${u.table}?id=eq.${u.id}`, {
    method: "PATCH",
    headers: headers({ "Content-Type": "application/json", Prefer: "return=representation" }),
    body: JSON.stringify(u.patch),
  });
  const j = await p.json();
  // RLS silently filters updates it refuses, so confirm a row came back.
  if (!p.ok || !Array.isArray(j) || j.length !== 1)
    throw new Error(`PATCH ${u.table} ${u.id} failed: ${p.status} ${JSON.stringify(j).slice(0, 300)}`);
}
console.log(`DB updated. Old PNG/JPEG objects left in place. Backups: ${backupRoot}`);
