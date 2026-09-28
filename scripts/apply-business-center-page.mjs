/**
 * One-off admin task for the Business Center dynamic page (Figma 39658:121):
 *   1. Register the business-* component types (+ ensure breadcrumbs /
 *      page-media-hero exist).
 *   2. Ensure the "business-center" page row exists.
 *   3. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs
 *        1 page-media-hero
 *        2 home-travel-experience (the business services cards)
 *        3 promo-banner (the "Have a Business Enquiry?" banner)
 *        4 business-quick-access
 *
 * Copy comes from new_fly_cham's `businessCenter.*` locale strings; images are
 * the Figma photos uploaded to cms-media/business-center/*.webp.
 *
 * Frontend URL: /business-center     CMS slug: business-center
 *
 *   node scripts/apply-business-center-page.mjs
 *   node scripts/apply-business-center-page.mjs --repair   # re-write seeded
 *     type/content/style onto the existing blocks at the same position
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

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

const PAGE_SLUG = "business-center";
const MEDIA = `${String(url).replace(/\/$/, "")}/storage/v1/object/public/cms-media/business-center`;

const CRUMBS = "breadcrumbs";
const HERO = "page-media-hero";
const SERVICES = "home-travel-experience";
const ENQUIRY = "promo-banner";
const QUICK = "business-quick-access";

const COMPONENT_TYPES = [
  { id: CRUMBS, label: "Breadcrumbs" },
  { id: HERO, label: "Page Media Hero" },
  { id: SERVICES, label: "Home Travel Experience" },
  { id: ENQUIRY, label: "Promo Banner" },
  { id: QUICK, label: "Business Quick Access" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-800",
  linkFontWeight: "medium",
  linkUnderline: true,
  linkItalic: false,
};

const text = (key, color, weight) => ({
  [key]: color,
  [key.replace(/Color$|Text$/, (m) => (m === "Color" ? "FontWeight" : "TextFontWeight"))]: weight,
  [`${key}Hover`]: color,
  [`${key.replace(/Color$|Text$/, (m) => (m === "Color" ? "FontWeight" : "TextFontWeight"))}Hover`]: weight,
});

const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };

// Figma: Home / — 14px medium #5F5F5C; current page semibold primary.
const CRUMBS_STYLE = {
  ...LAYOUT,
  ...text("crumbColor", "600", "medium"),
  crumbColorHover: "primary-1",
  ...text("currentColor", "primary-1", "semibold"),
  ...text("focusColor", "primary-1", "medium"),
  separatorColor: "600",
  crumbUnderline: false,
  ...BACKLINKS,
};

// Figma hero: 64px bold primary title, 16px regular Text/700 subtitle, 500px.
const HERO_STYLE = {
  layout: "cover",
  height: "default",
  titleSize: "default",
  contentWidth: "default",
  overlayWidth: "default",
  objectPosition: "center",
  sectionBg: "100",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  showButton: false,
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "700", "normal"),
  showLinks: true,
};

// Same tokens as the Home page's Travel Experience block.
const SERVICES_STYLE = {
  showSectionBg: false,
  sectionBg: "100",
  ...text("titleColor", "700", "semibold"),
  ...text("subtitleColor", "700", "normal"),
  ...text("ctaColor", "primary-1", "semibold"),
  cardBg: "50",
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "800", "normal"),
  ...text("learnMoreColor", "primary-1", "semibold"),
  learnMoreColorHover: "50",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  ...BACKLINKS,
};

// Promo Banner carrying the Figma enquiry banner copy (dark wash, gold CTA).
const ENQUIRY_STYLE = {
  ...LAYOUT,
  bannerHeight: "tall", // 380px — closest to Figma 360px
  bannerRadius: "lg",
  showOverlay: true,
  overlayColor: "#01263B",
  showTitle: true,
  showDescription: true,
  showButton: true,
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "medium"),
  buttonBg: "secondary",
  ...text("buttonText", "700", "semibold"),
  ...BACKLINKS,
};

const QUICK_STYLE = {
  ...LAYOUT,
  ...text("titleColor", "700", "semibold"),
  cardBg: "50",
  iconBg: "100",
  iconColor: "primary-1",
  ...text("labelColor", "primary-1", "semibold"),
  chevronColor: "primary-1",
  ...BACKLINKS,
};

const SERVICE_ROWS = [
  { id: "b2bPortal", href: "/login-travel-agent", image: "b2b-portal.webp" },
  { id: "agentGuide", href: "/coming-soon", image: "agent-guide.webp" },
  { id: "partnership", href: "/help/contact-us/forms", image: "partnership.webp" },
  { id: "apiIntegration", href: "/help/contact-us/forms", image: "api-integration.webp" },
];

const QUICK_ROWS = [
  { id: "customerCare", icon: "Headset", href: "/help/contact-us" },
  { id: "latestNews", icon: "NewspaperClipping", href: "/recent-news" },
  { id: "whereWeFly", icon: "GlobeSimple", href: "/our-destinations" },
  { id: "responsibility", icon: "MedalMilitary", href: "/our-responsibility" },
];

function loadLocale(lang) {
  const path = resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function buildBlocks(lang) {
  const locale = loadLocale(lang);
  const bc = locale.businessCenter;
  const s = bc.services;
  const q = bc.quickAccess;

  return [
    {
      type: CRUMBS,
      style: CRUMBS_STYLE,
      content: {
        items: [
          { label: locale.common.home, href: "/" },
          { label: bc.breadcrumb, href: "" },
        ],
        separator: "/",
        ariaLabel: lang === "ar" ? "مسار التنقل" : "Breadcrumb",
        links: [],
      },
    },
    {
      type: HERO,
      style: HERO_STYLE,
      content: {
        title: bc.hero.title,
        subtitle: bc.hero.subtitle,
        imageUrl: `${MEDIA}/hero.webp`,
        imageAlt: bc.hero.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: SERVICES,
      style: SERVICES_STYLE,
      content: {
        title: s.title,
        subtitle: s.description,
        exploreLabel: "",
        exploreHref: "",
        learnMoreLabel: s.learnMore,
        cards: SERVICE_ROWS.map((row) => ({
          id: row.id,
          title: s[row.id].title,
          description: s[row.id].description,
          href: row.href,
          imageUrl: `${MEDIA}/${row.image}`,
          imageAlt: s[row.id].imageAlt,
        })),
        links: [],
      },
    },
    {
      type: ENQUIRY,
      style: ENQUIRY_STYLE,
      content: {
        title: bc.enquiry.title,
        description: bc.enquiry.description,
        buttonLabel: bc.enquiry.cta,
        buttonHref: "/help/contact-us",
        buttonLinkType: "internal",
        imageUrl: `${MEDIA}/b2b-portal.webp`,
        imageAlt: bc.enquiry.imageAlt,
        links: [],
      },
    },
    {
      type: QUICK,
      style: QUICK_STYLE,
      content: {
        title: q.title,
        items: QUICK_ROWS.map((row) => ({
          ...row,
          label: q.items[row.id],
          shortLabel: q.itemsShort[row.id],
        })),
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

function curl(method, path, { body, token, prefer, query } = {}) {
  const origin = String(url).replace(/\/$/, "");
  const qs = query ? `?${query}` : "";
  const args = [
    "-sS",
    "-X",
    method,
    `${origin}${path}${qs}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    "Content-Type: application/json",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  // Send the body from a UTF-8 file: passing it as a CLI arg goes through the
  // Windows ANSI codepage and turns Arabic into "????".
  let dir;
  if (body !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "cms-seed-"));
    const file = join(dir, "body.json");
    writeFileSync(file, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${file}`);
  }
  let stdout;
  try {
    stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
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

function componentTypeOf(link) {
  const row = link?.components;
  const component = Array.isArray(row) ? row[0] : row;
  return component?.type || null;
}

console.log("Target project:", url);

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) {
  console.error("Sign-in failed:", restError(auth, "no access_token"));
  process.exit(1);
}
const token = auth.access_token;
console.log("Signed in as", email);

for (const row of COMPONENT_TYPES) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: row,
  });
  if (res?.message) {
    console.error("component_types upsert failed:", restError(res, "unknown error"));
    process.exit(1);
  }
  console.log("component_types ok:", row.id);
}

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${PAGE_SLUG}&select=id`,
  });
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
        label: "Business Center",
        description: "Business resources, partnership opportunities and integration support",
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
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }

  if (links.length > 0 && process.argv.includes("--repair")) {
    const blocks = buildBlocks(lang);
    for (const row of links) {
      const block = blocks[row.position];
      if (!block) continue;
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${row.component_id}`,
        prefer: "return=minimal",
        body: {
          type: block.type,
          style: { [lang]: block.style },
          content: { [lang]: block.content },
        },
      });
      if (res?.message) {
        console.error(`repair failed (${lang} ${block.type}):`, restError(res, "unknown error"));
        process.exit(1);
      }
      console.log(`repaired ${block.type} (${lang}) @${row.position}`);
    }
    continue;
  }

  if (links.length > 0) {
    const order = links
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((row) => `${row.position}:${componentTypeOf(row)}`)
      .join(" → ");
    console.log(`kept ${lang} (${links.length} blocks):`, order);
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
      console.error(
        `components insert failed (${lang} ${block.type}):`,
        restError(inserted, "unknown error")
      );
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) {
      console.error(
        `page_components insert failed (${lang} ${block.type}):`,
        restError(link, "unknown error")
      );
      process.exit(1);
    }
    console.log(`seeded ${block.type} block (${lang}) @${position}:`, comp.id);
  }
}

console.log("Done. Open /en/business-center");
