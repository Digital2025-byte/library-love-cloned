/**
 * One-off admin task for the Recent News dynamic page:
 *   1. Ensure recent-news and media-cards types exist.
 *   2. Ensure the "recent-news" page row exists.
 *   3. Seed blocks per language (EN + AR), if that language has none:
 *        0 recent-news (header + filters + listing)
 *        1 media-cards
 *
 * Idempotent: re-running upserts the types/page and only seeds a language's
 * blocks when that language has none.
 *
 *   node scripts/apply-recent-news-page.mjs
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

const PAGE_SLUG = "recent-news";
const LISTING_TYPE = "recent-news";
const CARDS_TYPE = "media-cards";

const MONTH_IDS = [
  "all",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const YEAR_IDS = ["all", "2025", "2024", "2023"];
const TOPIC_IDS = [
  "all",
  "corporate",
  "network",
  "sponsorships",
  "events",
  "customerExperience",
];

const ARTICLES = [
  {
    id: "expansionPlans",
    coverKey: "latest",
    imageUrl: "/media-center/latest-news.jpg",
    dateTime: "2025-07-24",
    topic: "network",
    year: "2025",
    month: "july",
    href: "/recent-news/expansionPlans",
  },
  {
    id: "corporateUpdate",
    coverKey: "2",
    imageUrl: "/media-center/news-grid-2.jpg",
    dateTime: "2025-07-18",
    topic: "corporate",
    year: "2025",
    month: "july",
    href: "/recent-news/corporateUpdate",
  },
  {
    id: "sponsorshipLaunch",
    coverKey: "3",
    imageUrl: "/media-center/news-grid-3.jpg",
    dateTime: "2025-06-12",
    topic: "sponsorships",
    year: "2025",
    month: "june",
    href: "/recent-news/sponsorshipLaunch",
  },
  {
    id: "communityEvent",
    coverKey: "damascus",
    imageUrl: "/our-destinations/damascus.jpeg",
    dateTime: "2025-06-05",
    topic: "events",
    year: "2025",
    month: "june",
    href: "/recent-news/communityEvent",
  },
  {
    id: "customerExperience",
    coverKey: "istanbul",
    imageUrl: "/our-destinations/istanbul.jpg",
    dateTime: "2025-05-22",
    topic: "customerExperience",
    year: "2025",
    month: "may",
    href: "/recent-news/customerExperience",
  },
  {
    id: "routeExpansion",
    coverKey: "dubai",
    imageUrl: "/our-destinations/dubai.jpg",
    dateTime: "2025-05-10",
    topic: "network",
    year: "2025",
    month: "may",
    href: "/recent-news/routeExpansion",
  },
];

const TEXT = {
  en: {
    title: "Recent News",
    description:
      "Stay informed with the latest Fly Cham news, official announcements, press releases, partnerships, company developments, and stories from across our network.",
    filterLabel: "Filter by:",
    monthLabel: "Month",
    yearLabel: "Year",
    searchLabel: "Search",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    months: {
      all: "All month",
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
    years: { all: "All year", 2025: "2025", 2024: "2024", 2023: "2023" },
    topics: {
      all: "All topic",
      corporate: "Corporate",
      network: "Network",
      sponsorships: "Sponsorships",
      events: "Events",
      customerExperience: "Customer experience",
    },
    categories: {
      corporate: "Corporate",
      network: "Network",
      sponsorships: "Sponsorships",
      events: "Events",
      customerExperience: "Customer experience",
    },
    articles: {
      expansionPlans: {
        date: "24 JUL 2025",
        title: "Company Announces Major Expansion Plans",
        imageAlt: "Modern city skyline beside the water",
      },
      corporateUpdate: {
        date: "18 JUL 2025",
        title: "Fly Cham Strengthens Corporate Governance Framework",
        imageAlt: "Dubai skyline at sunset",
      },
      sponsorshipLaunch: {
        date: "12 JUN 2025",
        title: "Fly Cham Launches New Community Sponsorship Program",
        imageAlt: "Istanbul cityscape with historic architecture",
      },
      communityEvent: {
        date: "05 JUN 2025",
        title: "Fly Cham Hosts Annual Community Engagement Event",
        imageAlt: "Damascus city view",
      },
      customerExperience: {
        date: "22 MAY 2025",
        title: "Fly Cham Introduces Enhanced Onboard Customer Experience",
        imageAlt: "Istanbul landmarks",
      },
      routeExpansion: {
        date: "10 MAY 2025",
        title: "Fly Cham Expands Regional Route Network",
        imageAlt: "Dubai waterfront skyline",
      },
    },
    cards: {
      learnMore: "Learn More",
      responsibility: {
        title: "Our Responsibility",
        description:
          "Our journey doesn't end in the sky — we believe in supporting communities, creating opportunities for youth, and embracing sustainability in everything we do to make a positive impact and invest in a more sustainable and inclusive future.",
        imageAlt: "People planting trees together",
      },
      mediaTeam: {
        title: "Contact Our Media Team",
        description:
          "Are you looking for the latest news and information about Fly Cham? The media center provides comprehensive information including the latest news and press releases, photos, and high-quality video clips.",
        imageAlt: "Fly Cham media team at work",
      },
    },
  },
  ar: {
    title: "آخر الأخبار",
    description:
      "ابقَ على اطلاع بأحدث أخبار فلاي شام والإعلانات الرسمية والبيانات الصحفية والشراكات وتطورات الشركة والقصص من شبكتنا.",
    filterLabel: "تصفية حسب:",
    monthLabel: "الشهر",
    yearLabel: "السنة",
    searchLabel: "بحث",
    previousLabel: "الصفحة السابقة",
    nextLabel: "الصفحة التالية",
    months: {
      all: "كل الشهور",
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
    years: { all: "كل السنوات", 2025: "2025", 2024: "2024", 2023: "2023" },
    topics: {
      all: "كل المواضيع",
      corporate: "الشركة",
      network: "الشبكة",
      sponsorships: "الرعايات",
      events: "الفعاليات",
      customerExperience: "تجربة العملاء",
    },
    categories: {
      corporate: "الشركة",
      network: "الشبكة",
      sponsorships: "الرعايات",
      events: "الفعاليات",
      customerExperience: "تجربة العملاء",
    },
    articles: {
      expansionPlans: {
        date: "24 يوليو 2025",
        title: "الشركة تعلن عن خطط توسع كبرى",
        imageAlt: "أفق مدينة حديثة بجانب الماء",
      },
      corporateUpdate: {
        date: "18 يوليو 2025",
        title: "فلاي شام تعزّز إطار الحوكمة المؤسسية",
        imageAlt: "أفق دبي عند الغروب",
      },
      sponsorshipLaunch: {
        date: "12 يونيو 2025",
        title: "فلاي شام تطلق برنامج رعاية مجتمعية جديد",
        imageAlt: "منظر إسطنبول مع معالم تاريخية",
      },
      communityEvent: {
        date: "05 يونيو 2025",
        title: "فلاي شام تستضيف فعالية المشاركة المجتمعية السنوية",
        imageAlt: "منظر مدينة دمشق",
      },
      customerExperience: {
        date: "22 مايو 2025",
        title: "فلاي شام تقدّم تجربة عملاء محسّنة على متن الطائرة",
        imageAlt: "معالم إسطنبول",
      },
      routeExpansion: {
        date: "10 مايو 2025",
        title: "فلاي شام توسّع شبكة الوجهات الإقليمية",
        imageAlt: "أفق دبي على الواجهة البحرية",
      },
    },
    cards: {
      learnMore: "اعرف المزيد",
      responsibility: {
        title: "مسؤوليتنا",
        description:
          "رحلتنا لا تنتهي في السماء — نؤمن بدعم المجتمعات، وخلق الفرص للشباب، وتبنّي الاستدامة في كل ما نقوم به لإحداث أثر إيجابي والاستثمار في مستقبل أكثر استدامة وشمولاً.",
        imageAlt: "أشخاص يزرعون الأشجار معاً",
      },
      mediaTeam: {
        title: "تواصل مع فريقنا الإعلامي",
        description:
          "هل تبحث عن أحدث الأخبار والمعلومات حول فلاي شام؟ يوفّر لك المركز الإعلامي معلومات شاملة تتضمّن أحدث الأخبار والبيانات الصحفية والصور ومقاطع الفيديو عالية الجودة.",
        imageAlt: "فريق الإعلام في فلاي شام",
      },
    },
  },
};

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

const LISTING_STYLE = {
  pageSize: "6",
  columns: "3",
  cardGap: "default",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  cardBg: "50",
  cardBorderColor: "200",
  iconColor: "600",
  searchBg: "secondary",
  searchHoverBg: "secondary-800",
  topicActiveBg: "primary-1",
  topicInactiveBg: "200",
  pageActiveBg: "primary-1",
  pageInactiveBg: "transparent",
  navBg: "200",
  navDisabledBg: "200",
  titleColor: "primary-1",
  titleFontWeight: "bold",
  titleColorHover: "primary-1",
  titleFontWeightHover: "bold",
  descriptionColor: "700",
  descriptionFontWeight: "normal",
  descriptionColorHover: "700",
  descriptionFontWeightHover: "normal",
  labelColor: "700",
  labelFontWeight: "medium",
  labelColorHover: "700",
  labelFontWeightHover: "medium",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  chipActiveText: "50",
  chipActiveTextFontWeight: "medium",
  chipActiveTextHover: "50",
  chipActiveTextFontWeightHover: "medium",
  tabText: "primary-1",
  tabTextFontWeight: "medium",
  tabTextHover: "primary-1",
  tabTextFontWeightHover: "medium",
  sectionTitleColor: "800",
  sectionTitleFontWeight: "semibold",
  sectionTitleColorHover: "800",
  sectionTitleFontWeightHover: "semibold",
  metaColor: "600",
  metaFontWeight: "normal",
  metaColorHover: "600",
  metaFontWeightHover: "normal",
  chipText: "primary-1",
  chipTextFontWeight: "medium",
  chipTextHover: "primary-1",
  chipTextFontWeightHover: "medium",
  cardTitleColor: "primary-1",
  cardTitleFontWeight: "semibold",
  cardTitleColorHover: "primary-1",
  cardTitleFontWeightHover: "semibold",
  ...BACKLINKS,
};

const CARDS_STYLE = {
  columns: "2",
  cardGap: "default",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  overlayColor: "secondary-2",
  cardTitleColor: "50",
  cardTitleFontWeight: "bold",
  cardTitleColorHover: "50",
  cardTitleFontWeightHover: "bold",
  cardDescriptionColor: "100",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "100",
  cardDescriptionFontWeightHover: "normal",
  learnMoreColor: "50",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "50",
  learnMoreFontWeightHover: "semibold",
  arrowBadgeBg: "100",
  arrowColor: "primary-1",
  ...BACKLINKS,
};

function optionsFrom(ids, labels) {
  return ids.map((id) => ({ id, label: labels[id] || id }));
}

function buildListingContent(lang) {
  const t = TEXT[lang];
  return {
    title: t.title,
    description: t.description,
    filterLabel: t.filterLabel,
    monthLabel: t.monthLabel,
    yearLabel: t.yearLabel,
    searchLabel: t.searchLabel,
    previousLabel: t.previousLabel,
    nextLabel: t.nextLabel,
    months: optionsFrom(MONTH_IDS, t.months),
    years: optionsFrom(YEAR_IDS, t.years),
    topics: optionsFrom(TOPIC_IDS, t.topics),
    items: ARTICLES.map((row) => {
      const article = t.articles[row.id];
      return {
        id: row.id,
        imageUrl: row.imageUrl,
        imageAlt: article.imageAlt,
        coverKey: row.coverKey,
        date: article.date,
        dateTime: row.dateTime,
        category: t.categories[row.topic],
        topic: row.topic,
        year: row.year,
        month: row.month,
        title: article.title,
        href: row.href,
      };
    }),
    links: [],
  };
}

function buildCardsContent(lang) {
  const t = TEXT[lang].cards;
  return {
    learnMore: t.learnMore,
    items: [
      {
        id: "responsibility",
        imageUrl: "/about-us/responsibility.jpg",
        imageAlt: t.responsibility.imageAlt,
        coverKey: "",
        title: t.responsibility.title,
        description: t.responsibility.description,
        cta: t.learnMore,
        href: "/our-responsibility",
      },
      {
        id: "mediaTeam",
        imageUrl: "/about-us/media-team.jpg",
        imageAlt: t.mediaTeam.imageAlt,
        coverKey: "",
        title: t.mediaTeam.title,
        description: t.mediaTeam.description,
        cta: t.learnMore,
        href: "/media-center",
      },
    ],
    links: [],
  };
}

const BLOCKS = [
  { type: LISTING_TYPE, style: LISTING_STYLE, content: buildListingContent },
  { type: CARDS_TYPE, style: CARDS_STYLE, content: buildCardsContent },
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

const role = curl("POST", "/rest/v1/rpc/ensure_first_admin", { token, body: {} });
if (role?.message) console.warn("ensure_first_admin warning:", role.message);

for (const row of [
  { id: LISTING_TYPE, label: "Recent News" },
  { id: CARDS_TYPE, label: "Media Cards" },
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
        label: "Recent News",
        description: "Recent Fly Cham news listing with filters and related media cards",
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
        lang,
        position,
      },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang} ${block.type}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${block.type} block (${lang}):`, comp.id);
  }

  const verify = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=position,components(type)&order=position.asc`,
  });
  const order = Array.isArray(verify)
    ? verify.map((row) => `${row.position}:${componentTypeOf(row)}`).join(" → ")
    : "(lookup failed)";
  console.log(`order (${lang}):`, order);
}

console.log("Done.");
