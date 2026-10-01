/**
 * One-off admin task for the Before You Fly dynamic page:
 *   1. Register the "before-you-fly-services" and "journey-stage-next-steps"
 *      component types (FK for components.type). page-media-hero is already live.
 *   2. Ensure the "before-you-fly" page row exists.
 *   3. Seed the three blocks that make up the static page (hero, services,
 *      next-steps) per language (EN + AR), if that language has no blocks yet.
 *
 * Idempotent: re-running upserts the types/page and only seeds a language's
 * blocks when that language has none. Run once against the CMS Supabase project.
 *
 *   node scripts/apply-before-you-fly-page.mjs
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

const PAGE_SLUG = "before-you-fly";
const SERVICES_TYPE = "before-you-fly-services";
const NEXT_STEPS_TYPE = "journey-stage-next-steps";
const HERO_TYPE = "page-media-hero";

const SERVICES_META = [
  { id: "seatSelection", href: "/help" },
  { id: "manageBooking", href: "/help" },
  { id: "allowedBaggage", href: "/help" },
  { id: "paymentMethods", href: "/travel-experience/before-you-fly/payment-methods" },
  { id: "yaMarhaba", href: "/travel-experience/before-you-fly/transportation-service" },
  { id: "limousine", href: "/travel-experience/before-you-fly/limousine-service" },
  { id: "unaccompaniedMinor", href: "/help" },
  { id: "oxygenCylinder", href: "/help" },
  { id: "prohibitedItems", href: "/help" },
];

const NEXT_STEPS_META = [
  { id: "airportServices", icon: "airplaneTakeoff", href: "/travel-experience/at-the-airport" },
  { id: "getSupport", icon: "headset", href: "/help" },
];

const TEXT = {
  en: {
    hero: {
      title: "Before You Fly",
      subtitle:
        "Plan ahead with our services designed to help you prepare before departure and enjoy a smoother journey from the start.",
      imageAlt: "A business traveller using a tablet in the back of a car",
    },
    services: {
      learnMore: "Discover More",
      items: {
        seatSelection: {
          title: "Seat Selection",
          description: "Choose your preferred seat before departure for a more comfortable journey.",
          imageAlt: "Fly Cham aircraft cabin seats",
        },
        manageBooking: {
          title: "Manage Booking",
          description:
            "Manage your booking and access available changes and services for flights booked via our website.",
          imageAlt: "Traveller with luggage at the airport",
        },
        allowedBaggage: {
          title: "Allowed Baggage",
          description:
            "Find baggage allowance information for different classes and fare types before packing for your flight.",
          imageAlt: "Checked baggage at the airport",
        },
        paymentMethods: {
          title: "Payment Methods",
          description: "Find available payment options for completing and managing your Fly Cham booking.",
          imageAlt: "Traveller with luggage at the airport",
        },
        yaMarhaba: {
          title: "Transportation",
          description: "Arrange convenient transportation to or from the airport before your journey.",
          imageAlt: "Ya Marhaba airport transfer service",
        },
        limousine: {
          title: "Limousine Service",
          description: "Request premium airport transfers available for eligible Business Class passengers.",
          imageAlt: "Luxury limousine airport transfer",
        },
        unaccompaniedMinor: {
          title: "Unaccompanied Minors",
          description: "Request unaccompanied minors service for children travelling alone aged 6 to 12.",
          imageAlt: "A child travelling on board",
        },
        oxygenCylinder: {
          title: "Oxygen Cylinder",
          description:
            "Find requirements for requesting a medical oxygen cylinder for passengers who need medical oxygen while travelling.",
          imageAlt: "Medical oxygen equipment for travel",
        },
        prohibitedItems: {
          title: "Prohibited Items",
          description: "Check baggage restrictions before travel to avoid carrying items that are not permitted.",
          imageAlt: "Airport security screening of baggage",
        },
      },
    },
    nextSteps: {
      airportServices: {
        title: "Explore Airport Services",
        description:
          "Explore available airport services and support options designed to make your journey more comfortable from arrival to boarding.",
        cta: "Learn more",
      },
      getSupport: {
        title: "Get Support",
        description:
          "Access helpful information, contact us, browse frequently asked questions, or submit and track a request through our Help Centre.",
        cta: "Learn more",
      },
    },
  },
  ar: {
    hero: {
      title: "قبل السفر",
      subtitle:
        "خطّط مسبقاً مع خدماتنا المصمّمة لمساعدتك على الاستعداد قبل المغادرة والاستمتاع برحلة أكثر سلاسة من البداية.",
      imageAlt: "مسافر أعمال يستخدم جهازاً لوحياً في المقعد الخلفي للسيارة",
    },
    services: {
      learnMore: "اكتشف المزيد",
      items: {
        seatSelection: {
          title: "اختيار المقعد",
          description: "اختر مقعدك المفضّل قبل المغادرة لرحلة أكثر راحة.",
          imageAlt: "مقاعد مقصورة طائرة فلاي شام",
        },
        manageBooking: {
          title: "إدارة الحجز",
          description: "أدر حجزك واطّلع على التغييرات والخدمات المتاحة للرحلات المحجوزة عبر موقعنا.",
          imageAlt: "مسافر مع أمتعته في المطار",
        },
        allowedBaggage: {
          title: "الأمتعة المسموح بها",
          description:
            "اطّلع على معلومات وزن الأمتعة المسموح به لمختلف الدرجات وأنواع التذاكر قبل تجهيز حقائبك.",
          imageAlt: "أمتعة مسجّلة في المطار",
        },
        paymentMethods: {
          title: "طرق الدفع",
          description: "اطّلع على خيارات الدفع المتاحة لإتمام حجزك في فلاي شام وإدارته.",
          imageAlt: "مسافر مع أمتعته في المطار",
        },
        yaMarhaba: {
          title: "النقل",
          description: "رتّب وسيلة نقل مريحة من وإلى المطار قبل رحلتك.",
          imageAlt: "خدمة يا مرحبا للنقل من وإلى المطار",
        },
        limousine: {
          title: "خدمة الليموزين",
          description:
            "اطلب خدمة النقل المميّزة من وإلى المطار المتاحة لركاب درجة رجال الأعمال المؤهّلين.",
          imageAlt: "سيارة ليموزين فاخرة للنقل من المطار",
        },
        unaccompaniedMinor: {
          title: "الأطفال غير المصحوبين",
          description:
            "اطلب خدمة الأطفال غير المصحوبين للأطفال المسافرين بمفردهم من عمر 6 إلى 12 عاماً.",
          imageAlt: "طفل مسافر على متن الطائرة",
        },
        oxygenCylinder: {
          title: "أسطوانة الأكسجين",
          description:
            "اطّلع على متطلبات طلب أسطوانة أكسجين طبي للركاب الذين يحتاجون الأكسجين الطبي أثناء السفر.",
          imageAlt: "معدات أكسجين طبي للسفر",
        },
        prohibitedItems: {
          title: "المواد الممنوعة",
          description: "تحقّق من قيود الأمتعة قبل السفر لتجنّب حمل مواد غير مسموح بها.",
          imageAlt: "فحص أمني للأمتعة في المطار",
        },
      },
    },
    nextSteps: {
      airportServices: {
        title: "استكشف خدمات المطار",
        description:
          "استكشف خدمات المطار المتاحة وخيارات الدعم المصمّمة لجعل رحلتك أكثر راحة من الوصول حتى الصعود.",
        cta: "اعرف المزيد",
      },
      getSupport: {
        title: "احصل على الدعم",
        description:
          "اطّلع على معلومات مفيدة، تواصل معنا، تصفّح الأسئلة الشائعة، أو أرسل طلباً وتابعه من خلال مركز المساعدة.",
        cta: "اعرف المزيد",
      },
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

function buildServicesContent(lang) {
  const text = TEXT[lang].services;
  return {
    title: "",
    subtitle: "",
    learnMore: text.learnMore,
    items: SERVICES_META.map((row) => ({
      id: row.id,
      imageUrl: "",
      imageAlt: text.items[row.id].imageAlt,
      title: text.items[row.id].title,
      description: text.items[row.id].description,
      href: row.href,
      cta: "",
    })),
    links: [],
  };
}

function buildNextStepsContent(lang) {
  const text = TEXT[lang].nextSteps;
  return {
    items: NEXT_STEPS_META.map((row) => ({
      id: row.id,
      icon: row.icon,
      title: text[row.id].title,
      description: text[row.id].description,
      href: row.href,
      cta: text[row.id].cta,
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

const SERVICES_STYLE = {
  showHeader: true,
  showTitle: true,
  showSubtitle: true,
  imageRadius: "2xl",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  subtitleColor: "700",
  subtitleFontWeight: "normal",
  subtitleColorHover: "700",
  subtitleFontWeightHover: "normal",
  cardTitleColor: "700",
  cardTitleFontWeight: "semibold",
  cardTitleColorHover: "700",
  cardTitleFontWeightHover: "semibold",
  cardDescriptionColor: "900",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "900",
  cardDescriptionFontWeightHover: "normal",
  learnMoreColor: "primary-1",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "primary-1",
  learnMoreFontWeightHover: "semibold",
  dividerColor: "200",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  showLinks: true,
};

const NEXT_STEPS_STYLE = {
  columns: "2",
  cardGap: "default",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  cardBg: "background",
  cardBorderColor: "200",
  iconColor: "700",
  cardTitleColor: "700",
  cardTitleFontWeight: "semibold",
  cardTitleColorHover: "700",
  cardTitleFontWeightHover: "semibold",
  cardDescriptionColor: "800",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "800",
  cardDescriptionFontWeightHover: "normal",
  learnMoreColor: "primary-1",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "primary-1",
  learnMoreFontWeightHover: "semibold",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  showLinks: true,
};

const BLOCKS = [
  { type: HERO_TYPE, style: HERO_STYLE, content: buildHeroContent },
  { type: SERVICES_TYPE, style: SERVICES_STYLE, content: buildServicesContent },
  { type: NEXT_STEPS_TYPE, style: NEXT_STEPS_STYLE, content: buildNextStepsContent },
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
  { id: SERVICES_TYPE, label: "Before You Fly Services" },
  { id: NEXT_STEPS_TYPE, label: "Journey Stage Next Steps" },
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
        label: "Before You Fly",
        description: "Pre-flight services and next steps",
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
