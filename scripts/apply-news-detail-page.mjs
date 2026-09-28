/**
 * One-off admin task for the News Detail (fleetUpdate) dynamic page:
 *   1. Register news-detail-* component types (+ ensure breadcrumbs /
 *      media-newsletter-signup exist).
 *   2. Ensure the "news-fleet-update" page row exists.
 *   3. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs
 *        1 news-detail-header
 *        2 news-detail-paragraphs (intro)
 *        3 news-detail-gallery
 *        4 news-detail-paragraphs (after gallery)
 *        5 news-detail-figure
 *        6 media-newsletter-signup
 *
 * Frontend URL: /media-center/news/new-fleetUpdate
 * CMS slug:     news-fleet-update
 *
 *   node scripts/apply-news-detail-page.mjs
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

const PAGE_SLUG = "news-fleet-update";

const CRUMBS = "breadcrumbs";
const HEADER = "news-detail-header";
const PARAS = "news-detail-paragraphs";
const GALLERY = "news-detail-gallery";
const FIGURE = "news-detail-figure";
const NEWSLETTER = "media-newsletter-signup";

const ORDER = [CRUMBS, HEADER, PARAS, GALLERY, PARAS, FIGURE, NEWSLETTER];

const COMPONENT_TYPES = [
  { id: CRUMBS, label: "Breadcrumbs" },
  { id: HEADER, label: "News Detail Header" },
  { id: PARAS, label: "News Detail Paragraphs" },
  { id: GALLERY, label: "News Detail Gallery" },
  { id: FIGURE, label: "News Detail Figure" },
  { id: NEWSLETTER, label: "Media Newsletter Signup" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-800",
  linkFontWeight: "medium",
  linkUnderline: true,
  linkItalic: false,
};

const TEXT = {
  en: {
    crumbs: {
      items: [
        { label: "Home", href: "/" },
        { label: "Media Center", href: "/new-media-center" },
        { label: "Recent News", href: "/new-recent-news" },
        { label: "Fly Cham Welcomes New Aircraft to Its Fleet", href: "" },
      ],
      separator: "/",
      ariaLabel: "Breadcrumb",
    },
    header: {
      imageUrl: "",
      imageAlt: "Istanbul cityscape with historic architecture",
      date: "24 JAN 2026",
      dateTime: "2026-01-24",
      category: "Company",
      title: "Fly Cham Welcomes New Aircraft to Its Fleet",
      links: [],
    },
    intro: {
      paragraphs: [
        {
          id: "p-1",
          bold: "Fly Cham has welcomed new aircraft",
          text: " to its fleet as part of a broader plan to enhance operational efficiency and improve the onboard experience for passengers.",
        },
        {
          id: "p-2",
          bold: "The investment supports network growth",
          text: " while maintaining the airline's focus on safety, reliability, and service quality across every stage of the journey.",
        },
      ],
      links: [],
    },
    gallery: {
      altPrefix: "Fleet update gallery photo",
      prevLabel: "Previous photo",
      nextLabel: "Next photo",
      items: [
        { id: "gallery-1", imageUrl: "" },
        { id: "gallery-2", imageUrl: "" },
        { id: "gallery-3", imageUrl: "" },
      ],
    },
    after: {
      paragraphs: [
        {
          id: "p-3",
          bold: "",
          text: "The new additions will enter service on select regional routes, offering updated cabin interiors and improved comfort for both business and leisure travelers.",
        },
      ],
      links: [],
    },
    figure: {
      imageUrl: "",
      imageAlt: "Damascus city view",
      videoUrl: "",
      posterUrl: "",
      links: [],
    },
    newsletter: {
      title: "Stay Connected",
      description:
        "Subscribe to our newsletter to receive our latest news, activities, and Marhaba magazine updates.",
      label: "Email address",
      placeholder: "Enter email address",
      cta: "Subscribe",
      patternUrl: "",
      links: [],
    },
  },
  ar: {
    crumbs: {
      items: [
        { label: "الرئيسية", href: "/" },
        { label: "المركز الإعلامي", href: "/new-media-center" },
        { label: "الأخبار الأخيرة", href: "/new-recent-news" },
        { label: "فلاي شام تستقبل طائرات جديدة في أسطولها", href: "" },
      ],
      separator: "/",
      ariaLabel: "مسار التنقل",
    },
    header: {
      imageUrl: "",
      imageAlt: "منظر إسطنبول مع معالم تاريخية",
      date: "24 يناير 2026",
      dateTime: "2026-01-24",
      category: "الشركة",
      title: "فلاي شام تستقبل طائرات جديدة في أسطولها",
      links: [],
    },
    intro: {
      paragraphs: [
        {
          id: "p-1",
          bold: "استقبلت فلاي شام طائرات جديدة",
          text: " في أسطولها ضمن خطة أوسع لتعزيز الكفاءة التشغيلية وتحسين تجربة السفر على متن الطائرة.",
        },
        {
          id: "p-2",
          bold: "يدعم هذا الاستثمار نمو الشبكة",
          text: " مع الحفاظ على تركيز الشركة على السلامة والموثوقية وجودة الخدمة في كل مرحلة من الرحلة.",
        },
      ],
      links: [],
    },
    gallery: {
      altPrefix: "صورة معرض تحديث الأسطول",
      prevLabel: "الصورة السابقة",
      nextLabel: "الصورة التالية",
      items: [
        { id: "gallery-1", imageUrl: "" },
        { id: "gallery-2", imageUrl: "" },
        { id: "gallery-3", imageUrl: "" },
      ],
    },
    after: {
      paragraphs: [
        {
          id: "p-3",
          bold: "",
          text: "ستدخل الطائرات الجديدة الخدمة على عدد من الوجهات الإقليمية، مع مقصورات محدّثة وراحة أكبر للمسافرين.",
        },
      ],
      links: [],
    },
    figure: {
      imageUrl: "",
      imageAlt: "منظر مدينة دمشق",
      videoUrl: "",
      posterUrl: "",
      links: [],
    },
    newsletter: {
      title: "ابقَ على تواصل",
      description:
        "اشترك في نشرتنا الإخبارية لتصلك أحدث الأخبار والأنشطة وتحديثات مجلة مرحبا.",
      label: "عنوان البريد الإلكتروني",
      placeholder: "أدخل عنوان البريد الإلكتروني",
      cta: "اشترك",
      patternUrl: "",
      links: [],
    },
  },
};

const CRUMBS_STYLE = {
  sectionPadding: "none",
  showSectionBg: false,
  sectionBg: "100",
  crumbColor: "600",
  crumbFontWeight: "medium",
  crumbColorHover: "primary-1",
  crumbFontWeightHover: "medium",
  currentColor: "800",
  currentFontWeight: "semibold",
  currentColorHover: "800",
  currentFontWeightHover: "semibold",
  focusColor: "primary-1",
  focusFontWeight: "medium",
  focusColorHover: "primary-1",
  focusFontWeightHover: "medium",
  separatorColor: "400",
  crumbUnderline: false,
  ...BACKLINKS,
};

const HEADER_STYLE = {
  sectionPadding: "tight",
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
  iconColor: "600",
  ...BACKLINKS,
};

const PARAS_STYLE = {
  sectionPadding: "tight",
  showSectionBg: false,
  sectionBg: "100",
  bodyColor: "700",
  bodyFontWeight: "normal",
  bodyColorHover: "700",
  bodyFontWeightHover: "normal",
  boldColor: "800",
  boldFontWeight: "semibold",
  boldColorHover: "800",
  boldFontWeightHover: "semibold",
  ...BACKLINKS,
};

const GALLERY_STYLE = {
  sectionPadding: "tight",
  showSectionBg: false,
  sectionBg: "100",
  imageRadius: "2xl",
  progressTrack: "200",
  progressFill: "primary-1",
  prevBg: "primary-100",
  prevIcon: "50",
  nextBg: "primary-1",
  nextIcon: "50",
  ...BACKLINKS,
};

const FIGURE_STYLE = {
  sectionPadding: "tight",
  showSectionBg: false,
  sectionBg: "100",
  imageRadius: "xl",
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

function buildBlocks(lang) {
  const t = TEXT[lang];
  return [
    { type: CRUMBS, style: CRUMBS_STYLE, content: t.crumbs },
    { type: HEADER, style: HEADER_STYLE, content: t.header },
    { type: PARAS, style: PARAS_STYLE, content: t.intro },
    { type: GALLERY, style: GALLERY_STYLE, content: t.gallery },
    { type: PARAS, style: PARAS_STYLE, content: t.after },
    { type: FIGURE, style: FIGURE_STYLE, content: t.figure },
    { type: NEWSLETTER, style: NEWSLETTER_STYLE, content: t.newsletter },
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
        label: "News — Fleet Update",
        description: "Fly Cham welcomes new aircraft to its fleet",
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
      body: {
        page_id: pageId,
        component_id: comp.id,
        position,
        lang,
      },
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

console.log("Done. Open /en/media-center/news/new-fleetUpdate");
