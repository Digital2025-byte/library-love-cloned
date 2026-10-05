/**
 * One-off admin task for the Baggage Calculator dynamic page
 * (Figma 40814:21591 desktop / 40814:22088 mobile):
 *   1. Register the baggage-calculator + title-with-list types (+ reused ones).
 *   2. Upload the Figma photos to cms-media/baggage-calculator/*.webp.
 *   3. Ensure the "baggage-calculator" page row exists.
 *   4. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs
 *        1 page-media-hero
 *        2 baggage-calculator   (NEW — form card overlapping the hero)
 *        3 title-with-list      (NEW — "Important Information")
 *        4 cta-banner           ("Do you need extra baggage?")
 *        5 faqs
 *        6 info-accordion       (Terms and Conditions / More Information)
 *
 * Calculator + list copy comes from cms2's demo i18n (baggageCalculator /
 * titleWithList). FAQ + terms copy is ours: the Figma frame still carries the
 * Unaccompanied Minors placeholder questions.
 *
 * Frontend URL: /travel-experience/before-you-fly/baggage-calculator
 * CMS slug:     baggage-calculator
 *
 *   node scripts/apply-baggage-calculator-page.mjs
 *   node scripts/apply-baggage-calculator-page.mjs --repair   # re-write seeded
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

const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL).replace(/\/$/, "");
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "baggage-calculator";
const PAGE_LABEL = "Baggage Calculator";
const PAGE_DESCRIPTION =
  "Estimate your baggage allowance by route, class and Cham Miles tier, plus extra baggage, FAQs and terms";
const FOLDER = "baggage-calculator";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), `../new_fly_cham/src/assets/images-webp/${FOLDER}`);
const UPLOADS = ["hero.webp", "extra-baggage.webp"];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "baggage-calculator", label: "Baggage Calculator" },
  { id: "title-with-list", label: "Title With List" },
  { id: "cta-banner", label: "CTA Banner" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

/** color + weight + both hover twins for one text role. */
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

// Figma hero: 500px, 64px bold primary title, 18px Text/700 subtitle.
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

const CALCULATOR_STYLE = {
  ...LAYOUT,
  overlapHero: true,
  cardBg: "background",
  showCardShadow: true,
  showIntro: true,
  showTier: true,
  showNote: true,
  fieldBg: "100",
  iconColor: "700",
  ...text("titleColor", "700", "normal"),
  ...text("labelColor", "700", "normal"),
  ...text("valueColor", "700", "medium"),
  ...text("placeholderColor", "600", "normal"),
  ...text("noteColor", "700", "normal"),
  ...text("ctaColor", "primary-1", "medium"),
  ctaColorHover: "primary-800",
  showButtonIcon: true,
  buttonBg: "primary-1",
  buttonBgHover: "",
  ...text("buttonText", "50", "semibold"),
  disabledBg: "300",
  disabledText: "500",
  ...BACKLINKS,
};

const LIST_STYLE = {
  ...LAYOUT,
  showCardBg: false,
  cardBg: "background",
  itemGap: "default",
  showIcon: true,
  iconColor: "primary-1",
  ...text("titleColor", "primary-1", "medium"),
  bulletStyle: "dot",
  bulletColor: "secondary",
  ...text("itemColor", "800", "normal"),
  ...BACKLINKS,
};

// Figma banner: 405px, 24px radius, #01263B wash, 32px white title, gold CTA.
const BANNER_STYLE = {
  ...LAYOUT,
  showTitle: true,
  showDescription: true,
  showButton: true,
  showButtonIcon: false,
  showHeroImage: true,
  showOverlay: true,
  overlayColor: "secondary-2",
  bannerHeight: "poster",
  bannerRadius: "full",
  titleAlign: "left",
  verticalAlign: "center",
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "normal"),
  buttonBg: "secondary",
  buttonBgHover: "",
  ...text("buttonText", "700", "semibold"),
  ...BACKLINKS,
};

// Figma FAQs: Primary 1 title, #00253C (secondary-2) questions, gold browse.
const FAQS_STYLE = {
  ...LAYOUT,
  showTitle: true,
  showBrowse: true,
  itemGap: "default",
  titleAlign: "left",
  ...text("titleColor", "primary-1", "semibold"),
  itemBg: "background",
  itemBorderColor: "200",
  itemRadius: "lg",
  ...text("questionColor", "secondary-2", "medium"),
  ...text("answerColor", "600", "normal"),
  iconColor: "700",
  browseBg: "secondary",
  browseHoverBg: "secondary-800",
  ...text("browseText", "700", "semibold"),
  ...BACKLINKS,
};

