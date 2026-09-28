/**
 * One-off admin task for the Media Center dynamic page:
 *   1. Register remaining component types (page-intro, latest-news, news-grid,
 *      media-contact-cards, media-newsletter-signup). page-media-hero and
 *      magazine-banner are already live.
 *   2. Ensure the "media-center" page row exists.
 *   3. Insert any missing blocks and PATCH positions so the page order is:
 *        0 page-media-hero
 *        1 page-intro
 *        2 latest-news
 *        3 news-grid
 *        4 magazine-banner
 *        5 media-contact-cards
 *        6 media-newsletter-signup
 *
 * Idempotent: re-running upserts types/page, inserts only missing types, and
 * moves existing blocks (including magazine-banner from position 1 → 4).
 *
 *   node scripts/apply-media-center-page.mjs
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

const PAGE_SLUG = "media-center";

const HERO_TYPE = "page-media-hero";
const INTRO_TYPE = "page-intro";
const LATEST_TYPE = "latest-news";
const GRID_TYPE = "news-grid";
const BANNER_TYPE = "magazine-banner";
const CONTACT_TYPE = "media-contact-cards";
const NEWSLETTER_TYPE = "media-newsletter-signup";

const ORDER = [
  HERO_TYPE,
  INTRO_TYPE,
  LATEST_TYPE,
  GRID_TYPE,
  BANNER_TYPE,
  CONTACT_TYPE,
  NEWSLETTER_TYPE,
];

const COMPONENT_TYPES = [
  { id: INTRO_TYPE, label: "Page Intro" },
  { id: LATEST_TYPE, label: "Latest News" },
  { id: GRID_TYPE, label: "News Grid" },
  { id: CONTACT_TYPE, label: "Media Contact Cards" },
  { id: NEWSLETTER_TYPE, label: "Media Newsletter Signup" },
];

const TEXT = {
  en: {
    hero: {
      title: "Media Center",
      subtitle: "All News and Press Releases at Your Fingertips",
      imageAlt: "Fly Cham aircraft flying above the clouds",
    },
    intro: {
      body: "Welcome to the Fly Cham Media Center, where we provide the latest news, press releases, events, and official announcements. You can also browse photos and videos, or contact our media team.",
    },
    latest: {
      title: "Latest News",
      readMore: "Read more",
      expansionPlans: {
        date: "Mar 7, 2026",
        category: "Network",
        title: "Company Announces Major Expansion Plans",
        excerpt:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageAlt: "Modern city skyline beside the water",
      },
    },
    grid: {
      title: "Explore News & Updates",
      description:
        "Browse recent Fly Cham activities and news, press releases, company announcements, and updates.",
      learnMore: "Learn More",
      viewAll: "View All News",
      expansionPlans: {
        date: "Mar 7, 2026",
        category: "Destinations",
        title: "Company Announces Major Expansion Plans",
        excerpt:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageAlt: "Modern city skyline beside the water",
      },
      newRoutes: {
        date: "Feb 18, 2026",
        category: "Network",
        title: "Fly Cham Adds Three New Regional Routes",
        excerpt:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor.",
        imageAlt: "Dubai skyline at sunset",
      },
      fleetUpdate: {
        date: "Jan 24, 2026",
        category: "Company",
        title: "Fly Cham Welcomes New Aircraft to Its Fleet",
        excerpt:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
        imageAlt: "Istanbul cityscape with historic architecture",
      },
    },
    magazine: {
      title: "A Closer Look at Our Destinations in Marhaba Magazine",
      description:
        "Don't miss our inspiring destination stories, cultural and tradition spotlights from across our destinations network in Marhaba Onboard Magazine.",
      cta: "Explore Magazine Issues",
    },
    contacts: {
      publicRelations: {
        title: "Public Relation Department",
        description:
          "Whether you represent the media, are a strategic partner, or are simply interested in following our news, our Public Relations team is ready to collaborate and provide support with the highest level of professionalism. For inquiries regarding collaborations, press release requests, or to coordinate interviews and media coverage, please contact the Public Relations team via email at:",
      },
      mediaTeam: {
        title: "Contact Our Media Team",
        description:
          "For media inquiries, interviews, and press materials, please contact our Marketing and Communication Department.",
        department: "Marketing and Communication Department",
        location: "Fly Cham Damascus, Syria",
      },
    },
    newsletter: {
      title: "Stay Connected",
      description:
        "Subscribe to our newsletter to receive our latest news, activities, and Marhaba magazine updates.",
      label: "Email address",
      placeholder: "Enter email address",
      cta: "Subscribe",
    },
  },
  ar: {
    hero: {
      title: "المركز الإعلامي",
      subtitle: "جميع الأخبار والبيانات الصحفية في متناول يدك",
      imageAlt: "طائرة فلاي شام تحلّق فوق الغيوم",
    },
    intro: {
      body: "أهلاً بكم في المركز الإعلامي لفلاي شام، حيث نوفّر أحدث الأخبار والبيانات الصحفية والفعاليات والإعلانات الرسمية. يمكنكم أيضاً تصفّح الصور ومقاطع الفيديو، أو التواصل مع فريقنا الإعلامي.",
    },
    latest: {
      title: "آخر الأخبار",
      readMore: "اقرأ المزيد",
      expansionPlans: {
        date: "7 مارس 2026",
        category: "الشبكة",
        title: "الشركة تعلن عن خطط توسع كبرى",
        excerpt:
          "لوريم إيبسوم dolor sit amet، consectetur adipiscing elit، sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam، quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageAlt: "أفق مدينة حديثة بجانب الماء",
      },
    },
    grid: {
      title: "استكشف الأخبار والتحديثات",
      description:
        "تصفّح أحدث أنشطة فلاي شام والأخبار والبيانات الصحفية وإعلانات الشركة والتحديثات.",
      learnMore: "اعرف المزيد",
      viewAll: "عرض كل الأخبار",
      expansionPlans: {
        date: "7 مارس 2026",
        category: "الوجهات",
        title: "الشركة تعلن عن خطط توسع كبرى",
        excerpt:
          "لوريم إيبسوم dolor sit amet، consectetur adipiscing elit، sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageAlt: "أفق مدينة حديثة بجانب الماء",
      },
      newRoutes: {
        date: "18 فبراير 2026",
        category: "الشبكة",
        title: "فلاي شام تضيف ثلاث وجهات إقليمية جديدة",
        excerpt:
          "Ut enim ad minim veniam، quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor.",
        imageAlt: "أفق دبي عند الغروب",
      },
      fleetUpdate: {
        date: "24 يناير 2026",
        category: "الشركة",
        title: "فلاي شام تستقبل طائرات جديدة في أسطولها",
        excerpt:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
        imageAlt: "منظر إسطنبول مع معالم تاريخية",
      },
    },
    magazine: {
      title: "نظرة أقرب على وجهاتنا في مجلة مرحبا",
      description:
        "لا تفوّت قصص وجهاتنا الملهمة، ولمحات الثقافة والتقاليد من شبكة وجهاتنا في مجلة مرحبا على متن الطائرة.",
      cta: "استكشف أعداد المجلة",
    },
    contacts: {
      publicRelations: {
        title: "قسم العلاقات العامة",
        description:
          "سواء كنتم تمثلون وسائل الإعلام، أو كنتم شريكاً استراتيجياً، أو مهتمين بمتابعة أخبارنا، فإن فريق العلاقات العامة لدينا مستعد للتعاون وتقديم الدعم بأعلى مستويات الاحترافية. للاستفسارات المتعلقة بالتعاون أو طلبات البيانات الصحفية أو تنسيق المقابلات والتغطية الإعلامية، يرجى التواصل مع فريق العلاقات العامة عبر البريد الإلكتروني:",
      },
      mediaTeam: {
        title: "تواصل مع فريقنا الإعلامي",
        description:
          "للاستفسارات الإعلامية والمقابلات والمواد الصحفية، يرجى التواصل مع قسم التسويق والاتصال.",
        department: "قسم التسويق والاتصال",
        location: "فلاي شام، دمشق، سوريا",
      },
    },
    newsletter: {
      title: "ابقَ على تواصل",
      description:
        "اشترك في نشرتنا الإخبارية لتصلك أحدث الأخبار والأنشطة وتحديثات مجلة مرحبا.",
      label: "عنوان البريد الإلكتروني",
      placeholder: "أدخل عنوان البريد الإلكتروني",
      cta: "اشترك",
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

const HERO_STYLE = {
  layout: "cover",
  sectionBg: "100",
  height: "default",
  contentWidth: "default",
  objectPosition: "72% center",
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
  ...BACKLINKS,
};

const INTRO_STYLE = {
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  bodyColor: "800",
  bodyFontWeight: "normal",
  bodyColorHover: "800",
  bodyFontWeightHover: "normal",
  ...BACKLINKS,
};

const LATEST_STYLE = {
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  imageRadius: "2xl",
  titleColor: "primary-1",
  titleFontWeight: "semibold",
  titleColorHover: "primary-1",
  titleFontWeightHover: "semibold",
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
  cardDescriptionColor: "700",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "700",
  cardDescriptionFontWeightHover: "normal",
  buttonBg: "secondary",
  buttonHoverBg: "secondary-800",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  iconColor: "600",
  ...BACKLINKS,
};

const GRID_STYLE = {
  columns: "3",
  cardGap: "default",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  cardBg: "50",
  cardBorderColor: "200",
  titleColor: "primary-1",
  titleFontWeight: "semibold",
  titleColorHover: "primary-1",
  titleFontWeightHover: "semibold",
  descriptionColor: "700",
  descriptionFontWeight: "normal",
  descriptionColorHover: "700",
  descriptionFontWeightHover: "normal",
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
  cardDescriptionColor: "700",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "700",
  cardDescriptionFontWeightHover: "normal",
  learnMoreColor: "primary-1",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "primary-1",
  learnMoreFontWeightHover: "semibold",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  viewAllBg: "background",
  viewAllBorder: "primary-1",
  viewAllHoverBg: "100",
  iconColor: "600",
  ...BACKLINKS,
};

const BANNER_STYLE = {
  bannerBg: "primary-1",
  titleColor: "50",
  titleFontWeight: "semibold",
  titleColorHover: "50",
  titleFontWeightHover: "semibold",
  descriptionColor: "50",
  descriptionFontWeight: "normal",
  descriptionColorHover: "50",
  descriptionFontWeightHover: "normal",
  buttonBg: "secondary",
  buttonHoverBg: "secondary-800",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

const CONTACT_STYLE = {
  columns: "2",
  cardGap: "default",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  cardBg: "background",
  cardBorderColor: "200",
  iconBg: "100",
  iconColor: "900",
  cardTitleColor: "800",
  cardTitleFontWeight: "semibold",
  cardTitleColorHover: "800",
  cardTitleFontWeightHover: "semibold",
  cardDescriptionColor: "700",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "700",
  cardDescriptionFontWeightHover: "normal",
  learnMoreColor: "primary-1",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "primary-1",
  learnMoreFontWeightHover: "semibold",
  ...BACKLINKS,
};

const NEWSLETTER_STYLE = {
  sectionBg: "100",
  borderColor: "200",
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
  buttonHoverBg: "secondary-800",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

function article(row, extra = {}) {
  return {
    id: extra.id,
    imageUrl: "",
    imageAlt: row.imageAlt,
    date: row.date,
    dateTime: extra.dateTime,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    cta: extra.cta || "",
    href: extra.href,
    ...("coverKey" in extra ? { coverKey: extra.coverKey } : {}),
  };
}

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
  return { body: TEXT[lang].intro.body, links: [] };
}

function buildLatestContent(lang) {
  const t = TEXT[lang].latest;
  return {
    title: t.title,
    readMore: t.readMore,
    items: [
      article(t.expansionPlans, {
        id: "expansionPlans",
        dateTime: "2026-03-07",
        cta: t.readMore,
        href: "/media-center/news/expansionPlans",
      }),
    ],
    links: [],
  };
}

function buildGridContent(lang) {
  const t = TEXT[lang].grid;
  const rows = [
    { id: "expansionPlans", coverKey: "latest", dateTime: "2026-03-07" },
    { id: "newRoutes", coverKey: "2", dateTime: "2026-02-18" },
    { id: "fleetUpdate", coverKey: "3", dateTime: "2026-01-24" },
  ];
  return {
    title: t.title,
    description: t.description,
    learnMore: t.learnMore,
    viewAll: t.viewAll,
    viewAllHref: "/recent-news",
    items: rows.map((row) =>
      article(t[row.id], {
        ...row,
        cta: t.learnMore,
        href: `/media-center/news/${row.id}`,
      })
    ),
    links: [],
  };
}

function buildBannerContent(lang) {
  const t = TEXT[lang].magazine;
  return {
    title: t.title,
    description: t.description,
    cta: t.cta,
    ctaHref: "/magazine-view",
    bgUrl: "",
    coverUrl: "",
    spread1Url: "",
    spread2Url: "",
    links: [],
  };
}

function buildContactContent(lang) {
  const t = TEXT[lang].contacts;
  return {
    items: [
      {
        id: "publicRelations",
        icon: "megaphoneSimple",
        title: t.publicRelations.title,
        description: t.publicRelations.description,
        department: "",
        location: "",
        email: "pr@flycham.com",
      },
      {
        id: "mediaTeam",
        icon: "envelopeSimple",
        title: t.mediaTeam.title,
        description: t.mediaTeam.description,
        department: t.mediaTeam.department,
        location: t.mediaTeam.location,
        email: "Marketing@flycham.com",
      },
    ],
    links: [],
  };
}

function buildNewsletterContent(lang) {
  const t = TEXT[lang].newsletter;
  return {
    title: t.title,
    description: t.description,
    label: t.label,
    placeholder: t.placeholder,
    cta: t.cta,
    patternUrl: "",
    links: [],
  };
}

const BLOCKS = {
  [HERO_TYPE]: { style: HERO_STYLE, content: buildHeroContent },
  [INTRO_TYPE]: { style: INTRO_STYLE, content: buildIntroContent },
  [LATEST_TYPE]: { style: LATEST_STYLE, content: buildLatestContent },
  [GRID_TYPE]: { style: GRID_STYLE, content: buildGridContent },
  [BANNER_TYPE]: { style: BANNER_STYLE, content: buildBannerContent },
  [CONTACT_TYPE]: { style: CONTACT_STYLE, content: buildContactContent },
  [NEWSLETTER_TYPE]: { style: NEWSLETTER_STYLE, content: buildNewsletterContent },
};

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
        label: "Media Center",
        description: "News, press releases, and Marhaba magazine",
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

  const existingByType = {};
  for (const link of links) {
    const type = componentTypeOf(link);
    if (!type) continue;
    existingByType[type] = {
      linkId: link.id,
      componentId: link.component_id,
      position: link.position,
    };
  }

  for (let position = 0; position < ORDER.length; position += 1) {
    const type = ORDER[position];
    const existing = existingByType[type];
    if (existing) {
      if (existing.position !== position) {
        const moved = curl("PATCH", "/rest/v1/page_components", {
          token,
          query: `id=eq.${existing.linkId}`,
          prefer: "return=minimal",
          body: { position },
        });
        if (moved?.message) {
          console.error(`page_components move failed (${lang} ${type}):`, restError(moved, "unknown error"));
          process.exit(1);
        }
        curl("PATCH", "/rest/v1/components", {
          token,
          query: `id=eq.${existing.componentId}`,
          prefer: "return=minimal",
          body: { position },
        });
        console.log(`moved ${type} (${lang}) ${existing.position} → ${position}`);
      } else {
        console.log(`kept ${type} (${lang}) at ${position}`);
      }
      continue;
    }

    const block = BLOCKS[type];
    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: {
        type,
        position,
        style: { [lang]: block.style },
        content: { [lang]: block.content(lang) },
      },
    });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) {
      console.error(`components insert failed (${lang} ${type}):`, restError(inserted, "unknown error"));
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
      console.error(`page_components insert failed (${lang} ${type}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${type} block (${lang}):`, comp.id);
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
