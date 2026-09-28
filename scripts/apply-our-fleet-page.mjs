/**
 * One-off admin task for the Our Fleet dynamic page:
 *   1. Ensure page-media-hero, fleet-explore, seat-journey, and media-cards types exist.
 *   2. Ensure the "our-fleet" page row exists.
 *   3. Seed blocks per language (EN + AR), if that language has none:
 *        0 page-media-hero
 *        1 fleet-explore
 *        2 seat-journey (modern convenience)
 *        3 seat-journey (comfort features)
 *        4 media-cards
 *
 * Idempotent: re-running upserts the types/page and only seeds a language's
 * blocks when that language has none.
 *
 *   node scripts/apply-our-fleet-page.mjs
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

const PAGE_SLUG = "our-fleet";
const HERO_TYPE = "page-media-hero";
const EXPLORE_TYPE = "fleet-explore";
const JOURNEY_TYPE = "seat-journey";
const CARDS_TYPE = "media-cards";

const HERO_IMG = "/our-fleet/hero.jpg";
const MODERN_IMG = "/our-fleet/modern-comfort.jpg";
const COMFORT_IMG = "/our-fleet/cabin-features.jpg";
const CARGO_IMG = "/our-fleet/cargo.jpg";
const ENTERTAINMENT_IMG = "/our-fleet/entertainment.jpg";

const AIRCRAFT_IMG = "/our-fleet/aircraft.png";

const FLEET_CARDS = [
  { id: "baa-a320-233", name: "Airbus BAA A320-233", economy: 138, business: 12, totalSeats: 150 },
  { id: "bac-a320-232", name: "Airbus BAC A320-232", economy: 141, business: 12, totalSeats: 153 },
  { id: "bae-a320-231", name: "Airbus BAE A320-231", economy: 144, business: 12, totalSeats: 156 },
  { id: "bag-a320-212", name: "Airbus BAG A320-212", economy: 144, business: 12, totalSeats: 156 },
  { id: "bab-a320-211", name: "Airbus BAB A320-211", economy: 144, business: 12, totalSeats: 156 },
];

const TEXT = {
  en: {
    hero: {
      title: "Our Fleet",
      subtitle: "Innovation and Comfort on Every Flight",
      imageAlt: "Fly Cham Airbus A320 on the runway",
    },
    explore: {
      title: "Explore our fleet",
      paragraphs: [
        "Our fleet has been carefully selected to meet the destinations and services our customers expect. Each aircraft offers the highest levels of comfort, luxury, and safety, ensuring that every journey is unique and seamless. Our fleet consists of modern Airbus A320 aircraft, equipped with the latest technology and advanced safety systems, so passengers can travel with complete confidence, knowing that international safety standards are always upheld.",
        "Looking ahead, Fly Cham plans to expand its fleet by adding more aircraft to serve both domestic and international routes. By continuously enhancing and growing its operations, the airline aims to introduce new destinations, providing travelers with broader choices and exceptional travel experiences.",
      ],
      economyLabel: "Economy",
      businessLabel: "Business",
      totalSeatsLabel: "Total seats",
      imageAlt: "Fly Cham Airbus A320 aircraft",
    },
    modern: {
      title: "Modern convenience and classic comfort",
      description:
        "Our Airbus A320 experience is designed with your peace of mind at heart, whether you're flying for business or exploring the continent. From its modern interior to the rich leather seating and eco-conscious operating systems, the Airbus A320 is an aircraft designed to get you where you're headed. Over and above the anticipated fine dining experience and selection of entertainment and magazines, you will enjoy features designed to make yours a memorable journey no matter the destination.",
      imageAlt: "Fly Cham cabin crew member holding a model aircraft",
    },
    comfort: {
      title: "Features That Redefine Comfort",
      description:
        "Get the edge in luxury and relaxation with our Business Class experience. Seating features include easily adjustable headrests with adaptable ears, ample stowage space, leg rests, and a handy coat hook. The A320 is also a narrow-body aircraft to features six seats in every row, offering more space and comfort. Each Business Class seat is also very spacious and has a PC and tablet holder",
      imageAlt: "Interior cabin of a Fly Cham Airbus A320",
    },
    cards: {
      learnMore: "Learn More",
      cargo: {
        title: "Cargo Service",
        description:
          "We offer fast shipping services to safely transport goods, pets, and perishable items, along with tips and guidance for exporters, shipping companies, and agents",
        imageAlt: "Cargo being loaded onto a Fly Cham aircraft",
      },
      entertainment: {
        title: "In-Flight Entertainment System",
        description:
          "Spend hours of entertainment during your journey with our onboard Entertainment System.",
        imageAlt: "Passenger enjoying in-flight entertainment beside the window",
      },
    },
  },
  ar: {
    hero: {
      title: "أسطولنا",
      subtitle: "الابتكار والراحة في كل رحلة",
      imageAlt: "طائرة إيرباص A320 من فلاي شام على المدرج",
    },
    explore: {
      title: "استكشف أسطولنا",
      paragraphs: [
        "تم اختيار أسطولنا بعناية ليلبّي الوجهات والخدمات التي يتوقعها عملاؤنا. تقدّم كل طائرة أعلى مستويات الراحة والفخامة والأمان، بما يضمن أن تكون كل رحلة فريدة وسلسة. يتألف أسطولنا من طائرات إيرباص A320 الحديثة، المجهّزة بأحدث التقنيات وأنظمة السلامة المتقدمة، ليتمكّن المسافرون من السفر بثقة تامة مع العلم أن معايير السلامة الدولية مطبّقة دائماً.",
        "وتطلّعاً إلى المستقبل، تخطّط فلاي شام لتوسيع أسطولها بإضافة المزيد من الطائرات لخدمة الرحلات الداخلية والدولية. ومن خلال التطوير المستمر لعملياتها ونموّها، تهدف الشركة إلى إضافة وجهات جديدة، بما يوفّر للمسافرين خيارات أوسع وتجارب سفر استثنائية.",
      ],
      economyLabel: "الدرجة السياحية",
      businessLabel: "درجة رجال الأعمال",
      totalSeatsLabel: "إجمالي المقاعد",
      imageAlt: "طائرة إيرباص A320 من فلاي شام",
    },
    modern: {
      title: "راحة عصرية وأناقة كلاسيكية",
      description:
        "صُمّمت تجربة إيرباص A320 لدينا مع وضع راحة بالك في المقام الأول، سواء كنت مسافراً في رحلة عمل أو لاستكشاف القارة. من مقصورتها العصرية إلى مقاعدها الجلدية الفاخرة وأنظمة التشغيل الصديقة للبيئة، صُمّمت طائرة إيرباص A320 لتوصلك إلى وجهتك. وإلى جانب تجربة الطعام الفاخر وباقة من وسائل الترفيه والمجلات، ستستمتع بمزايا صُمّمت لتجعل رحلتك تجربة لا تُنسى مهما كانت وجهتك.",
      imageAlt: "أحد أفراد طاقم فلاي شام يحمل نموذجاً لطائرة",
    },
    comfort: {
      title: "مزايا تعيد تعريف الراحة",
      description:
        "احصل على أرقى درجات الفخامة والاسترخاء مع تجربة درجة رجال الأعمال لدينا. تشمل مزايا المقاعد مساند رأس قابلة للتعديل بسهولة مع دعامات جانبية، ومساحة تخزين واسعة، ومساند للأرجل، وعلّاقة عملية للمعاطف. كما أن طائرة A320 ذات بدن ضيّق بستة مقاعد في كل صف، ما يوفّر مساحة وراحة أكبر. ويتميّز كل مقعد في درجة رجال الأعمال باتساعه وبوجود حامل للحاسوب والجهاز اللوحي.",
      imageAlt: "المقصورة الداخلية لطائرة إيرباص A320 من فلاي شام",
    },
    cards: {
      learnMore: "اعرف المزيد",
      cargo: {
        title: "خدمة الشحن",
        description:
          "نوفّر خدمات شحن سريعة لنقل البضائع والحيوانات الأليفة والمواد القابلة للتلف بأمان، مع نصائح وإرشادات للمصدّرين وشركات الشحن والوكلاء",
        imageAlt: "تحميل الشحن على متن طائرة فلاي شام",
      },
      entertainment: {
        title: "نظام الترفيه على متن الطائرة",
        description: "اقضِ ساعات من الترفيه خلال رحلتك مع نظام الترفيه المتوفّر على متن طائراتنا.",
        imageAlt: "مسافرة تستمتع بالترفيه على متن الطائرة بجانب النافذة",
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

const HERO_STYLE = {
  layout: "cover",
  sectionBg: "100",
  height: "default",
  contentWidth: "default",
  objectPosition: "center 40%",
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

const EXPLORE_STYLE = {
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  showCards: true,
  showCardImage: true,
  showCardArrow: true,
  columns: "3",
  cardGap: "default",
  titleColor: "800",
  titleFontWeight: "semibold",
  titleColorHover: "800",
  titleFontWeightHover: "semibold",
  bodyColor: "700",
  bodyFontWeight: "normal",
  bodyColorHover: "700",
  bodyFontWeightHover: "normal",
  cardBg: "background",
  cardBorderColor: "200",
  cardNameColor: "primary-1",
  cardNameFontWeight: "bold",
  cardNameColorHover: "primary-1",
  cardNameFontWeightHover: "bold",
  cardMetaColor: "700",
  cardMetaFontWeight: "normal",
  cardMetaColorHover: "700",
  cardMetaFontWeightHover: "normal",
  cardTotalColor: "800",
  cardTotalFontWeight: "semibold",
  cardTotalColorHover: "800",
  cardTotalFontWeightHover: "semibold",
  arrowBg: "primary-1",
  arrowColor: "50",
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
  bodyColor: "700",
  bodyFontWeight: "normal",
  bodyColorHover: "700",
  bodyFontWeightHover: "normal",
  ...BACKLINKS,
};

const MODERN_STYLE = { ...JOURNEY_BASE_STYLE, imageSide: "right" };
const COMFORT_STYLE = { ...JOURNEY_BASE_STYLE, imageSide: "left" };

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

function buildExploreContent(lang) {
  const t = TEXT[lang].explore;
  return {
    title: t.title,
    items: t.paragraphs.map((body, index) => ({
      id: `p${index + 1}`,
      body,
    })),
    economyLabel: t.economyLabel,
    businessLabel: t.businessLabel,
    totalSeatsLabel: t.totalSeatsLabel,
    cards: FLEET_CARDS.map((card) => ({
      ...card,
      imageUrl: AIRCRAFT_IMG,
      imageAlt: t.imageAlt,
      href: "#",
    })),
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

function buildCardsContent(lang) {
  const t = TEXT[lang].cards;
  return {
    learnMore: t.learnMore,
    items: [
      {
        id: "cargo",
        imageUrl: CARGO_IMG,
        imageAlt: t.cargo.imageAlt,
        coverKey: "cargo",
        title: t.cargo.title,
        description: t.cargo.description,
        cta: t.learnMore,
        href: "#",
      },
      {
        id: "entertainment",
        imageUrl: ENTERTAINMENT_IMG,
        imageAlt: t.entertainment.imageAlt,
        coverKey: "entertainment",
        title: t.entertainment.title,
        description: t.entertainment.description,
        cta: t.learnMore,
        href: "/travel-experience/onboard",
      },
    ],
    links: [],
  };
}

const BLOCKS = [
  { type: HERO_TYPE, style: HERO_STYLE, content: buildHeroContent },
  { type: EXPLORE_TYPE, style: EXPLORE_STYLE, content: buildExploreContent },
  {
    type: JOURNEY_TYPE,
    style: MODERN_STYLE,
    content: (lang) => buildJourneyContent(TEXT[lang].modern, MODERN_IMG),
  },
  {
    type: JOURNEY_TYPE,
    style: COMFORT_STYLE,
    content: (lang) => buildJourneyContent(TEXT[lang].comfort, COMFORT_IMG),
  },
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
  { id: HERO_TYPE, label: "Page Media Hero" },
  { id: EXPLORE_TYPE, label: "Fleet Explore" },
  { id: JOURNEY_TYPE, label: "Seat Journey" },
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
        label: "Our Fleet",
        description: "Fly Cham fleet — explore, cabin features, cargo and entertainment",
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
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type,content,style)`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }

  if (links.length) {
    console.log(`page already has ${links.length} ${lang} block(s) — patching fleet-explore if present.`);
    for (const row of links) {
      const component = Array.isArray(row.components) ? row.components[0] : row.components;
      if (!component?.id || component.type !== EXPLORE_TYPE) continue;

      const existingContent =
        component.content && typeof component.content === "object"
          ? component.content
          : {};
      const existingStyle =
        component.style && typeof component.style === "object"
          ? component.style
          : {};
      const nextContent = {
        ...existingContent,
        [lang]: buildExploreContent(lang),
      };
      const nextStyle = {
        ...existingStyle,
        [lang]: { ...(existingStyle[lang] || {}), ...EXPLORE_STYLE },
      };
      const patched = curl("PATCH", `/rest/v1/components?id=eq.${component.id}`, {
        token,
        prefer: "return=minimal",
        body: { content: nextContent, style: nextStyle },
      });
      if (patched?.message) {
        console.error(
          `fleet-explore patch failed (${lang}):`,
          restError(patched, "unknown error")
        );
        process.exit(1);
      }
      console.log(`patched fleet-explore (${lang}):`, component.id);
    }
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
