/**
 * Compress every image in the "cms-media" Storage bucket that is over 400 KB,
 * one by one, WITHOUT changing its resolution, format, or path (so every CMS
 * URL keeps working).
 *
 * Per image: download → back up the original → re-encode with sharp at the
 * HIGHEST quality that fits under the limit (binary search) → verify the
 * width/height are unchanged → upsert to the same object path.
 *
 *   webp → libwebp (effort 6, smart subsampling, alpha kept)
 *   jpeg → mozjpeg (progressive, trellis)
 *   png  → lossless max compression first, then libimagequant palette
 *          (alpha kept) with decreasing quality
 *
 *   node scripts/compress-media-library.mjs --dry-run   # compress to disk only, no upload
 *   node scripts/compress-media-library.mjs             # do it
 *   node scripts/compress-media-library.mjs --only=seat-selection/foo.webp
 *   node scripts/compress-media-library.mjs --local=path/to/file.webp  # test one local file
 *
 * Originals go to scripts/.media-backup/compress-<timestamp>/ and compressed
 * files to scripts/.media-compress/<timestamp>/ for review.
 *
 *   node scripts/compress-media-library.mjs --max-dim=2560
 *       # also downscale ONLY images that can't fit at full resolution
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join, dirname, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  // cms/ has no image deps; borrow the website's sharp install.
  sharp = require(resolve(process.cwd(), "../flychamwebsite/node_modules/sharp"));
}

const MAX_BYTES = 400 * 1024;
const TARGET = MAX_BYTES - 4 * 1024; // small safety margin
const MIN_QUALITY = 50; // below this we stop and report instead of wrecking the image
const BUCKET = "cms-media";

const DRY_RUN = process.argv.includes("--dry-run");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7) || "";
const LOCAL = process.argv.find((a) => a.startsWith("--local="))?.slice(8) || "";
// Opt-in: images that CAN'T fit at full resolution (e.g. 12 MP photos) get their
// longest side reduced to this many px and are searched again. Off by default.
const MAX_DIM = Number(process.argv.find((a) => a.startsWith("--max-dim="))?.slice(10)) || 0;

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

/** Encode at a given quality (0-100) keeping the source format. */
function encode(input, format, quality, dither = 1, maxDim = 0) {
  let img = sharp(input, { failOn: "none" }).rotate(); // bake EXIF orientation, same pixels
  if (maxDim) img = img.resize(maxDim, maxDim, { fit: "inside", withoutEnlargement: true });
  if (format === "webp")
    return img.webp({ quality, effort: 6, smartSubsample: true, alphaQuality: 100 }).toBuffer();
  if (format === "jpeg")
    return img.jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer();
  if (format === "png")
    return quality >= 100
      ? img.png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer()
      : img.png({ palette: true, quality, effort: 10, compressionLevel: 9, dither }).toBuffer();
  if (format === "avif") return img.avif({ quality, effort: 9 }).toBuffer();
  throw new Error(`unsupported format ${format}`);
}

/**
 * Highest quality whose output fits TARGET. Returns { buf, quality } or
 * { buf: null } when even MIN_QUALITY is too big.
 */
async function compress(input, maxDim = 0) {
  const meta = await sharp(input).metadata();
  const format = meta.format;
  if (!["webp", "jpeg", "png", "avif"].includes(format))
    return { skipped: `format ${format}` };

  // PNG: try lossless first — no quality loss at all.
  if (format === "png") {
    const lossless = await encode(input, format, 100, 1, maxDim);
    if (lossless.length <= TARGET) return { buf: lossless, quality: "lossless", meta };
  }

  const search = async (dither) => {
    let lo = MIN_QUALITY, hi = 95, best = null;
    while (lo <= hi) {
      const q = Math.floor((lo + hi) / 2);
      const buf = await encode(input, format, q, dither, maxDim);
      if (buf.length <= TARGET) {
        best = { buf, quality: q };
        lo = q + 1;
      } else hi = q - 1;
    }
    return best;
  };
  // PNG palettes: dithered looks smoother but is larger; drop it only if needed.
  let best = await search(1);
  if (!best && format === "png") {
    best = await search(0);
    if (best) best.quality = `${best.quality} (no dither)`;
  }
  return { ...(best || { buf: null }), meta };
}