const TERMS_STYLE = {
  ...LAYOUT,
  cardBg: "background",
  cardRadius: "sm",
  dividerColor: "200",
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "600", "normal"),
  iconColor: "700",
  ...BACKLINKS,
};

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Before You Fly", "Baggage Calculator"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Baggage Calculator",
      subtitle: "Calculate your baggage allowance and excess fees before you travel.",
      imageAlt: "Yellow suitcase at the airport with a plane taking off",
    },
    banner: {
      title: "Do you need extra baggage?",
      description:
        "Plan ahead by purchasing excess baggage online and avoid last-minute arrangements at the airport.",
      buttonLabel: "Add Extra Baggage",
      imageAlt: "Fly Cham agent at the check-in desk",
    },
    faqs: {
      title: "Frequently Asked Questions",
      browseLabel: "Browse FAQs",
      items: [
        {
          question: "How accurate is the baggage calculator?",
          answer:
            "The calculator gives an estimate based on your route, travel class and Cham Miles tier. Your final allowance and any excess fees are confirmed at check-in based on the actual weight of your bags.",
        },
        {
          question: "Where can I find the baggage allowance for my booked flight?",
          answer:
            "Open Manage your booking to see the exact baggage allowance included in your ticket.",
        },
        {
          question: "Does my Cham Miles tier give me extra baggage?",
          answer:
            "Silver, Gold and Platinum members may receive an additional allowance on top of their fare. Select your tier in the calculator to include it in the estimate.",
        },
        {
          question: "How do I buy extra baggage?",
          answer:
            "You can add extra baggage through Manage Booking, at any Fly Cham sales office or at the airport check-in desk. Buying before check-in gives you the best rates.",
        },
        {
          question: "What is the maximum weight for a single bag?",
          answer:
            "A single checked bag cannot weigh more than 32 kg. Heavier items must be repacked or sent as cargo.",
        },
        {
          question: "Do infants have a baggage allowance?",
          answer:
            "Infants without their own seat are entitled to one checked bag of up to 10 kg plus essential items such as a stroller or car seat.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "Terms and Conditions",
        body:
          "Calculator results are estimates for guidance only and do not form part of your ticket conditions. Baggage allowances depend on your fare, route and membership status at the time of travel.\n\nExcess baggage fees are charged per piece or per kilogram according to the applicable tariff, and extra baggage is subject to space availability on the aircraft.",
      },
      {
        id: "more",
        title: "More Information",
        body:
          "Special items such as sports equipment, musical instruments and medical devices follow separate rules. Please contact us before your flight if you are travelling with them.",
      },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "قبل أن تسافر", "حاسبة الأمتعة"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "حاسبة الأمتعة",
      subtitle: "احسب وزن الأمتعة المسموح به والرسوم الإضافية قبل سفرك.",
      imageAlt: "حقيبة سفر صفراء في المطار وطائرة تقلع",
    },
    banner: {
      title: "هل تحتاج إلى أمتعة إضافية؟",
      description:
        "خطط مسبقًا واشترِ الأمتعة الإضافية عبر الإنترنت لتتجنب ترتيبات اللحظة الأخيرة في المطار.",
      buttonLabel: "أضف أمتعة إضافية",
      imageAlt: "موظف فلاي شام عند مكتب تسجيل الوصول",
    },
    faqs: {
      title: "الأسئلة الشائعة",
      browseLabel: "تصفح الأسئلة الشائعة",
      items: [
        {
          question: "ما مدى دقة حاسبة الأمتعة؟",
          answer:
            "تعطي الحاسبة تقديرًا بناءً على خط رحلتك ودرجة السفر وفئة عضويتك في شام مايلز. يتم تأكيد الوزن المسموح به والرسوم الإضافية عند تسجيل الوصول بحسب الوزن الفعلي لحقائبك.",
        },
        {
          question: "أين أجد وزن الأمتعة المسموح به لرحلتي المحجوزة؟",
          answer: "افتح صفحة إدارة حجزك لمعرفة وزن الأمتعة المشمول في تذكرتك بدقة.",
        },
        {
          question: "هل تمنحني فئة عضويتي في شام مايلز أمتعة إضافية؟",
          answer:
            "قد يحصل أعضاء الفئات الفضية والذهبية والبلاتينية على وزن إضافي فوق ما تتيحه تذكرتهم. اختر فئتك في الحاسبة لإدراجه في التقدير.",
        },
        {
          question: "كيف أشتري أمتعة إضافية؟",
          answer:
            "يمكنك إضافة أمتعة إضافية من خلال إدارة الحجز، أو في أي مكتب مبيعات لفلاي شام، أو عند مكتب تسجيل الوصول في المطار. الشراء قبل تسجيل الوصول يمنحك أفضل الأسعار.",
        },
        {
          question: "ما الحد الأقصى لوزن الحقيبة الواحدة؟",
          answer:
            "لا يمكن أن يتجاوز وزن الحقيبة المسجلة الواحدة 32 كغ. يجب إعادة توزيع الأغراض الأثقل أو إرسالها كشحن.",
        },
        {
          question: "هل للرضّع وزن أمتعة مسموح به؟",
          answer:
            "يحق للرضّع الذين لا يشغلون مقعدًا حقيبة مسجلة واحدة حتى 10 كغ، إضافة إلى المستلزمات الأساسية مثل عربة الأطفال أو مقعد السيارة.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "الشروط والأحكام",
        body:
          "نتائج الحاسبة تقديرية وللإرشاد فقط، ولا تُعد جزءًا من شروط تذكرتك. يعتمد وزن الأمتعة المسموح به على نوع التذكرة وخط الرحلة وحالة العضوية وقت السفر.\n\nتُحتسب رسوم الأمتعة الزائدة لكل قطعة أو لكل كيلوغرام وفق التعرفة المعمول بها، وتخضع الأمتعة الإضافية لتوفر المساحة على متن الطائرة.",
      },
      {
        id: "more",
        title: "معلومات إضافية",
        body:
          "تخضع المواد الخاصة مثل المعدات الرياضية والآلات الموسيقية والأجهزة الطبية لقواعد مختلفة. يرجى التواصل معنا قبل رحلتك إذا كنت ستسافر بها.",
      },
    ],
  },
};

