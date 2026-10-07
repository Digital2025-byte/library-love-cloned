/**
 * One-off admin task: make /cham-miles (CMS slug `cham-miles`) ONE full-bleed
 * "cham-miles-join" block — the latest join (form) step of flychamwebsite's
 * /cham-miles page (new_fly_cham ChamMilesJoin / cms2 ChamMilesJoin).
 *
 *   1. Upserts component_types { id: 'cham-miles-join' } and removes the
 *      unused 'cham-miles-experience' type (an abandoned full-page attempt).
 *   2. Checks the artwork the block uses exists in cms-media/cham-miles/
 *      (tier-bg.webp, header-logo.webp).
 *   3. With --swap: per language (EN + AR) backs up the page's links +
 *      component rows to scripts/.media-backup/cham-miles-join-<ts>.json,
 *      unlinks every other block (component rows are kept) and links a new
 *      cham-miles-join block seeded from the shared defaults
 *      (new_fly_cham/src/shared/components/cham-miles-join/defaults.js).
 *      A language that already has the join block is left untouched.
 *
 * Run --swap only AFTER the new_fly_cham build that knows "cham-miles-join"
 * is deployed — the live site renders nothing for an unknown block.
 *
 *   node scripts/apply-cham-miles-join.mjs [--dry-run] [--swap]
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

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
if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing in cms/.env");
const DRY_RUN = process.argv.includes("--dry-run");
const SWAP = process.argv.includes("--swap");

const SLUG = "cham-miles";
const TYPE = "cham-miles-join";
const OLD_UNUSED_TYPE = "cham-miles-experience";
const MEDIA = `${url}/storage/v1/object/public/cms-media/cham-miles`;
const DEFAULTS_MODULE = resolve(
  process.cwd(),
  "../new_fly_cham/src/shared/components/cham-miles-join/defaults.js"
);

// --- Auth + REST helpers ----------------------------------------------------
const auth = await (
  await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
  })
).json();
if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
async function rest(method, path, body, prefer = "return=representation") {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${auth.access_token}`,
      "Content-Type": "application/json",
      Prefer: prefer,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

// --- 1. Component types ---------------------------------------------------------
if (DRY_RUN) {
  console.log(`would upsert component_types ${TYPE}`);
} else {
  await rest(
    "POST",
    "component_types?on_conflict=id",
    { id: TYPE, label: "Cham Miles Join" },
    "resolution=merge-duplicates,return=minimal"
  );
  console.log(`component_types ok: ${TYPE}`);
}
const oldUsers = await rest("GET", `components?type=eq.${OLD_UNUSED_TYPE}&select=id`);
if (oldUsers.length) {
  console.log(`keep ${OLD_UNUSED_TYPE}: ${oldUsers.length} component(s) use it`);
} else if (DRY_RUN) {
  console.log(`would delete unused component_types ${OLD_UNUSED_TYPE}`);
} else {
  await rest("DELETE", `component_types?id=eq.${OLD_UNUSED_TYPE}`, undefined, "return=minimal");
  console.log(`component_types removed (unused): ${OLD_UNUSED_TYPE}`);
}

// --- 2. Artwork -----------------------------------------------------------------
for (const name of ["tier-bg.webp", "header-logo.webp"]) {
  const head = await fetch(`${MEDIA}/${name}`, { method: "HEAD" });
  if (!head.ok) throw new Error(`missing cms-media/cham-miles/${name} (${head.status})`);
  console.log(`image ok: cham-miles/${name}`);
}

if (!SWAP) {
  console.log("Page blocks unchanged (pass --swap after deploying new_fly_cham).");
  process.exit(0);
}

// --- 3. Swap the page's blocks ----------------------------------------------------
const [page] = await rest("GET", `pages?select=id,label,status&slug=eq.${SLUG}`);
if (!page) throw new Error(`page ${SLUG} not found`);
console.log(`page ${SLUG}: ${page.id}`);

const { getDefaultChamMilesJoinContent } = await import(pathToFileURL(DEFAULTS_MODULE).href);
const backup = { page, at: new Date().toISOString(), languages: {} };
for (const lang of ["en", "ar"]) {
  backup.languages[lang] = await rest(
    "GET",
    `page_components?page_id=eq.${page.id}&lang=eq.${lang}&select=id,position,component_id,components(id,type,content,style)`
  );
}
if (!DRY_RUN) {
  const dir = resolve(process.cwd(), "scripts/.media-backup");
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, `cham-miles-join-${backup.at.replace(/[:.]/g, "-")}.json`);
  writeFileSync(file, JSON.stringify(backup, null, 2));
  console.log(`backup: ${file}`);
}

for (const lang of ["en", "ar"]) {
  const links = backup.languages[lang];
  if (links.some((l) => l.components?.type === TYPE)) {
    console.log(`  skip ${lang}: already has ${TYPE}`);
    continue;
  }
  const content = getDefaultChamMilesJoinContent(lang);
  if (DRY_RUN) {
    console.log(
      `  ${lang}: would unlink ${links.length} block(s) [${links.map((l) => l.components?.type).join(", ")}] and seed ${TYPE} — "${content.titleJoin}${content.titleAccent}${content.titleToday}"`
    );
    continue;
  }
  for (const link of links) {
    await rest("DELETE", `page_components?id=eq.${link.id}`, undefined, "return=minimal");
  }
  const [comp] = await rest("POST", "components", {
    type: TYPE,
    position: 0,
    style: { [lang]: {} },
    content: { [lang]: content },
  });
  await rest(
    "POST",
    "page_components",
    { page_id: page.id, component_id: comp.id, position: 0, lang },
    "return=minimal"
  );
  console.log(`  ${lang}: unlinked ${links.length} block(s), seeded ${TYPE} (${comp.id})`);
}

console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
