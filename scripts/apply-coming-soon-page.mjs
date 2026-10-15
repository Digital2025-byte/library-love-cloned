/**
 * Make /coming-soon CMS-driven.
 *
 *   1. Upload new_fly_cham's plane illustration to
 *      cms-media/coming-soon/plane.webp (skipped when the object exists).
 *   2. Upsert component_types coming-soon-hero and media-newsletter-signup.
 *   3. Ensure the page { slug: "coming-soon", status: "published" }.
 *   4. Per language, seed or upgrade:
 *        0 coming-soon-hero
 *        1 media-newsletter-signup
 *      A language that already has the current hero (cta + light background)
 *      and the newsletter is left untouched.
 *
 * Idempotent. Run from cms/:
 *
 *   node scripts/apply-coming-soon-page.mjs [--dry-run]
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
if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing in cms/.env");
const DRY_RUN = process.argv.includes("--dry-run");

const HERO_TYPE = { id: "coming-soon-hero", label: "Coming Soon Hero" };
const NEWSLETTER_TYPE = { id: "media-newsletter-signup", label: "Media Newsletter Signup" };
const PAGE = {
  slug: "coming-soon",
  label: "Coming Soon",
  description: "Coming Soon page",
  status: "published",
};
const BUCKET = "cms-media";
const OBJECT_PATH = "coming-soon/plane.webp";
const IMAGE_URL = `${url}/storage/v1/object/public/${BUCKET}/${OBJECT_PATH}`;
const SOURCE_IMAGE = resolve(
  process.cwd(),
  "../new_fly_cham/src/assets/images-webp/coming-soon/plane.webp"
);
const PATTERN_URL =
  "https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/media-newsletter/pattern.png";

const LOCALES = {
  en: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/en.json"), "utf8")),
  ar: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/ar.json"), "utf8")),
};

const HERO_STYLE = {
  backgroundColor: "100",
  showButton: true,
  showImage: true,
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  descriptionColor: "700",
  descriptionFontWeight: "normal",
  descriptionColorHover: "700",
  descriptionFontWeightHover: "normal",
  buttonBg: "primary-1",
  buttonBgHover: "primary-800",
  buttonText: "50",
  buttonTextFontWeight: "medium",
  buttonTextHover: "50",
  buttonTextFontWeightHover: "medium",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

const NEWSLETTER_STYLE = {
  sectionBg: "100",
  cardBg: "background",
  titleColor: "800",
  titleFontWeight: "semibold",
  titleColorHover: "800",
  titleFontWeightHover: "semibold",
  descriptionColor: "700",
  descriptionFontWeight: "normal",
  descriptionColorHover: "700",
  descriptionFontWeightHover: "normal",
  inputBg: "100",
  inputText: "700",
  buttonBg: "secondary",
  buttonHoverBg: "",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

function heroContent(lang) {
  const copy = LOCALES[lang].comingSoon || {};
  return {
    imageUrl: IMAGE_URL,
    imageAlt: copy.imageAlt || "",
    title: copy.title || "",
    description: copy.description || "",
    ctaLabel: copy.backHome || "",
    ctaHref: "/",
    links: [],
  };
}

function newsletterContent(lang) {
  const copy = LOCALES[lang].mediaCenter?.newsletter || {};
  return {
    title: copy.title || "",
    description: copy.description || "",
    label: copy.label || "",
    placeholder: copy.placeholder || "",
    cta: copy.cta || "",
    patternUrl: PATTERN_URL,
    links: [],
  };
}

function isCurrentHero(row, lang) {
  const content = row?.components?.content?.[lang] || {};
  const style = row?.components?.style?.[lang] || {};
  return Boolean(String(content.ctaLabel || "").trim()) && style.backgroundColor && !style.overlayColor;
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

{
  const head = await fetch(IMAGE_URL, { method: "HEAD" });
  if (head.ok) {
    console.log(`image: exists ${IMAGE_URL}`);
  } else {
    const buf = readFileSync(SOURCE_IMAGE);
    console.log(`image: ${Math.round(buf.length / 1024)} KB`);
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

if (!DRY_RUN) {
  await rest(
    "POST",
    "component_types?on_conflict=id",
    [HERO_TYPE, NEWSLETTER_TYPE],
    "resolution=merge-duplicates,return=minimal"
  );
}
console.log(`component_types: ${HERO_TYPE.id}, ${NEWSLETTER_TYPE.id}${DRY_RUN ? " (would upsert)" : " ok"}`);

let [page] = await rest("GET", `pages?select=id,status&slug=eq.${PAGE.slug}`);
if (!page && !DRY_RUN) {
  [page] = await rest("POST", "pages", PAGE);
}
console.log(`page ${PAGE.slug}: ${page ? page.id : "(would create)"}`);

async function insertBlock(pageId, lang, type, position, style, content) {
  const [comp] = await rest("POST", "components", {
    type,
    position,
    style: { [lang]: style },
    content: { [lang]: content },
  });
  await rest(
    "POST",
    "page_components",
    { page_id: pageId, component_id: comp.id, position, lang },
    "return=minimal"
  );
  return comp.id;
}

for (const lang of ["en", "ar"]) {
  const hero = heroContent(lang);
  const newsletter = newsletterContent(lang);
  if (!page) {
    console.log(`  ${lang}: would seed "${hero.title}" + newsletter`);
    continue;
  }
  const rows = await rest(
    "GET",
    `page_components?page_id=eq.${page.id}&lang=eq.${lang}&select=id,position,component_id,components(id,type,content,style)&order=position`
  );
  const heroRow = rows.find((row) => row.components?.type === HERO_TYPE.id);
  const newsRow = rows.find((row) => row.components?.type === NEWSLETTER_TYPE.id);

  if (heroRow && isCurrentHero(heroRow, lang) && newsRow) {
    console.log(`  skip ${lang}: current hero + newsletter`);
    continue;
  }
  if (DRY_RUN) {
    console.log(`  ${lang}: would ${heroRow ? "update" : "seed"} hero and ${newsRow ? "keep" : "add"} newsletter`);
    continue;
  }

  if (heroRow) {
    await rest("PATCH", `components?id=eq.${heroRow.components.id}`, {
      style: { ...(heroRow.components.style || {}), [lang]: HERO_STYLE },
      content: { ...(heroRow.components.content || {}), [lang]: hero },
    });
    console.log(`  updated ${lang} hero ${heroRow.components.id}`);
  } else {
    const id = await insertBlock(page.id, lang, HERO_TYPE.id, 0, HERO_STYLE, hero);
    console.log(`  seeded ${lang} hero ${id}`);
  }

  if (!newsRow) {
    const id = await insertBlock(page.id, lang, NEWSLETTER_TYPE.id, 1, NEWSLETTER_STYLE, newsletter);
    console.log(`  seeded ${lang} newsletter ${id}`);
  }
}

console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
