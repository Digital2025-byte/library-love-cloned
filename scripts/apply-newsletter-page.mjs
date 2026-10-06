/**
 * Seed the Newsletter page (slug newsletter, public /media-center/newsletter) in EN + AR.
 * Uploads the hero, crew photo, and magazine covers, then inserts breadcrumbs,
 * page-media-hero, newsletter-form, and magazine-banner.
 * Idempotent: skips a language that already has blocks.
 *
 *   node scripts/apply-newsletter-page.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildNewsletterFormContent } from "../../flychamadmin/src/cms2/cmsComponents/NewsletterForm/utils/content.js";
import { DEFAULT_NEWSLETTER_FORM_STYLE } from "../../flychamadmin/src/cms2/cmsComponents/NewsletterForm/utils/style.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(HERE, "assets/newsletter");

function loadEnv() {
  const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";
const PAGE_SLUG = "newsletter";
const FOLDER = "newsletter";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;

const UPLOADS = [
  "hero.png",
  "crew.png",
  "magazine-bg.png",
  "cover.png",
  "spread-left.png",
  "spread-right.png",
];

const text = (colorKey, color, weight) => {
  const weightKey = colorKey.endsWith("Color")
    ? colorKey.replace(/Color$/, "FontWeight")
    : `${colorKey}FontWeight`;
  return {
    [colorKey]: color,
    [weightKey]: weight,
    [`${colorKey}Hover`]: color,
    [`${weightKey}Hover`]: weight,
  };
};

const HERO_STYLE = {
  layout: "cover",
  height: "default",
  titleSize: "default",
  contentWidth: "narrow",
  overlayWidth: "wide",
  objectPosition: "center right",
  sectionBg: "100",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  showButton: false,
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "700", "normal"),
};

const CRUMBS_STYLE = {
  ...text("crumbColor", "600", "medium"),
  crumbColorHover: "primary-1",
  ...text("currentColor", "primary-1", "semibold"),
  separatorColor: "600",
  crumbUnderline: false,
};

const MAGAZINE_STYLE = {
  bannerBg: "primary-1",
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "medium"),
  buttonBg: "secondary",
  buttonHoverBg: "secondary-800",
  ...text("buttonText", "700", "semibold"),
};

const HERO = {
  en: {
    title: "Newsletter",
    subtitle: "Be the first to know about our latest offers, travel inspiration and Fly Cham news.",
    imageAlt: "Fly Cham aircraft on the apron",
  },
  ar: {
    title: "النشرة الإخبارية",
    subtitle: "كن أول من يعرف أحدث عروضنا وإلهام السفر وأخبار فلاي شام.",
    imageAlt: "طائرة فلاي شام على الساحة",
  },
};

const CRUMBS = {
  en: [
    { label: "Home", href: "/" },
    { label: "Media Center", href: "/media-center" },
    { label: "Newsletter", href: "/media-center/newsletter" },
  ],
  ar: [
    { label: "الرئيسية", href: "/" },
    { label: "المركز الإعلامي", href: "/media-center" },
    { label: "النشرة الإخبارية", href: "/media-center/newsletter" },
  ],
};

const MAGAZINE = {
  en: {
    title: "A Closer Look at Our Destinations in Marhaba Magazine",
    description:
      "Don’t miss our inspiring destination stories, cultural and tradition spotlights from across our destinations network in Marhaba Onboard Magazine.",
    cta: "Explore Magazine Issues",
  },
  ar: {
    title: "نظرة أقرب على وجهاتنا في مجلة مرحبا",
    description:
      "لا تفوّت قصص الوجهات الملهمة ولمحات عن الثقافة والتقاليد عبر شبكة وجهاتنا في مجلة مرحبا على متن الطائرة.",
    cta: "استكشف أعداد المجلة",
  },
};

function buildBlocks(lang) {
  const hero = HERO[lang];
  const magazine = MAGAZINE[lang];
  return [
    {
      type: "breadcrumbs",
      style: CRUMBS_STYLE,
      content: {
        items: CRUMBS[lang],
        separator: "/",
        ariaLabel: lang === "ar" ? "مسار التنقل" : "Breadcrumb",
        links: [],
      },
    },
    {
      type: "page-media-hero",
      style: HERO_STYLE,
      content: {
        title: hero.title,
        subtitle: hero.subtitle,
        imageUrl: `${MEDIA}/hero.png`,
        imageAlt: hero.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "newsletter-form",
      style: DEFAULT_NEWSLETTER_FORM_STYLE,
      content: {
        ...buildNewsletterFormContent(lang),
        imageUrl: `${MEDIA}/crew.png`,
      },
    },
    {
      type: "magazine-banner",
      style: MAGAZINE_STYLE,
      content: {
        title: magazine.title,
        description: magazine.description,
        cta: magazine.cta,
        ctaHref: "/travel-experience/traveler-magazine",
        bgUrl: `${MEDIA}/magazine-bg.png`,
        coverUrl: `${MEDIA}/cover.png`,
        spread1Url: `${MEDIA}/spread-left.png`,
        spread2Url: `${MEDIA}/spread-right.png`,
        links: [],
      },
    },
  ];
}

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query, file, contentType, headers } = {}) {
  const qs = query ? `?${query}` : "";
  const args = ["-sS", "-X", method, `${url}${path}${qs}`, "-H", `apikey: ${key}`, "-H", `Content-Type: ${contentType || "application/json"}`];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  for (const header of headers || []) args.push("-H", header);
  let dir;
  if (file) args.push("--data-binary", `@${file}`);
  else if (body !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "cms-seed-"));
    const tmp = join(dir, "body.json");
    writeFileSync(tmp, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${tmp}`);
  }
  let stdout;
  try {
    stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 40_000_000 });
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
  }
}

console.log("Target project:", url);
const auth = curl("POST", "/auth/v1/token", { query: "grant_type=password", body: { email, password } });
if (!auth?.access_token) {
  console.error("Sign-in failed:", restError(auth, "no access_token"));
  process.exit(1);
}
const token = auth.access_token;

const typeRes = curl("POST", "/rest/v1/component_types", {
  token,
  query: "on_conflict=id",
  prefer: "resolution=merge-duplicates,return=minimal",
  body: { id: "newsletter-form", label: "Newsletter Form" },
});
if (typeRes?.message) {
  console.error("component_types upsert failed:", restError(typeRes, "unknown error"));
  process.exit(1);
}
console.log("component_types ok: newsletter-form");

for (const name of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, {
    token,
    file: resolve(ASSETS, name),
    contentType: "image/png",
    headers: ["x-upsert: true", "Cache-Control: max-age=3600"],
  });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) {
    console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res)));
    process.exit(1);
  }
  console.log("image uploaded:", `${FOLDER}/${name}`);
}

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
  if (!Array.isArray(existing)) {
    console.error("pages lookup failed:", restError(existing, "unknown error"));
    process.exit(1);
  }
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Newsletter",
        description: "Subscribe to Fly Cham news, offers, and travel inspiration",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) {
      console.error("pages insert failed:", restError(inserted, "unknown error"));
      process.exit(1);
    }
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }
  if (links.length) {
    console.log(`page already has ${links.length} ${lang} block(s) — skipping.`);
    continue;
  }
  const blocks = buildBlocks(lang);
  for (let position = 0; position < blocks.length; position += 1) {
    const block = blocks[position];
    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: {
        type: block.type,
        position,
        style: { [lang]: block.style },
        content: { [lang]: block.content },
      },
    });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) {
      console.error(`components insert failed (${lang} ${block.type}):`, restError(inserted, "unknown error"));
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${block.type} (${lang}) @${position}`);
  }
}

console.log("Done.", PAGE_SLUG, pageId);
