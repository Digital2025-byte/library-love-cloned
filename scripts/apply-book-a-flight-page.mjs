/**
 * Seed the Book a Flight page the public site renders at /book-a-flight.
 *
 *   node scripts/apply-book-a-flight-page.mjs
 *
 * Creates the CMS page when it is missing, then seeds EN + AR blocks when a
 * language has none:
 *   0 breadcrumbs
 *   1 page-media-hero
 *   2 booking-widget   (pulled 80px up over the hero)
 *   3 faqs
 *   4 seat-plan
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

const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL).replace(/\/$/, "");
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "book-a-flight";
const PAGE_LABEL = "Book a Flight";
const PAGE_DESCRIPTION = "Book a flight: hero, booking box, FAQs and plan-before-you-fly cards";
const MEDIA = `${url}/storage/v1/object/public/cms-media`;

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "booking-widget", label: "Booking Widget" },
  { id: "faqs", label: "FAQs" },
  { id: "seat-plan", label: "Seat Plan" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

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

const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };

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
  ...BACKLINKS,
};

const WIDGET_STYLE = { offsetY: -80, offsetYMobile: null };

const FAQS_STYLE = {
  ...LAYOUT,
  showTitle: true,
  showBrowse: true,
  itemGap: "default",
  titleAlign: "left",
  ...text("titleColor", "700", "semibold"),
  itemBg: "background",
  itemBorderColor: "200",
  itemRadius: "lg",
  ...text("questionColor", "700", "medium"),
  ...text("answerColor", "600", "normal"),
  iconColor: "700",
  browseBg: "secondary",
  browseHoverBg: "secondary-800",
  ...text("browseText", "btn", "semibold"),
  ...BACKLINKS,
};

const PLAN_STYLE = {
  showHeader: true,
  showDescription: true,
  columns: "3",
  cardGap: "default",
  cardRadius: "sm",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  ...text("titleColor", "700", "semibold"),
  ...text("descriptionColor", "700", "normal"),
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "700", "normal"),
  ...text("buttonText", "primary-1", "semibold"),
  buttonTextHover: "background",
  learnMoreAlign: "end",
  cardBg: "50",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  ...BACKLINKS,
};

const PLAN_CARDS = [
  {
    id: "baggage",
    href: "/travel-experience/before-you-fly/allowed-baggage",
    imageUrl: `${MEDIA}/seat-selection/plan-1.webp`,
  },
  {
    id: "prohibited",
    href: "/travel-experience/before-you-fly/prohibited-items",
    imageUrl: `${MEDIA}/seat-selection/plan-2.webp`,
  },
  {
    id: "seat",
    href: "/travel-experience/before-you-fly/seat-selection",
    imageUrl: `${MEDIA}/before-you-fly/seat-selection-v2.webp`,
  },
];

function loadLocale(lang) {
  const path = resolve(process.cwd(), `../flychamadmin/src/cms2/i18n/locales/${lang}.json`);
  return JSON.parse(readFileSync(path, "utf8")).bookAFlightPage;
}

function buildBlocks(lang) {
  const page = loadLocale(lang);
  return [
    {
      type: "breadcrumbs",
      style: CRUMBS_STYLE,
      content: {
        items: [
          { label: page.breadcrumbHome, href: "/" },
          { label: page.breadcrumb, href: "" },
        ],
        separator: "/",
        ariaLabel: lang === "ar" ? "مسار التنقل" : "Breadcrumb",
        links: [],
      },
    },
    {
      type: "page-media-hero",
      style: HERO_STYLE,
      content: {
        title: page.hero.title,
        subtitle: page.hero.subtitle,
        imageUrl: `${MEDIA}/our-fleet/hero.webp`,
        imageAlt: page.hero.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "booking-widget",
      style: WIDGET_STYLE,
      content: {},
    },
    {
      type: "faqs",
      style: FAQS_STYLE,
      content: {
        title: page.faq.title,
        browseLabel: page.faq.browse,
        browseHref: "/help/faqs",
        items: page.faq.items,
        links: [],
      },
    },
    {
      type: "seat-plan",
      style: PLAN_STYLE,
      content: {
        title: page.plan.title,
        description: page.plan.description,
        learnMore: page.plan.learnMore,
        items: PLAN_CARDS.map((card) => ({
          ...card,
          title: page.plan.cards[card.id].title,
          description: page.plan.cards[card.id].description,
          imageAlt: page.plan.cards[card.id].imageAlt,
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

function curl(method, path, { body, token, prefer, query, contentType, headers } = {}) {
  const qs = query ? `?${query}` : "";
  const args = [
    "-sS",
    "-X",
    method,
    `${url}${path}${qs}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    `Content-Type: ${contentType || "application/json"}`,
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  for (const header of headers || []) args.push("-H", header);
  let dir;
  if (body !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "cms-seed-"));
    const tmp = join(dir, "body.json");
    writeFileSync(tmp, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${tmp}`);
  }
  let stdout;
  try {
    stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 20_000_000 });
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
    query: `slug=eq.${PAGE_SLUG}&select=id,label`,
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
        label: PAGE_LABEL,
        description: PAGE_DESCRIPTION,
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

console.log("Done. Page slug:", PAGE_SLUG);
