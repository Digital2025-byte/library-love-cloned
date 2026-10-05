/**
 * One-off admin task: make /our-destinations/route-map CMS-driven.
 *
 *   1. upsert component type `route-map-explorer` (Route Map Explorer)
 *   2. ensure page `route-map` exists and is published
 *      (its parent `our-destinations` comes from cms2 PAGE_PARENTS)
 *   3. seed ONE route-map-explorer block per language (EN + AR) when that
 *      language has no blocks yet
 *
 * Block content is the flat cms2 editor shape: `title` (sr-only heading, from
 * new_fly_cham's routeMap.hero.title), `planeUrl` (flying-plane marker) and one
 * `<cityKey>Image` per network city. Images are the WebP copies already in the
 * cms-media bucket; Aleppo has no photo (branded fallback card header).
 *
 * Idempotent: a language that already has blocks is skipped.
 *
 *   node scripts/apply-route-map-page.mjs [--dry-run]
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
const DRY_RUN = process.argv.includes("--dry-run");

const SLUG = "route-map";
const TYPE = { id: "route-map-explorer", label: "Route Map Explorer" };
const MEDIA = `${url}/storage/v1/object/public/cms-media`;

// cityKey → bucket file (our-destenations/<file>.webp); "" = no photo.
const CITY_PHOTOS = {
  damascus: "damascus",
  aleppo: "",
  dubai: "dubai",
  sharjah: "sharja",
  abuDhabi: "abu-dhabi",
  kuwait: "kuwait",
  muscat: "muscat",
  baghdad: "baghdad",
  erbil: "erbil",
  yerevan: "yerevan",
  istanbul: "istanbul",
  tripoli: "tripoli",
};

const LOCALES = {
  en: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/en.json"), "utf8")),
  ar: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/ar.json"), "utf8")),
};

function buildContent(lang) {
  return {
    title: LOCALES[lang]?.routeMap?.hero?.title || LOCALES.en.routeMap.hero.title,
    planeUrl: `${MEDIA}/routes-map/plane.webp`,
    ...Object.fromEntries(
      Object.entries(CITY_PHOTOS).map(([cityKey, file]) => [
        `${cityKey}Image`,
        file ? `${MEDIA}/our-destenations/${file}.webp` : "",
      ])
    ),
  };
}

const auth = await (
  await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
  })
).json();
if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
const headers = (extra = {}) => ({
  apikey: key,
  Authorization: `Bearer ${auth.access_token}`,
  "Content-Type": "application/json",
  ...extra,
});
async function rest(method, path, body, prefer = "return=representation") {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: headers({ Prefer: prefer }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

// 1. Component type.
if (DRY_RUN) {
  console.log(`component_types: would upsert ${TYPE.id}`);
} else {
  await rest(
    "POST",
    "component_types?on_conflict=id",
    TYPE,
    "resolution=merge-duplicates,return=minimal"
  );
  console.log(`component_types ok: ${TYPE.id}`);
}

// 2. Page.
let [page] = await rest("GET", `pages?select=id,status&slug=eq.${SLUG}`);
if (!page) {
  if (!DRY_RUN) {
    [page] = await rest("POST", "pages", {
      slug: SLUG,
      label: "Route Map",
      description: "Interactive flight route map",
      status: "published",
    });
  }
  console.log(`page ${SLUG}: ${page ? `created ${page.id}` : "(would create)"}`);
} else {
  console.log(`page ${SLUG}: ${page.id} (${page.status})`);
  if (page.status !== "published" && !DRY_RUN) {
    await rest("PATCH", `pages?id=eq.${page.id}`, { status: "published" }, "return=minimal");
    console.log("  published");
  }
}

// 3. One block per language.
for (const lang of ["en", "ar"]) {
  if (page) {
    const existing = await rest(
      "GET",
      `page_components?page_id=eq.${page.id}&lang=eq.${lang}&select=id`
    );
    if (existing.length) {
      console.log(`  skip ${lang}: has ${existing.length} block(s)`);
      continue;
    }
  }
  const content = buildContent(lang);
  if (DRY_RUN) {
    console.log(`  ${lang}: would seed ${TYPE.id} — "${content.title}"`);
    continue;
  }
  const [comp] = await rest("POST", "components", {
    type: TYPE.id,
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
  console.log(`  seeded ${lang}: ${TYPE.id} (${comp.id})`);
}

console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
