/**
 * One-off admin task: turn the 7 remaining static news articles
 * (new_fly_cham/src/pages/news-detail/utils/newsArticles.js) into CMS pages,
 * cloned from the live "news-fleet-update" page so they share its blocks,
 * styles and newsletter band:
 *
 *   0 breadcrumbs  1 news-detail-header  2 news-detail-paragraphs (intro)
 *   3 news-detail-gallery  4 news-detail-paragraphs (after)  5 news-detail-figure
 *   6 media-newsletter-signup
 *
 * Copy comes from new_fly_cham's en/ar locale files (newsDetail.articles.<id>),
 * images from the cms-media bucket. The closing figure keeps the looping video
 * (uploaded to cms-media/recent-news/news-expansion.mp4) when the bucket
 * accepts it; otherwise it falls back to the article's inline photo.
 *
 * Idempotent: a page/language that already has blocks is skipped.
 *
 *   node scripts/apply-news-article-pages.mjs [--dry-run]
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

const SOURCE_SLUG = "news-fleet-update";
const MEDIA = `${url}/storage/v1/object/public/cms-media`;
const IMG = {
  latestNews: `${MEDIA}/media-center/latest-news.webp`,
  gridTwo: `${MEDIA}/media-center/news-grid-2.webp`,
  gridThree: `${MEDIA}/media-center/news-grid-3.webp`,
  damascus: `${MEDIA}/our-destenations/damascus.webp`,
  istanbul: `${MEDIA}/our-destenations/istanbul.webp`,
  dubai: `${MEDIA}/our-destenations/dubai.webp`,
  ph2: `${MEDIA}/our-destenations/ph2.webp`,
};
const VIDEO_PATH = "recent-news/news-expansion.mp4";
const VIDEO_FILE = resolve(process.cwd(), "../new_fly_cham/src/assets/videos/news-expansion.mp4");
const POSTER = `${MEDIA}/recent-news/news-video-poster.webp`;

// Mirrors newsArticles.js (fleetUpdate already has its own CMS page).
const ARTICLES = [
  { id: "expansionPlans", category: "events", dateTime: "2025-07-24", hero: "latestNews", inline: "ph2", gallery: ["latestNews", "gridTwo", "gridThree"] },
  { id: "newRoutes", category: "network", dateTime: "2026-02-18", hero: "gridTwo", inline: "istanbul", gallery: ["gridTwo", "latestNews", "dubai"] },
  { id: "corporateUpdate", category: "corporate", dateTime: "2025-07-18", hero: "gridTwo", inline: "dubai", gallery: ["gridTwo", "damascus", "latestNews"] },
  { id: "sponsorshipLaunch", category: "sponsorships", dateTime: "2025-06-12", hero: "gridThree", inline: "istanbul", gallery: ["gridThree", "dubai", "gridTwo"] },
  { id: "communityEvent", category: "events", dateTime: "2025-06-05", hero: "damascus", inline: "ph2", gallery: ["damascus", "latestNews", "gridThree"] },
  { id: "customerExperience", category: "customerExperience", dateTime: "2025-05-22", hero: "istanbul", inline: "gridTwo", gallery: ["istanbul", "gridThree", "latestNews"] },
  { id: "routeExpansion", category: "network", dateTime: "2025-05-10", hero: "dubai", inline: "damascus", gallery: ["dubai", "istanbul", "gridTwo"] },
];

export const kebab = (id) => id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
export const slugFor = (id) => `news-${kebab(id)}`;

const LOCALES = {
  en: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/en.json"), "utf8")),
  ar: JSON.parse(readFileSync(resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/ar.json"), "utf8")),
};
const CRUMB_LABELS = {
  en: { home: "Home", media: "Media Center", recent: "Recent News", aria: "Breadcrumb" },
  ar: { home: "الرئيسية", media: "المركز الإعلامي", recent: "الأخبار الأخيرة", aria: "مسار التنقل" },
};

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

// Video: upload once if the bucket accepts mp4.
let videoUrl = "";
{
  const head = await fetch(`${MEDIA}/${VIDEO_PATH}`, { method: "HEAD" });
  if (head.ok) videoUrl = `${MEDIA}/${VIDEO_PATH}`;
  else if (!DRY_RUN) {
    const up = await fetch(`${url}/storage/v1/object/cms-media/${VIDEO_PATH}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${auth.access_token}`, "Content-Type": "video/mp4", "cache-control": "3600" },
      body: readFileSync(VIDEO_FILE),
    });
    if (up.ok) videoUrl = `${MEDIA}/${VIDEO_PATH}`;
    else console.log(`video upload refused (${up.status} ${(await up.text()).slice(0, 120)}) — figures use the inline photo`);
  }
}
console.log("video:", videoUrl || "(none)");

// Source page blocks per language (type + style + content), in order.
const [source] = await rest("GET", `pages?select=id&slug=eq.${SOURCE_SLUG}`);
if (!source) throw new Error(`${SOURCE_SLUG} not found`);
const sourceLinks = await rest(
  "GET",
  `page_components?page_id=eq.${source.id}&select=lang,position,components(type,style,content)&order=position`
);

function buildContent(type, lang, base, article, ordinal) {
  const copy = LOCALES[lang].newsDetail.articles[article.id];
  const category = LOCALES[lang].newsDetail.categories[article.category] || article.category;
  const L = CRUMB_LABELS[lang];
  const paras = (list, prefix) =>
    (list || []).map((p, i) => ({ id: `${prefix}-${i + 1}`, bold: p.bold || "", text: p.text || "" }));
  switch (type) {
    case "breadcrumbs":
      return {
        ...base,
        items: [
          { label: L.home, href: "/" },
          { label: L.media, href: "/media-center" },
          { label: L.recent, href: "/media-center/recent-news" },
          { label: copy.title, href: "" },
        ],
        ariaLabel: L.aria,
      };
    case "news-detail-header":
      return {
        ...base,
        title: copy.title,
        date: copy.date,
        dateTime: article.dateTime,
        category,
        imageUrl: IMG[article.hero],
        imageAlt: copy.heroImageAlt || "",
      };
    case "news-detail-paragraphs":
      return ordinal === 0
        ? { ...base, paragraphs: paras(copy.intro, "p") }
        : { ...base, paragraphs: paras(copy.afterGallery, "a") };
    case "news-detail-gallery":
      return {
        ...base,
        altPrefix: copy.galleryAltPrefix || base.altPrefix,
        items: article.gallery.map((k, i) => ({ id: `gallery-${i + 1}`, imageUrl: IMG[k] })),
      };
    case "news-detail-figure":
      return {
        ...base,
        imageUrl: IMG[article.inline],
        imageAlt: copy.inlineImageAlt || "",
        videoUrl,
        posterUrl: videoUrl ? POSTER : "",
      };
    default:
      return base; // newsletter band: identical to the source page
  }
}

for (const article of ARTICLES) {
  const slug = slugFor(article.id);
  const title = LOCALES.en.newsDetail.articles[article.id].title;
  let [page] = await rest("GET", `pages?select=id&slug=eq.${slug}`);
  if (!page && !DRY_RUN) {
    [page] = await rest("POST", "pages", {
      slug,
      label: `News — ${title}`,
      description: title,
      status: "published",
    });
  }
  console.log(`${slug} ${page ? page.id : "(would create)"}`);

  for (const lang of ["en", "ar"]) {
    if (page) {
      const existing = await rest("GET", `page_components?page_id=eq.${page.id}&lang=eq.${lang}&select=id`);
      if (existing.length) {
        console.log(`  skip ${lang}: has ${existing.length} block(s)`);
        continue;
      }
    }
    const blocks = sourceLinks.filter((l) => l.lang === lang);
    let paraCount = 0;
    for (const [position, link] of blocks.entries()) {
      const { type, style, content } = link.components;
      const base = content?.[lang] ?? {};
      const ordinal = type === "news-detail-paragraphs" ? paraCount++ : 0;
      const next = buildContent(type, lang, base, article, ordinal);
      if (DRY_RUN) {
        if (type === "news-detail-header") console.log(`  ${lang}: ${next.title} · ${next.category} · ${next.date}`);
        continue;
      }
      const [comp] = await rest("POST", "components", {
        type,
        position,
        style: { [lang]: style?.[lang] ?? {} },
        content: { [lang]: next },
      });
      await rest("POST", "page_components", { page_id: page.id, component_id: comp.id, position, lang }, "return=minimal");
    }
    if (!DRY_RUN) console.log(`  seeded ${lang}: ${blocks.length} blocks`);
  }
}
console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
