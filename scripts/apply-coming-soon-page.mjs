/**
 * One-off admin task: make /coming-soon CMS-driven.
 *
 *   1. Convert new_fly_cham's static hero (src/assets/images/coming-soon/hero.jpg)
 *      to WebP (<= 400 KB, sharp) and upload it to cms-media/coming-soon/hero.webp
 *      — skipped when the object already exists.
 *   2. Upsert component_types { id: "coming-soon-hero", label: "Coming Soon Hero" }.
 *   3. Ensure the page { slug: "coming-soon", label: "Coming Soon", status: "published" }.
 *   4. Seed ONE "coming-soon-hero" block per language (EN + AR) from
 *      new_fly_cham's comingSoon.* translations + the bucket image, only when
 *      that language has no blocks yet.
 *
 * Idempotent. Run from cms/:
 *
 *   node scripts/apply-coming-soon-page.mjs [--dry-run]
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

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

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(resolve(process.cwd(), "../flychamwebsite/node_modules/sharp"));
}

const TYPE = { id: "coming-soon-hero", label: "Coming Soon Hero" };
const PAGE = {
  slug: "coming-soon",
  label: "Coming Soon",
  description: "Coming Soon page",
  status: "published",
};
const BUCKET = "cms-media";
const OBJECT_PATH = "coming-soon/hero.webp";
const IMAGE_URL = `${url}/storage/v1/object/public/${BUCKET}/${OBJECT_PATH}`;
const SOURCE_IMAGE = resolve(process.cwd(), "../new_fly_cham/src/assets/images/coming-soon/hero.jpg");
const TARGET = 400 * 1024;
const MAX_DIM = 2560;
const kb = (n) => `${Math.round(n / 1024)} KB`;

const LOCALES = {
  en: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/en.json"), "utf8")),
  ar: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/ar.json"), "utf8")),
};

// Mirrors cms2 DEFAULT_COMING_SOON_HERO_STYLE (the static page look).
const STYLE = {
  overlayColor: "black",
  overlayOpacity: 20,
  titleColor: "50",
  titleFontWeight: "bold",
  titleColorHover: "50",
  titleFontWeightHover: "bold",
  descriptionColor: "50",
  descriptionFontWeight: "normal",
  descriptionColorHover: "50",
  descriptionFontWeightHover: "normal",
  descriptionOpacity: 90,
};

function contentFor(lang) {
  const copy = LOCALES[lang].comingSoon || {};
  return {
    imageUrl: IMAGE_URL,
    imageAlt: copy.imageAlt || "",
    title: copy.title || "",
    description: copy.description || "",
    links: [],
  };
}

/** Highest-quality WebP under TARGET; shrinks 15% per step if q50 won't fit. */
async function toWebp(file) {
  const meta = await sharp(file).metadata();
  for (let dim = Math.min(MAX_DIM, Math.max(meta.width, meta.height)); dim >= 480; dim = Math.floor(dim * 0.85)) {
    let lo = 50;
    let hi = 90;
    let best = null;
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

const auth = await (
  await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@flycham.local",
      password: process.env.CMS_ADMIN_PASSWORD || "FlyChamAdmin!2026",
    }),
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

// 1. Image → cms-media/coming-soon/hero.webp (skip when present).
{
  const head = await fetch(IMAGE_URL, { method: "HEAD" });
  if (head.ok) {
    console.log(`image: exists ${IMAGE_URL}`);
  } else {
    const { buf, q, dims } = await toWebp(SOURCE_IMAGE);
    console.log(`image: ${dims} q${q} ${kb(buf.length)}`);
    if (!DRY_RUN) {
      const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${OBJECT_PATH}`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "image/webp",
          "cache-control": "3600",
          "x-upsert": "true",
        },
        body: buf,
      });
      if (!up.ok) throw new Error(`upload ${OBJECT_PATH}: ${up.status} ${(await up.text()).slice(0, 200)}`);
      console.log(`image: uploaded ${IMAGE_URL}`);
    }
  }
}

// 2. Component type.
if (!DRY_RUN) {
  await rest("POST", "component_types?on_conflict=id", TYPE, "resolution=merge-duplicates,return=minimal");
}
console.log(`component_types: ${TYPE.id}${DRY_RUN ? " (would upsert)" : " ok"}`);

// 3. Page.
let [page] = await rest("GET", `pages?select=id,status&slug=eq.${PAGE.slug}`);
if (!page && !DRY_RUN) {
  [page] = await rest("POST", "pages", PAGE);
}
console.log(`page ${PAGE.slug}: ${page ? page.id : "(would create)"}`);

// 4. One block per language when that language has none.
for (const lang of ["en", "ar"]) {
  if (page) {
    const existing = await rest("GET", `page_components?page_id=eq.${page.id}&lang=eq.${lang}&select=id`);
    if (existing.length) {
      console.log(`  skip ${lang}: has ${existing.length} block(s)`);
      continue;
    }
  }
  const content = contentFor(lang);
  if (DRY_RUN) {
    console.log(`  ${lang}: would seed "${content.title}" — ${content.description}`);
    continue;
  }
  const [comp] = await rest("POST", "components", {
    type: TYPE.id,
    position: 0,
    style: { [lang]: STYLE },
    content: { [lang]: content },
  });
  await rest(
    "POST",
    "page_components",
    { page_id: page.id, component_id: comp.id, position: 0, lang },
    "return=minimal"
  );
  console.log(`  seeded ${lang}: 1 block`);
}
console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
