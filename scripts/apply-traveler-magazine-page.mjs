/**
 * One-off admin task for the Traveler Magazine dynamic page:
 *   1. Register the "marhaba-intro" and "explore-marhaba" component types
 *      (FK for components.type). page-media-hero is already live.
 *   2. Ensure the "traveler-magazine" page row exists.
 *   3. Seed the three blocks that make up the static page (hero, intro,
 *      explore) per language (EN + AR), if that language has no blocks yet.
 *
 * Idempotent: re-running upserts the types/page and only seeds a language's
 * blocks when that language has none. Run once against the CMS Supabase project.
 *
 *   node scripts/apply-traveler-magazine-page.mjs
 *
 * NOTE: behind a TLS-inspecting proxy the Supabase JS client fails with
 * "fetch failed" — use the curl auth+REST recipe in the cms2 docs instead.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const PAGE_SLUG = "traveler-magazine";
const INTRO_TYPE = "marhaba-intro";
const EXPLORE_TYPE = "explore-marhaba";
const HERO_TYPE = "page-media-hero";

const ISSUE_META = [
  { id: "2026-06", year: "2026", issue: 6, monthKey: "december", coverKey: "1", isNew: true },
  { id: "2026-05", year: "2026", issue: 5, monthKey: "october", coverKey: "2", isNew: false },
  { id: "2026-04", year: "2026", issue: 4, monthKey: "august", coverKey: "3", isNew: false },
  { id: "2026-03", year: "2026", issue: 3, monthKey: "june", coverKey: "1", isNew: false },
  { id: "2026-02", year: "2026", issue: 2, monthKey: "april", coverKey: "2", isNew: false },
  { id: "2026-01", year: "2026", issue: 1, monthKey: "february", coverKey: "3", isNew: false },
  { id: "2025-04", year: "2025", issue: 4, monthKey: "november", coverKey: "3", isNew: false },
  { id: "2025-03", year: "2025", issue: 3, monthKey: "august", coverKey: "2", isNew: false },
  { id: "2025-02", year: "2025", issue: 2, monthKey: "may", coverKey: "1", isNew: false },
  { id: "2025-01", year: "2025", issue: 1, monthKey: "february", coverKey: "2", isNew: false },
];

const TEXT = {
  en: {
    hero: {
      title: "Traveler Magazine",
      subtitle: "Your Gateway To New Information",
      imageAlt: "A mosaic of Fly Cham travel destinations and experiences",
    },
    intro: {
      title: "Marhaba Magazine",
      description:
        "Browse Traveler Magazine, specially designed to be your perfect companion on all your flights. Enjoy reading a unique collection of travel and tourism articles rich in information, useful tips, and stories that inspire you to explore the world.",
      imageAlt: "Marhaba onboard magazine cover",
    },
    explore: {
      title: "Explore Marhaba",
    },
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
    },
  },
  ar: {
    hero: {
      title: "مجلة المسافر",
      subtitle: "بوابتك إلى معلومات جديدة",
      imageAlt: "مجموعة من وجهات وتجارب السفر مع فلاي شام",
    },
    intro: {
      title: "مجلة مرحبا",
      description:
        "تصفّح مجلة المسافر، المصمّمة خصيصاً لتكون رفيقك المثالي في جميع رحلاتك. استمتع بقراءة مجموعة فريدة من مقالات السفر والسياحة الغنية بالمعلومات والنصائح المفيدة والقصص التي تلهمك لاستكشاف العالم.",
      imageAlt: "غلاف مجلة مرحبا على متن الطائرة",
    },
    explore: {
      title: "استكشف مرحبا",
    },
    months: {
      january: "يناير",
      february: "فبراير",
      march: "مارس",
      april: "أبريل",
      may: "مايو",
      june: "يونيو",
      july: "يوليو",
      august: "أغسطس",
      september: "سبتمبر",
      october: "أكتوبر",
      november: "نوفمبر",
      december: "ديسمبر",
    },
  },
};

function buildHeroContent(lang) {
  const t = TEXT[lang].hero;
  return {
    title: t.title,
    subtitle: t.subtitle,
    imageUrl: "",
    imageAlt: t.imageAlt,
    links: [],
  };
}

function buildIntroContent(lang) {
  const t = TEXT[lang].intro;
  return {
    title: t.title,
    description: t.description,
    imageUrl: "",
    imageAlt: t.imageAlt,
    links: [],
  };
}

function buildExploreContent(lang) {
  const months = TEXT[lang].months;
  return {
    title: TEXT[lang].explore.title,
    items: ISSUE_META.map((row) => ({
      id: row.id,
      year: row.year,
      issue: row.issue,
      month: months[row.monthKey] || row.monthKey,
      imageUrl: "",
      coverKey: row.coverKey,
      href: "/magazine-view",
      isNew: row.isNew,
    })),
    links: [],
  };
}

const HERO_STYLE = {
  layout: "cover",
  sectionBg: "100",
  height: "default",
  contentWidth: "default",
  objectPosition: "center",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  titleColor: "primary-1",
  subtitleColor: "700",
  titleFontWeight: "bold",
  subtitleFontWeight: "normal",
  titleColorHover: "primary-1",
  titleFontWeightHover: "bold",
  subtitleColorHover: "700",
  subtitleFontWeightHover: "normal",
  showLinks: true,
};

const INTRO_STYLE = {
  imageSide: "right",
  imageRadius: "3xl",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  bodyColor: "700",
  bodyFontWeight: "normal",
  bodyColorHover: "700",
  bodyFontWeightHover: "normal",
  showLinks: true,
};

const EXPLORE_STYLE = {
  columns: "3",
  cardGap: "default",
  cardRadius: "xl",
  sectionPadding: "default",
  showYearFilter: true,
  showYearHeading: true,
  showSectionBg: false,
  sectionBg: "100",
  panelBg: "50",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  cardTitleColor: "primary-1",
  cardTitleFontWeight: "semibold",
  cardTitleColorHover: "primary-1",
  cardTitleFontWeightHover: "semibold",
  cardDescriptionColor: "600",
  cardDescriptionFontWeight: "medium",
  cardDescriptionColorHover: "600",
  cardDescriptionFontWeightHover: "medium",
  newBadgeBg: "secondary-1",
  badgeText: "50",
  badgeTextFontWeight: "semibold",
  badgeTextHover: "50",
  badgeTextFontWeightHover: "semibold",
  showLinks: true,
};

const BLOCKS = [
  { type: HERO_TYPE, style: HERO_STYLE, content: buildHeroContent },
  { type: INTRO_TYPE, style: INTRO_STYLE, content: buildIntroContent },
  { type: EXPLORE_TYPE, style: EXPLORE_STYLE, content: buildExploreContent },
];

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
  if (body !== undefined) args.push("-d", JSON.stringify(body));
  const stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
  }
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

const role = curl("POST", "/rest/v1/rpc/ensure_first_admin", { token, body: {} });
if (role?.message) console.warn("ensure_first_admin warning:", role.message);

for (const row of [
  { id: INTRO_TYPE, label: "Marhaba Intro" },
  { id: EXPLORE_TYPE, label: "Explore Marhaba" },
]) {
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
        label: "Traveler Magazine",
        description: "Marhaba magazine intro and issue archive",
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
    console.log(`page already has ${links.length} ${lang} block(s) — skipping seed.`);
    continue;
  }

  for (let position = 0; position < BLOCKS.length; position += 1) {
    const block = BLOCKS[position];
    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: {
        type: block.type,
        position,
        style: { [lang]: block.style },
        content: { [lang]: block.content(lang) },
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
      body: {
        page_id: pageId,
        component_id: comp.id,
        position,
        lang,
      },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang} ${block.type}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${block.type} block (${lang}):`, comp.id);
  }
}

console.log("Done.");
