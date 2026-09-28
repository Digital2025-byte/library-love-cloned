/**
 * One-off admin task: replace the whole "cms-media" Storage bucket with the
 * public site's image set (new_fly_cham/src/assets/images-webp).
 *
 *   1. Back up every object currently in the bucket to
 *      scripts/.media-backup/<timestamp>/ (so the wipe is recoverable).
 *   2. Delete every object in the bucket.
 *   3. Upload every file under images-webp, keeping its folder as the object
 *      prefix (e.g. seat-selection/foo.webp). Top-level folders become the
 *      Media Library's folder filter options.
 *   4. Report CMS components whose content still points at a cms-media URL
 *      that no longer exists (those pages need a new image picked).
 *
 *   node scripts/sync-media-library.mjs            # do it
 *   node scripts/sync-media-library.mjs --dry-run  # only list what would happen
 *   node scripts/sync-media-library.mjs --only=media-center
 *       # upload/replace just that folder — no backup, nothing deleted
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join, dirname, relative, extname, sep } from "node:path";

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
const SOURCE_DIR = resolve(process.cwd(), "../new_fly_cham/src/assets/images-webp");
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7) || "";
const CONCURRENCY = 4;

const MIME = {
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

let token = "";
const headers = (extra = {}) => ({
  apikey: key,
  Authorization: `Bearer ${token}`,
  ...extra,
});

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

/** Every object path in the bucket (recurses into folders). */
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
      // Folders come back without an id.
      if (o.id) out.push(path);
      else out.push(...(await listAll(path)));
    }
    if (rows.length < 1000) break;
  }
  return out;
}

async function pool(items, fn) {
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) await fn(items[cursor++]);
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

async function backup(paths) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const root = resolve(process.cwd(), "scripts/.media-backup", stamp);
  await pool(paths, async (path) => {
    const r = await fetch(
      `${url}/storage/v1/object/public/${BUCKET}/${encodeURI(path)}`
    );
    if (!r.ok) throw new Error(`Backup of ${path} failed: ${r.status}`);
    const file = join(root, ...path.split("/"));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  });
  writeFileSync(join(root, "_paths.json"), JSON.stringify(paths, null, 2));
  return root;
}

async function removeAll(paths) {
  for (let i = 0; i < paths.length; i += 100) {
    const chunk = paths.slice(i, i + 100);
    const r = await fetch(`${url}/storage/v1/object/${BUCKET}`, {
      method: "DELETE",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefixes: chunk }),
    });
    const j = await r.json();
    // RLS silently filters deletes it refuses, so check the count.
    if (!r.ok || !Array.isArray(j) || j.length !== chunk.length)
      throw new Error(`Delete removed ${Array.isArray(j) ? j.length : 0}/${chunk.length}: ${JSON.stringify(j).slice(0, 300)}`);
  }
}

async function uploadAll(files) {
  const failed = [];
  let done = 0;
  await pool(files, async (full) => {
    const path = relative(SOURCE_DIR, full).split(sep).join("/");
    const type = MIME[extname(full).toLowerCase()] || "application/octet-stream";
    const r = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodeURI(path)}`, {
      method: "POST",
      headers: headers({ "Content-Type": type, "cache-control": "3600", "x-upsert": "true" }),
      body: readFileSync(full),
    });
    done += 1;
    if (!r.ok) failed.push(`${path}: ${r.status} ${await r.text()}`);
    else process.stdout.write(`\r  uploaded ${done}/${files.length}`);
  });
  process.stdout.write("\n");
  return failed;
}

/** Components whose content references a cms-media object that isn't there. */
async function reportDanglingRefs(existing) {
  const r = await fetch(`${url}/rest/v1/components?select=id,type,content`, {
    headers: headers(),
  });
  const rows = await r.json();
  if (!Array.isArray(rows)) return console.warn("  (could not read components)");
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const have = new Set(existing);
  const hits = [];
  for (const row of rows) {
    const text = JSON.stringify(row.content ?? "");
    for (const m of text.matchAll(new RegExp(`${marker.replace(/\//g, "\\/")}([^"\\\\?#]+)`, "g"))) {
      const path = decodeURI(m[1]);
      if (!have.has(path)) hits.push(`${row.type} ${row.id} -> ${path}`);
    }
  }
  if (!hits.length) return console.log("  none");
  for (const h of [...new Set(hits)]) console.log(`  ${h}`);
}

await signIn();

const current = await listAll();
const files = walk(ONLY ? join(SOURCE_DIR, ONLY) : SOURCE_DIR).filter(
  (f) => extname(f).toLowerCase() === ".webp"
);
console.log(`Bucket "${BUCKET}" has ${current.length} object(s); ${files.length} file(s) to upload.`);

if (DRY_RUN) {
  console.log("\nWould delete:");
  for (const p of current) console.log(`  ${p}`);
  console.log("\nWould upload:");
  for (const f of files) console.log(`  ${relative(SOURCE_DIR, f).split(sep).join("/")}`);
  process.exit(0);
}

if (ONLY) {
  // Folder refresh: upsert only, leave the rest of the bucket alone.
} else if (current.length) {
  const dir = await backup(current);
  console.log(`Backed up ${current.length} object(s) to ${dir}`);
  await removeAll(current);
  console.log(`Deleted ${current.length} object(s).`);
}

const failed = await uploadAll(files);
if (failed.length) {
  console.error(`${failed.length} upload(s) failed:`);
  for (const f of failed) console.error(`  ${f}`);
}

const after = await listAll();
console.log(`Bucket now has ${after.length} object(s).`);
console.log("CMS content pointing at removed media:");
await reportDanglingRefs(after);
