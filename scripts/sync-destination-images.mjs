/**
 * Mirror new_fly_cham/src/assets/Images for Destionation and Things to Do/…
 * into the "destination-images" Storage bucket ("Destination and Things to
 * Do Images" in the admin), keeping the folder hierarchy.
 *
 *   - Every image (jpg/jpeg/png/webp/avif) → WebP ≤ 400 KB (highest quality
 *     that fits; full resolution when possible, else longest side ≤ 2560 px
 *     then −15% steps). Non-images (Thumbs.db, .docx, partial downloads) are
 *     skipped.
 *   - Supabase Storage rejects non-ASCII keys, so Arabic folder/file names are
 *     transliterated to Latin slugs. `_names.json` at the bucket root maps
 *     every stored path segment back to its original name; the admin picker
 *     uses it to show the original tree.
 *
 *   node scripts/sync-destination-images.mjs --convert   # local only → scripts/.destination-images/
 *   node scripts/sync-destination-images.mjs --upload    # upload converted tree + _names.json
 *   (add --dry-run to --upload to only list)
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join, dirname, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(resolve(process.cwd(), "../flychamwebsite/node_modules/sharp"));
}

const SOURCE = resolve(
  process.cwd(),
  "../new_fly_cham/src/assets/Images for Destionation and Things to Do/Images for Destionation and Things to Do"
);
const OUT = resolve(process.cwd(), "scripts/.destination-images");
const BUCKET = "destination-images";
const TARGET = 396 * 1024;
const MAX_DIM = 2560;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const CONVERT = process.argv.includes("--convert");
const UPLOAD = process.argv.includes("--upload");
const DRY_RUN = process.argv.includes("--dry-run");

// ---- names ------------------------------------------------------------------
const AR = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "aa", "ٱ": "a", "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s",
  "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f",
  "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "ة": "a", "و": "w",
  "ؤ": "w", "ي": "y", "ى": "a", "ئ": "y", "ء": "", "پ": "p", "چ": "ch", "گ": "g",
  "ڤ": "v", "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6",
  "٧": "7", "٨": "8", "٩": "9",
};
/** ASCII-safe path segment (Storage key rules), readable for Latin names. */
function slug(name) {
  const latin = [...name.normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g, "")]
    .map((c) => (AR[c] !== undefined ? AR[c] : c))
    .join("");
  return (
    latin
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

/** Walk SOURCE → [{ src, key, labels: original segment names }], unique keys per folder. */
function plan() {
  const files = [];
  const names = {}; // stored path (folder or file, no ext for files) → original name
  const walk = (dir, keyPrefix) => {
    const used = new Set();
    const uniq = (s) => {
      let k = s, n = 2;
      while (used.has(k)) k = `${s}-${n++}`;
      used.add(k);
      return k;
    };
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        const seg = uniq(slug(entry));
        const key = keyPrefix ? `${keyPrefix}/${seg}` : seg;
        names[key] = entry;
        walk(full, key);
      } else if (IMAGE_EXT.has(extname(entry).toLowerCase())) {
        const base = entry.slice(0, -extname(entry).length);
        const seg = uniq(slug(base));
        const key = `${keyPrefix ? `${keyPrefix}/` : ""}${seg}.webp`;
        names[key] = base;
        files.push({ src: full, key });
      }
    }
  };
  walk(SOURCE, "");
  return { files, names };
}

async function toWebp(input) {
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const full = Math.max(meta.width, meta.height);
  const sizes = [full];
  for (let d = Math.min(MAX_DIM, Math.floor(full * 0.85)); d >= 480; d = Math.floor(d * 0.85)) sizes.push(d);
  for (const dim of sizes) {
    let lo = 50, hi = 88, best = null;
    while (lo <= hi) {
      const q = Math.floor((lo + hi) / 2);
      const buf = await sharp(input, { failOn: "none" })
        .rotate()
        .resize(dim, dim, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: q, effort: 5, smartSubsample: true })
        .toBuffer();
      if (buf.length <= TARGET) {
        best = buf;
        lo = q + 1;
      } else hi = q - 1;
    }
    if (best) return best;
  }
  throw new Error("cannot fit 400 KB");
}

const { files, names } = plan();
console.log(`${files.length} image(s), ${Object.keys(names).length - files.length} folder(s) under source.`);

// --shard=i/n converts every n-th image (run n processes in parallel).
const [shardI, shardN] = (process.argv.find((a) => a.startsWith("--shard="))?.slice(8) || "0/1")
  .split("/")
  .map(Number);

if (CONVERT) {
  let done = 0, skipped = 0, failed = 0, bytes = 0;
  for (const [index, f] of files.entries()) {
    if (index % shardN !== shardI) continue;
    const out = join(OUT, ...f.key.split("/"));
    if (existsSync(out)) {
      skipped++;
      continue;
    }
    try {
      const buf = await toWebp(readFileSync(f.src));
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, buf);
      bytes += buf.length;
      done++;
      if (done % 25 === 0) console.log(`  converted ${done} (skipped ${skipped}, failed ${failed})`);
    } catch (e) {
      failed++;
      console.log(`  FAILED ${f.src}: ${e.message}`);
    }
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "_names.json"), JSON.stringify(names, null, 1));
  console.log(`Converted ${done}, already done ${skipped}, failed ${failed}; ${(bytes / 1048576).toFixed(1)} MB written to ${OUT}`);
}

if (UPLOAD) {
  for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
    const t = line.trim();
    const eq = t.indexOf("=");
    if (!t || t.startsWith("#") || eq === -1) continue;
    const k = t.slice(0, eq).trim();
    if (!process.env[k]) process.env[k] = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const auth = await (
    await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
    })
  ).json();
  if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
  const headers = { apikey: key, Authorization: `Bearer ${auth.access_token}` };

  const todo = [...files.map((f) => f.key), "_names.json"].filter((k) => existsSync(join(OUT, ...k.split("/"))));
  console.log(`${todo.length} object(s) to upload to "${BUCKET}"${DRY_RUN ? " (dry run)" : ""}.`);
  if (DRY_RUN) process.exit(0);

  let cursor = 0, done = 0;
  const failed = [];
  const worker = async () => {
    while (cursor < todo.length) {
      const k = todo[cursor++];
      const body = readFileSync(join(OUT, ...k.split("/")));
      const type = k.endsWith(".json") ? "application/json" : "image/webp";
      for (let attempt = 1; ; attempt++) {
        try {
          const r = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodeURI(k)}`, {
            method: "POST",
            headers: { ...headers, "Content-Type": type, "cache-control": "3600", "x-upsert": "true" },
            body,
          });
          if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
          break;
        } catch (e) {
          if (attempt >= 3) {
            failed.push(`${k}: ${e.message}`);
            break;
          }
        }
      }
      if (++done % 50 === 0) console.log(`  uploaded ${done}/${todo.length}`);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`Uploaded ${todo.length - failed.length}/${todo.length}.`);
  failed.slice(0, 20).forEach((f) => console.log(`  FAILED ${f}`));
}