const AIRPORT_CODES = [
  "DAM", "ALP", "DXB", "SHJ", "AUH", "KWI", "MCT", "BGW", "EBL", "EVN", "SAW", "MJI",
];
const CLASS_VALUES = ["economy", "business"];
const TIER_VALUES = ["none", "classic", "silver", "gold", "platinum"];

function loadDemoLocale(lang) {
  const path = resolve(
    process.cwd(),
    `../flychamadmin/src/cms2/i18n/locales/${lang}.json`
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const demo = loadDemoLocale(lang);
  const calc = demo.baggageCalculator;
  const list = demo.titleWithList;
  const crumbHrefs = ["/", "/travel-experience", "/travel-experience/before-you-fly", ""];

  return [
    {
      type: "breadcrumbs",
      style: CRUMBS_STYLE,
      content: {
        items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })),
        separator: "/",
        ariaLabel: copy.ariaLabel,
        links: [],
      },
    },
    {
      type: "page-media-hero",
      style: HERO_STYLE,
      content: {
        title: copy.hero.title,
        subtitle: copy.hero.subtitle,
        imageUrl: `${MEDIA}/hero.webp`,
        imageAlt: copy.hero.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "baggage-calculator",
      style: CALCULATOR_STYLE,
      content: {
        intro: calc.intro,
        fromLabel: calc.fromLabel,
        toLabel: calc.toLabel,
        classLabel: calc.classLabel,
        tierLabel: calc.tierLabel,
        fromPlaceholder: calc.fromPlaceholder,
        toPlaceholder: calc.toPlaceholder,
        classPlaceholder: calc.classPlaceholder,
        tierPlaceholder: calc.tierPlaceholder,
        defaultFrom: "DAM",
        defaultTo: "DXB",
        defaultClass: "economy",
        defaultTier: "",
        airports: AIRPORT_CODES.map((code) => ({
          id: code.toLowerCase(),
          value: code,
          label: calc.airports[code],
        })),
        classes: CLASS_VALUES.map((value) => ({ id: value, value, label: calc.classes[value] })),
        tiers: TIER_VALUES.map((value) => ({ id: value, value, label: calc.tiers[value] })),
        buttonLabel: calc.buttonLabel,
        buttonIcon: "Calculator",
        buttonHref: "/travel-experience/before-you-fly/allowed-baggage",
        noteText: calc.noteText,
        noteLinkLabel: calc.noteLinkLabel,
        noteLinkHref: "/travel-experience/before-you-fly/manage-booking",
        links: [],
      },
    },
    {
      type: "title-with-list",
      style: LIST_STYLE,
      content: {
        icon: "Info",
        title: list.title,
        items: list.items.map((itemText, index) => ({
          id: `item-${index + 1}`,
          text: itemText,
          icon: "",
        })),
        links: [],
      },
    },
    {
      type: "cta-banner",
      style: BANNER_STYLE,
      content: {
        title: copy.banner.title,
        description: copy.banner.description,
        buttonLabel: copy.banner.buttonLabel,
        buttonHref: "/travel-experience/before-you-fly/manage-booking",
        buttonLinkType: "internal",
        buttonIcon: "",
        imageUrl: `${MEDIA}/extra-baggage.webp`,
        imageAlt: copy.banner.imageAlt,
        links: [],
      },
    },
    {
      type: "faqs",
      style: FAQS_STYLE,
      content: {
        title: copy.faqs.title,
        browseLabel: copy.faqs.browseLabel,
        browseHref: "/help/faqs",
        items: copy.faqs.items,
        links: [],
      },
    },
    {
      type: "info-accordion",
      style: TERMS_STYLE,
      content: {
        items: copy.terms.map((item) => ({ ...item, defaultOpen: true })),
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

function curl(method, path, { body, token, prefer, query, file, contentType, headers } = {}) {
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
  // Send bodies from a UTF-8 file: passing JSON as a CLI arg goes through the
  // Windows ANSI codepage and turns Arabic into "????".
  let dir;
  if (file) {
    args.push("--data-binary", `@${file}`);
  } else if (body !== undefined) {
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

for (const name of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, {
    token,
    file: resolve(ASSETS, name),
    contentType: "image/webp",
    headers: ["x-upsert: true", "Cache-Control: max-age=3600"],
  });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) {
    console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res)));
    process.exit(1);
  }
  console.log("image uploaded:", `${FOLDER}/${name}`);
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

console.log("Done. Open /en/travel-experience/before-you-fly/baggage-calculator");
