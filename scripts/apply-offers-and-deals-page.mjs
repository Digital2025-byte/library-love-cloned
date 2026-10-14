/**
 * Seed the Offers & Deals page (slug offers-and-deals, public /offers-and-deals)
 * in EN + AR — Figma 40951:24297 (desktop) / 40954:91178 (mobile).
 *
 * Registers the flight-deals + service-deals component types, uploads the
 * Figma photos to cms-media/offers-and-deals/, creates the page, and inserts:
 *   0 page-media-hero   (slim height, display title, solid fade)
 *   1 booking-search    (Figma booking box on the live engine; pulled up over the hero)
 *   2 flight-deals      (origin / trip / class filters + cards)
 *   3 service-deals     (baggage, seat, business offers)
 *   4 seat-journey      (promo layout — Cham Miles members offer)
 *   5 newsletter-signup (photo band, flush on the footer)
 *
 * Idempotent: skips a language that already has blocks. `--repair` re-writes
 * type + content + style of the existing blocks by position instead.
 *
 *   node scripts/apply-offers-and-deals-page.mjs [--repair [--only=1,2]]
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_BACKLINK_STYLE } from "../../flychamadmin/src/cms2/cmsComponents/shared/backlinks/core/style.js";
import { FLIGHT_DEALS_BASE_STYLE } from "../../flychamadmin/src/cms2/cmsComponents/FlightDeals/utils/defaults.js";
import { buildFlightDealsContent } from "../../flychamadmin/src/cms2/cmsComponents/FlightDeals/utils/content.js";
import { SERVICE_DEALS_BASE_STYLE } from "../../flychamadmin/src/cms2/cmsComponents/ServiceDeals/utils/defaults.js";
import { buildServiceDealsContent } from "../../flychamadmin/src/cms2/cmsComponents/ServiceDeals/utils/content.js";
import { BOOKING_SEARCH_BASE_STYLE } from "../../flychamadmin/src/cms2/cmsComponents/BookingSearch/utils/defaults.js";
import { buildBookingSearchContent } from "../../flychamadmin/src/cms2/cmsComponents/BookingSearch/utils/content.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(HERE, "assets/offers-and-deals");
const REPAIR = process.argv.includes("--repair");
// --only=1,3 limits --repair to those positions (keeps CMS edits on the rest).
const ONLY = (process.argv.find((arg) => arg.startsWith("--only=")) || "")
  .slice(7)
  .split(",")
  .filter(Boolean)
  .map(Number);

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
const PAGE_SLUG = "offers-and-deals";
const FOLDER = "offers-and-deals";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;

const UPLOADS = [
  "hero.webp",
  "dubai.webp",
  "sharjah.webp",
  "istanbul.webp",
  "baggage.webp",
  "seat.webp",
  "business.webp",
  "cham-miles.webp",
  "newsletter.webp",
];

const TYPES = [
  { id: "flight-deals", label: "Flight Deals" },
  { id: "service-deals", label: "Service Deals" },
  { id: "booking-search", label: "Booking Search" },
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

// Full style objects so every drawer control shows its value.
const HERO_STYLE = {
  layout: "cover",
  sectionBg: "100",
  height: "slim",
  contentWidth: "default",
  objectPosition: "center",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  overlayWidth: "solid",
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "700", "normal"),
  titleSize: "display",
  showButton: false,
  buttonBg: "secondary",
  buttonBgHover: "",
  ...text("buttonText", "50", "semibold"),
  autoplay: true,
  slideDuration: "6",
  showControls: true,
  controlsColor: "secondary-2",
  controlsBottom: 0,
  ...DEFAULT_BACKLINK_STYLE,
};

// Figma: the box overlaps the hero by 93px on desktop (page gap 60 − 152 ≈ −92)
// and sits right under it on phones (page gap 32 − 32 = 0).
const BOOKING_STYLE = { ...BOOKING_SEARCH_BASE_STYLE, offsetY: -152, offsetYMobile: -32 };

const FLIGHT_STYLE = { ...FLIGHT_DEALS_BASE_STYLE, ...DEFAULT_BACKLINK_STYLE };
const SERVICE_STYLE = { ...SERVICE_DEALS_BASE_STYLE, ...DEFAULT_BACKLINK_STYLE };

const PROMO_STYLE = {
  layout: "promo",
  imageSide: "right",
  contentAlign: "center",
  imageRadius: "2xl",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  showButton: true,
  showButtonIcon: false,
  buttonSize: "medium",
  buttonBg: "secondary",
  buttonBgHover: "secondary-800",
  ...text("buttonText", "700", "semibold"),
  ...DEFAULT_BACKLINK_STYLE,
};

const NEWSLETTER_STYLE = {
  variant: "photo",
  overlayOpacity: 20,
  bgFocus: 36,
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "normal"),
  inputBg: "white",
  inputBorder: "white",
  inputText: "700",
  iconColor: "primary-1",
  buttonBg: "secondary",
  buttonHoverBg: "",
  ...text("buttonText", "700", "semibold"),
  ...DEFAULT_BACKLINK_STYLE,
};

const COPY = {
  en: {
    heroTitle: "Offers & Deals",
    heroSubtitle: "Discover our latest flight offers",
    heroAlt: "A family smiling together on board a Fly Cham flight",
    promoTitle: "Special offer for Cham Miles members",
    promoBody: "Sign up for the latest flight deals\nand get them delivered straight to your inbox.",
    promoAlt: "A couple enjoying a meal on board",
    promoButton: "Join now",
    newsletterTitle: "Stay Inspired for Your Next Journey",
    newsletterBody:
      "Receive destination ideas, travel stories, Fly Cham updates for your future journeys directly in your inbox.",
    newsletterLabel: "Email address",
    newsletterPlaceholder: "Enter your email address",
    newsletterCta: "Subscribe",
  },
  ar: {
    heroTitle: "العروض والصفقات",
    heroSubtitle: "اكتشف أحدث عروض رحلاتنا",
    heroAlt: "عائلة مبتسمة على متن رحلة فلاي شام",
    promoTitle: "عرض خاص لأعضاء أميال شام",
    promoBody: "اشترك لتصلك أحدث عروض الرحلات\nمباشرةً إلى بريدك الإلكتروني.",
    promoAlt: "زوجان يستمتعان بوجبة على متن الطائرة",
    promoButton: "انضم الآن",
    newsletterTitle: "استلهم وجهتك القادمة",
    newsletterBody:
      "احصل على أفكار للوجهات وقصص السفر وأخبار فلاي شام لرحلاتك المقبلة مباشرةً في بريدك الإلكتروني.",
    newsletterLabel: "البريد الإلكتروني",
    newsletterPlaceholder: "أدخل بريدك الإلكتروني",
    newsletterCta: "اشترك",
  },
};

function buildBlocks(lang) {
  const copy = COPY[lang];
  return [
    {
      type: "page-media-hero",
      style: HERO_STYLE,
      content: {
        title: copy.heroTitle,
        subtitle: copy.heroSubtitle,
        imageUrl: `${MEDIA}/hero.webp`,
        imageAlt: copy.heroAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    { type: "booking-search", style: BOOKING_STYLE, content: buildBookingSearchContent(lang) },
    { type: "flight-deals", style: FLIGHT_STYLE, content: buildFlightDealsContent(lang) },
    { type: "service-deals", style: SERVICE_STYLE, content: buildServiceDealsContent(lang) },
    {
      type: "seat-journey",
      style: PROMO_STYLE,
      content: {
        title: copy.promoTitle,
        description: copy.promoBody,
        imageUrl: `${MEDIA}/cham-miles.webp`,
        imageAlt: copy.promoAlt,
        buttonLabel: copy.promoButton,
        buttonHref: "/cham-miles",
        buttonIcon: "",
        links: [],
      },
    },
    {
      type: "newsletter-signup",
      style: NEWSLETTER_STYLE,
      content: {
        title: copy.newsletterTitle,
        description: copy.newsletterBody,
        label: copy.newsletterLabel,
        placeholder: copy.newsletterPlaceholder,
        cta: copy.newsletterCta,
        bgUrl: `${MEDIA}/newsletter.webp`,
        planeUrl: "",
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

// curl.exe with UTF-8 temp-file bodies (`-d <arg>` mangles Arabic on Windows).
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

function fail(message, payload) {
  console.error(message, restError(payload, payload ? JSON.stringify(payload) : "unknown error"));
  process.exit(1);
}

console.log("Target project:", url);
const auth = curl("POST", "/auth/v1/token", { query: "grant_type=password", body: { email, password } });
if (!auth?.access_token) fail("Sign-in failed:", auth);
const token = auth.access_token;

for (const type of TYPES) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: type,
  });
  if (res?.message) fail(`component_types upsert failed (${type.id}):`, res);
  console.log("component_types ok:", type.id);
}

for (const name of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, {
    token,
    file: resolve(ASSETS, name),
    contentType: "image/webp",
    headers: ["x-upsert: true", "Cache-Control: max-age=3600"],
  });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) fail(`image upload failed (${name}):`, res);
  console.log("image uploaded:", `${FOLDER}/${name}`);
}

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
  if (!Array.isArray(existing)) fail("pages lookup failed:", existing);
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Offers & Deals",
        description: "Flight deals, baggage and service offers, and Cham Miles member offers",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) fail("pages insert failed:", inserted);
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id&order=position.asc`,
  });
  if (!Array.isArray(links)) fail(`page_components lookup failed (${lang}):`, links);
  const blocks = buildBlocks(lang);

  if (links.length) {
    if (!REPAIR) {
      console.log(`page already has ${links.length} ${lang} block(s) — skipping (use --repair to re-write).`);
      continue;
    }
    for (let position = 0; position < Math.min(blocks.length, links.length); position += 1) {
      if (ONLY.length && !ONLY.includes(position)) continue;
      const block = blocks[position];
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${links[position].component_id}`,
        prefer: "return=minimal",
        body: { type: block.type, style: { [lang]: block.style }, content: { [lang]: block.content } },
      });
      if (res?.message) fail(`components repair failed (${lang} ${block.type}):`, res);
      console.log(`repaired ${block.type} (${lang}) @${position}`);
    }
    continue;
  }

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
    if (!comp?.id) fail(`components insert failed (${lang} ${block.type}):`, inserted);
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) fail(`page_components insert failed (${lang}):`, link);
    console.log(`seeded ${block.type} (${lang}) @${position}`);
  }
}

console.log("Done.", PAGE_SLUG, pageId);