async function processOne(label, input) {
  if (input.length <= MAX_BYTES) return { label, status: "ok-already", before: input.length };
  let res = await compress(input);
  let resized = false;
  if (!res.skipped && !res.buf && MAX_DIM) {
    // Start at MAX_DIM (or the image's own size if smaller), then shrink 15%
    // per step until it fits — the 400 KB cap wins over pixel count.
    const meta = res.meta;
    let dim = Math.min(MAX_DIM, Math.max(meta.width, meta.height));
    if (dim === Math.max(meta.width, meta.height)) dim = Math.floor(dim * 0.85);
    while (!res.buf && dim >= 480) {
      res = { ...(await compress(input, dim)), meta };
      resized = true;
      dim = Math.floor(dim * 0.85);
    }
  }
  if (res.skipped) return { label, status: `skipped (${res.skipped})`, before: input.length };
  if (!res.buf)
    return { label, status: `cannot reach 400 KB at q>=${MIN_QUALITY} (${res.meta.width}x${res.meta.height})`, before: input.length };
  const out = await sharp(res.buf).metadata();
  // .rotate() bakes EXIF orientation, which swaps w/h for orientations 5-8.
  const swap = (res.meta.orientation || 1) >= 5;
  const w = swap ? res.meta.height : res.meta.width;
  const h = swap ? res.meta.width : res.meta.height;
  if (!resized && (out.width !== w || out.height !== h))
    throw new Error(`${label}: dimensions changed ${w}x${h} → ${out.width}x${out.height}`);
  return {
    label,
    status: resized ? "compressed+resized" : "compressed",
    before: input.length,
    after: res.buf.length,
    quality: res.quality,
    dims: resized ? `${w}x${h} → ${out.width}x${out.height}` : `${out.width}x${out.height}`,
    buf: res.buf,
  };
}

function printRow(r) {
  const tail = r.after
    ? `${kb(r.before)} → ${kb(r.after)}  q=${r.quality}  ${r.dims}`
    : `${kb(r.before)}`;
  console.log(`  [${r.status}] ${r.label}  ${tail}`);
}

// ---- local test mode -------------------------------------------------------
if (LOCAL) {
  const input = readFileSync(LOCAL);
  const r = await processOne(LOCAL, input);
  printRow(r);
  if (r.buf) {
    const out = resolve(process.cwd(), "scripts/.media-compress/local", LOCAL.split(/[\\/]/).pop());
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, r.buf);
    console.log(`  wrote ${out}`);
  }
  process.exit(0);
}

// ---- bucket mode -----------------------------------------------------------
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
const email = process.env.CMS_ADMIN_EMAIL || "admin@flycham.local";
const password = process.env.CMS_ADMIN_PASSWORD || "FlyChamAdmin!2026";

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

/** Every object in the bucket with its size and mimetype. */
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

await signIn();
const all = await listAll();
const targets = all
  .filter((o) => (ONLY ? o.path === ONLY : o.size > MAX_BYTES))
  .filter((o) => o.type.startsWith("image/") && o.type !== "image/svg+xml" && o.type !== "image/gif")
  .sort((a, b) => b.size - a.size);

console.log(
  `Bucket "${BUCKET}": ${all.length} object(s), ${targets.length} image(s) over ${kb(MAX_BYTES)}${DRY_RUN ? " (dry run)" : ""}.`
);

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = resolve(process.cwd(), "scripts/.media-backup", `compress-${stamp}`);
const outRoot = resolve(process.cwd(), "scripts/.media-compress", stamp);
const results = [];

// One by one, as requested — no concurrency.
for (const [i, obj] of targets.entries()) {
  process.stdout.write(`(${i + 1}/${targets.length}) ${obj.path} ... `);
  try {
    const r0 = await fetch(`${url}/storage/v1/object/public/${BUCKET}/${encodeURI(obj.path)}`);
    if (!r0.ok) throw new Error(`download ${r0.status}`);
    const input = Buffer.from(await r0.arrayBuffer());

    const backupFile = join(backupRoot, ...obj.path.split("/"));
    mkdirSync(dirname(backupFile), { recursive: true });
    writeFileSync(backupFile, input);

    const r = await processOne(obj.path, input);
    if (r.buf) {
      const outFile = join(outRoot, ...obj.path.split("/"));
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, r.buf);

      if (!DRY_RUN) {
        const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodeURI(obj.path)}`, {
          method: "PUT",
          headers: headers({
            "Content-Type": obj.type || `image/${extname(obj.path).slice(1)}`,
            "cache-control": "3600",
            "x-upsert": "true",
          }),
          body: r.buf,
        });
        if (!up.ok) throw new Error(`upload ${up.status} ${await up.text()}`);
        r.status = r.status === "compressed+resized" ? "uploaded+resized" : "uploaded";
      }
    }
    delete r.buf;
    results.push(r);
    console.log("");
    printRow(r);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
    results.push({ label: obj.path, status: `failed: ${e.message}`, before: obj.size });
  }
}

const saved = results.reduce((s, r) => s + (r.after ? r.before - r.after : 0), 0);
console.log(`\nDone. Saved ${(saved / 1048576).toFixed(1)} MB.`);
console.log(`Originals: ${backupRoot}`);
console.log(`Compressed copies: ${outRoot}`);
const problems = results.filter((r) => !["uploaded", "uploaded+resized", "compressed", "compressed+resized", "ok-already"].includes(r.status));
if (problems.length) {
  console.log(`\nNeeds attention (${problems.length}):`);
  problems.forEach(printRow);
}
mkdirSync(outRoot, { recursive: true });
writeFileSync(join(outRoot, "_report.json"), JSON.stringify(results, null, 2));
