/**
 * One-off admin task for the About Us dynamic page:
 *   1. Ensure page-media-hero, seat-journey, promo-banner, and faqs types exist.
 *   2. Ensure the "about-us" page row exists.
 *   3. Seed blocks per language (EN + AR), if that language has none:
 *        0 page-media-hero
 *        1 seat-journey (intro)
 *        2 seat-journey (mission)
 *        3 seat-journey (vision)
 *        4 promo-banner (fleet)
 *        5 faqs
 *
 * Idempotent: re-running upserts the types/page and only seeds a language's
 * blocks when that language has none.
 *
 *   node scripts/apply-about-us-page.mjs
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

const PAGE_SLUG = "about-us";
const HERO_TYPE = "page-media-hero";
const JOURNEY_TYPE = "seat-journey";
const PROMO_TYPE = "promo-banner";
const FAQS_TYPE = "faqs";

const HERO_IMG = "/about-us/hero.jpg";
const MISSION_IMG = "/about-us/mission.jpg";
const VISION_IMG = "/about-us/vision.jpg";
const FLEET_IMG = "/about-us/fleet.jpg";

const TEXT = {
  en: {
    hero: {
      title: "About Fly Cham",
      subtitle:
        "We are proud of our services and our team that always strives to meet passengers' satisfaction.",
      imageAlt: "Fly Cham aircraft wing above the clouds",
    },
    intro: {
      description:
        "Fly Cham is a Syrian airline dedicated to connecting Syria with the world through safe, comfortable, and reliable air travel. We are proud of our services and our team that always strives to meet passengers' satisfaction.",
      imageAlt: "Fly Cham aircraft wing above the clouds",
    },
    mission: {
      title: "Our Mission",
      description:
        "Our mission is to deliver integrated aviation services for both passengers and cargo of the highest quality, in line with international standards. Guided by authentic Syrian hospitality, we provide travelers with safe and comfortable journeys. We strive to reconnect Syrians with their loved ones worldwide, support Syria's reconstruction and economic growth, and promote cultural exchange by expanding travel destinations through strong strategic partnerships.",
      imageAlt: "Fly Cham aircraft at sunset",
    },
    vision: {
      title: "Our Vision",
      description:
        "To be the leading and preferred airline in Syria and the region, offering a distinguished travel experience that connects Syria to the world, blending professionalism with authentic Syrian hospitality, and built on operational excellence and strategic partnerships.",
      imageAlt: "Fly Cham cabin crew beside an aircraft",
    },
    fleet: {
      title: "Our Fleet",
      description:
        "Fly Cham's modern Airbus A320 fleet delivers comfort, luxury, and safety on every journey. Meeting the highest international standards, each flight ensures confidence and peace of mind. As the fleet expands, Fly Cham offers more destinations and exceptional travel experiences.",
      cta: "Discover more",
      imageAlt: "Interior cabin of a Fly Cham aircraft",
    },
    faq: {
      title: "Frequently Asked Questions",
      browse: "Browse FAQs",
      answer:
        "Our support team is happy to help — please browse our FAQs or contact us for more details.",
      items: [
        "Can I change my seat after booking?",
        "Are seats free or paid?",
        "Is seat selection available for infant booking?",
        "Is in-flight entertainment available for children?",
      ],
    },
  },
  ar: {
    hero: {
      title: "عن فلاي شام",
      subtitle: "نفخر بخدماتنا وبفريقنا الذي يسعى دائماً لتحقيق رضا المسافرين.",
      imageAlt: "جناح طائرة فلاي شام فوق الغيوم",
    },
    intro: {
      description:
        "فلاي شام هي شركة طيران سورية تكرّس جهودها لربط سوريا بالعالم عبر سفر جوي آمن ومريح وموثوق. نفخر بخدماتنا وبفريقنا الذي يسعى دائماً لتحقيق رضا المسافرين.",
      imageAlt: "جناح طائرة فلاي شام فوق الغيوم",
    },
    mission: {
      title: "مهمتنا",
      description:
        "مهمتنا هي تقديم خدمات طيران متكاملة للمسافرين والشحن بأعلى جودة وبما يتوافق مع المعايير الدولية. ومستلهمين من الضيافة السورية الأصيلة، نوفّر للمسافرين رحلات آمنة ومريحة. نسعى لإعادة وصل السوريين بأحبّائهم حول العالم، ودعم إعادة إعمار سوريا ونموّها الاقتصادي، وتعزيز التبادل الثقافي عبر توسيع وجهات السفر من خلال شراكات استراتيجية قوية.",
      imageAlt: "طائرة فلاي شام عند الغروب",
    },
    vision: {
      title: "رؤيتنا",
      description:
        "أن نكون شركة الطيران الرائدة والمفضّلة في سوريا والمنطقة، ونقدّم تجربة سفر مميّزة تربط سوريا بالعالم، تجمع بين الاحترافية والضيافة السورية الأصيلة، وتُبنى على التميّز التشغيلي والشراكات الاستراتيجية.",
      imageAlt: "طاقم ضيافة فلاي شام بجانب الطائرة",
    },
    fleet: {
      title: "أسطولنا",
      description:
        "يوفّر أسطول فلاي شام الحديث من طائرات إيرباص A320 الراحة والفخامة والأمان في كل رحلة. وبما يلبّي أعلى المعايير الدولية، تضمن كل رحلة الثقة وراحة البال. ومع توسّع الأسطول، تقدّم فلاي شام المزيد من الوجهات وتجارب سفر استثنائية.",
      cta: "اكتشف المزيد",
      imageAlt: "المقصورة الداخلية لطائرة فلاي شام",
    },
    faq: {
      title: "الأسئلة الشائعة",
      browse: "تصفّح الأسئلة الشائعة",
      answer:
        "يسعد فريق الدعم لدينا بمساعدتك — يرجى تصفّح الأسئلة الشائعة أو التواصل معنا لمزيد من التفاصيل.",
      items: [
        "هل يمكنني تغيير مقعدي بعد الحجز؟",
        "هل المقاعد مجانية أم مدفوعة؟",
        "هل خدمة اختيار المقعد متاحة لحجز الرضّع؟",
        "هل يتوفّر ترفيه على متن الطائرة للأطفال؟",
      ],
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
  objectPosition: "center 50%",
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

const JOURNEY_BASE_STYLE = {
  imageRadius: "2xl",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  titleColor: "800",
  titleFontWeight: "semibold",
  titleColorHover: "800",
  titleFontWeightHover: "semibold",
  bodyColor: "800",
  bodyFontWeight: "normal",
  bodyColorHover: "800",
  bodyFontWeightHover: "normal",
  ...BACKLINKS,
};

const INTRO_STYLE = { ...JOURNEY_BASE_STYLE, imageSide: "right" };
const MISSION_STYLE = { ...JOURNEY_BASE_STYLE, imageSide: "left" };
const VISION_STYLE = { ...JOURNEY_BASE_STYLE, imageSide: "right" };

const PROMO_STYLE = {
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: false,
  showOverlay: true,
  sectionBg: "100",
  sectionPadding: "none",
  bannerHeight: "tall",
  bannerRadius: "lg",
  overlayColor: "#0B2A4A",
  titleColor: "50",
  titleFontWeight: "semibold",
  titleColorHover: "50",
  titleFontWeightHover: "semibold",
  descriptionColor: "50",
  descriptionFontWeight: "normal",
  descriptionColorHover: "50",
  descriptionFontWeightHover: "normal",
  buttonBg: "secondary",
  buttonText: "btn",
  buttonTextFontWeight: "medium",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "medium",
  ...BACKLINKS,
};

const FAQS_STYLE = {
  showTitle: true,
  showBrowse: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  itemGap: "default",
  titleAlign: "left",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  itemBg: "background",
  itemBorderColor: "200",
  itemRadius: "lg",
  questionColor: "700",
  questionFontWeight: "medium",
  questionColorHover: "700",
  questionFontWeightHover: "medium",
  answerColor: "600",
  answerFontWeight: "normal",
  answerColorHover: "600",
  answerFontWeightHover: "normal",
  iconColor: "700",
  browseBg: "secondary",
  browseHoverBg: "secondary-800",
  browseText: "btn",
  browseTextFontWeight: "semibold",
  browseTextHover: "btn",
  browseTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

function buildHeroContent(lang) {
  const t = TEXT[lang].hero;
  return {
    title: t.title,
    subtitle: t.subtitle,
    imageUrl: HERO_IMG,
    imageAlt: t.imageAlt,
    links: [],
  };
}

function buildJourneyContent(row, imageUrl) {
  return {
    title: row.title || "",
    description: row.description || "",
    imageUrl,
    imageAlt: row.imageAlt || "",
    links: [],
  };
}

function buildPromoContent(lang) {
  const t = TEXT[lang].fleet;
  return {
    title: t.title,
    description: t.description,
    buttonLabel: t.cta,
    buttonHref: "/our-fleet",
    buttonLinkType: "internal",
    imageUrl: FLEET_IMG,
    imageAlt: t.imageAlt,
    ctaButton: { content: t.cta, href: "/our-fleet" },
    image: { fileUrl: FLEET_IMG, alt: t.imageAlt },
    links: [],
  };
}

function buildFaqsContent(lang) {
  const t = TEXT[lang].faq;
  return {
    title: t.title,
    browseLabel: t.browse,
    browseHref: "/help/faqs",
    browseButton: { content: t.browse, href: "/help/faqs" },
    items: t.items.map((question) => ({ question, answer: t.answer })),
    links: [],
  };
}

const BLOCKS = [
  { type: HERO_TYPE, style: HERO_STYLE, content: buildHeroContent },
  {
    type: JOURNEY_TYPE,
    style: INTRO_STYLE,
    content: (lang) => buildJourneyContent(TEXT[lang].intro, HERO_IMG),
  },
  {
    type: JOURNEY_TYPE,
    style: MISSION_STYLE,
    content: (lang) => buildJourneyContent(TEXT[lang].mission, MISSION_IMG),
  },
  {
    type: JOURNEY_TYPE,
    style: VISION_STYLE,
    content: (lang) => buildJourneyContent(TEXT[lang].vision, VISION_IMG),
  },
  { type: PROMO_TYPE, style: PROMO_STYLE, content: buildPromoContent },
  { type: FAQS_TYPE, style: FAQS_STYLE, content: buildFaqsContent },
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
  { id: HERO_TYPE, label: "Page Media Hero" },
  { id: JOURNEY_TYPE, label: "Seat Journey" },
  { id: PROMO_TYPE, label: "Promo Banner" },
  { id: FAQS_TYPE, label: "FAQs" },
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
        label: "About Us",
        description: "About Fly Cham — mission, vision, fleet, and FAQs",
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
