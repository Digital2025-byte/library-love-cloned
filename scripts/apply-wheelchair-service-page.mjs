/**
 * Seeds the wheelchair-service page from Figma 40442:20082.
 * URL: /travel-experience/at-the-airport/wheelchair-service
 *
 *   node scripts/apply-wheelchair-service-page.mjs
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
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "wheelchair-service";
const FOLDER = "wheelchair-service";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/wheelchair-service");
const PAGE_HREF = "/travel-experience/at-the-airport/wheelchair-service";
const FORM_HREF = "/help/contact-us/forms/request-a-form?form=wheelchair";
const UPLOADS = ["hero.png", "steps.png", "request.png", "marhaba.png", "lounge.png"];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "page-intro", label: "Page Intro" },
  { id: "support-steps", label: "Support Steps" },
  { id: "promo-banner", label: "Promo Banner" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
  { id: "airport-service-cards", label: "Airport Service Cards" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "medium",
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
  contentWidth: "narrow",
  overlayWidth: "default",
  objectPosition: "center",
  sectionBg: "100",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  showButton: false,
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "700", "medium"),
  ...BACKLINKS,
};

const INTRO_STYLE = {
  ...LAYOUT,
  ...text("leadColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  ...BACKLINKS,
};

const STEPS_STYLE = {
  imageSide: "right",
  imageRadius: "xl",
  ...LAYOUT,
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "600", "normal"),
  showIcon: true,
  iconBg: "primary-1",
  iconColor: "50",
  showConnectors: true,
  connectorColor: "700",
  ...text("stepTitleColor", "700", "semibold"),
  ...text("stepDescriptionColor", "700", "normal"),
  showLink: true,
  showLinkIcon: true,
  ...text("buttonText", "primary-1", "semibold"),
  ...BACKLINKS,
};

const PROMO_STYLE = {
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: false,
  showOverlay: true,
  sectionBg: "100",
  sectionPadding: "none",
  bannerHeight: "medium",
  bannerRadius: "sm",
  objectPosition: "center",
  overlayColor: "#01263B",
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "normal"),
  buttonBg: "secondary",
  buttonBgHover: "secondary-800",
  buttonText: "700",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "700",
  buttonTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

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

const CARDS_STYLE = {
  ...LAYOUT,
  showHeader: true,
  showTitle: true,
  showSubtitle: false,
  headerAlign: "center",
  columns: "2",
  cardGap: "default",
  cardRadius: "lg",
  imageHeight: "xl",
  ...text("titleColor", "700", "semibold"),
  ...text("subtitleColor", "700", "normal"),
  cardBg: "background",
  showCardShadow: true,
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "700", "normal"),
  showLink: true,
  showLinkIcon: true,
  learnMoreColor: "primary-1",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "50",
  learnMoreFontWeightHover: "semibold",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  ...BACKLINKS,
};

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "At The Airport", "Wheelchair Service"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Wheelchair Service",
      subtitle: "Care at Every Step",
      imageAlt: "A passenger in a wheelchair with an assistant at the airport",
    },
    intro:
      "To ensure your comfort, we offer complimentary wheelchair service to passengers with special needs or those requiring mobility assistance at most of our direct destinations, providing a smooth and comfortable travel experience. You can request the service through 'Manage booking'",
    manageLabel: "Manage booking",
    steps: {
      title: "We Support  you at Every Step",
      description:
        "From the moment you arrive at the airport until you reach your final destination, our team is here to assist you.",
      imageAlt: "A passenger receiving wheelchair assistance in the terminal",
      items: [
        { id: "airport", icon: "AirTrafficControl", title: "At the Airport", description: "Assistance from the terminal entrance." },
        { id: "checkin", icon: "UserCheck", title: "Check-in", description: "Support with check-in procedures." },
        { id: "boarding", icon: "AirplaneTakeoff", title: "Boarding", description: "Help with boarding the aircraft." },
        { id: "arrival", icon: "AirplaneLanding", title: "Arrival", description: "Assistance upon arrival and baggage" },
      ],
    },
    promo: {
      title: "REQUEST IN ADVANCE 24 Hours",
      description:
        "Wheelchair access must be requested at least 24 hours before flight departure through a Fly Cham sales office or the travel agency that issued the ticket.",
      buttonLabel: "Request a wheel chair",
      imageAlt: "Airport staff assisting a passenger",
    },
    faqs: {
      title: "Frequently Asked Questions",
      browseLabel: "Browse FAQs",
      items: [
        {
          question: "What is the maximum weight for checked baggage?",
          answer:
            "The checked baggage limit depends on your fare and route. Your ticket shows the allowance, and bags over that weight may need an extra fee at check-in.",
        },
        {
          question: "Can I bring a musical instrument on board?",
          answer:
            "A small instrument may travel in the cabin when it fits the carry-on size. Larger instruments can be checked or booked as a special item before you fly.",
        },
        {
          question: "What items are prohibited in carry-on luggage?",
          answer:
            "Liquids over 100 ml, sharp objects, and flammable items are not allowed in the cabin. The prohibited items page lists what you can and cannot bring.",
        },
        {
          question: "How do I add extra baggage to my booking?",
          answer:
            "You can add extra baggage when you book, in Manage Booking, or at the airport check-in desk. The fee depends on the route and the extra weight.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "Baggage Terms and Conditions",
        body: "Baggage allowances vary by travel class and fare type. Carry-on baggage must fit in the overhead bin or under the seat in front of you. Checked baggage is subject to size and weight limits, and oversized items may require special handling.\n\nPlease check your ticket or contact our sales offices for the most up-to-date baggage information before your flight.",
      },
      {
        id: "fees",
        title: "Baggage Fees",
        body: "Are there fees for overweight baggage? Yes, bags exceeding the standard weight limit may incur an extra baggage fee. Please check your fare conditions before checking in.",
      },
    ],
    cards: {
      title: "Services Elevate Your Experience",
      learnMore: "Learn More",
      items: [
        {
          id: "marhaba",
          image: "marhaba.png",
          title: "Ya Marhaba service",
          description:
            "Experience our signature meet-and-greet service with personalized assistance from arrival to boarding.",
          href: "/travel-experience/before-you-fly/transportation-service",
          imageAlt: "A white car parked by the waterfront",
        },
        {
          id: "lounge",
          image: "lounge.png",
          title: "Business lounge",
          description:
            "Relax in our exclusive business lounge with premium amenities, refreshments, and a peaceful atmosphere before your flight.",
          href: "/travel-experience/at-the-airport/business-lounge",
          imageAlt: "Two people talking in the business lounge",
        },
      ],
    },
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "في المطار", "خدمة الكرسي المتحرك"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "خدمة الكرسي المتحرك",
      subtitle: "رعاية في كل خطوة",
      imageAlt: "راكب على كرسي متحرك مع مرافق في المطار",
    },
    intro:
      "لضمان راحتك، نوفّر خدمة الكرسي المتحرك مجاناً للركاب من ذوي الاحتياجات الخاصة أو من يحتاجون إلى مساعدة في التنقل في معظم وجهاتنا المباشرة، لتجربة سفر سلسة ومريحة. يمكنك طلب الخدمة من خلال 'إدارة الحجز'",
    manageLabel: "إدارة الحجز",
    steps: {
      title: "ندعمك في كل خطوة",
      description: "من لحظة وصولك إلى المطار حتى تبلغ وجهتك النهائية، فريقنا هنا لمساعدتك.",
      imageAlt: "راكب يتلقى مساعدة الكرسي المتحرك في المطار",
      items: [
        { id: "airport", icon: "AirTrafficControl", title: "في المطار", description: "المساعدة من مدخل المبنى." },
        { id: "checkin", icon: "UserCheck", title: "تسجيل الوصول", description: "الدعم في إجراءات تسجيل الوصول." },
        { id: "boarding", icon: "AirplaneTakeoff", title: "الصعود", description: "المساعدة في الصعود إلى الطائرة." },
        { id: "arrival", icon: "AirplaneLanding", title: "الوصول", description: "المساعدة عند الوصول والأمتعة" },
      ],
    },
    promo: {
      title: "اطلب مسبقاً قبل 24 ساعة",
      description:
        "يجب طلب خدمة الكرسي المتحرك قبل 24 ساعة على الأقل من موعد إقلاع الرحلة، عبر مكتب مبيعات فلاي شام أو وكالة السفر التي أصدرت التذكرة.",
      buttonLabel: "اطلب كرسياً متحركاً",
      imageAlt: "موظف في المطار يساعد راكباً",
    },
    faqs: {
      title: "الأسئلة الشائعة",
      browseLabel: "تصفّح الأسئلة الشائعة",
      items: [
        {
          question: "ما هو الحد الأقصى لوزن الأمتعة المسجّلة؟",
          answer:
            "يعتمد حد الأمتعة المسجّلة على الأجرة والمسار. تظهر السماحية على تذكرتك، وقد تستلزم الحقائب التي تتجاوزها رسماً إضافياً عند تسجيل الوصول.",
        },
        {
          question: "هل يمكنني اصطحاب آلة موسيقية على متن الطائرة؟",
          answer:
            "يمكن للآلات الصغيرة السفر في المقصورة إذا كانت ضمن حجم حقيبة اليد. أما الآلات الأكبر فيمكن تسجيلها أو حجزها كغرض خاص قبل السفر.",
        },
        {
          question: "ما المواد الممنوعة في حقائب اليد؟",
          answer:
            "السوائل التي تزيد عن 100 مل، والأدوات الحادة، والمواد القابلة للاشتعال غير مسموحة في المقصورة. تعرض صفحة المواد المحظورة ما يمكن إحضاره وما لا يمكن.",
        },
        {
          question: "كيف أضيف أمتعة إضافية إلى حجزي؟",
          answer:
            "يمكنك إضافة أمتعة إضافية عند الحجز، أو من إدارة الحجز، أو عند مكتب تسجيل الوصول في المطار. تعتمد الرسوم على المسار والوزن الإضافي.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "شروط وأحكام الأمتعة",
        body: "تختلف سماحية الأمتعة حسب درجة السفر ونوع الأجرة. يجب أن تتسع حقيبة اليد في الخزانة العلوية أو تحت المقعد أمامك. تخضع الأمتعة المسجّلة لحدود الحجم والوزن، وقد تحتاج القطع كبيرة الحجم إلى مناولة خاصة.\n\nيرجى مراجعة تذكرتك أو التواصل مع مكاتب المبيعات للاطلاع على أحدث معلومات الأمتعة قبل رحلتك.",
      },
      {
        id: "fees",
        title: "رسوم الأمتعة",
        body: "هل توجد رسوم على الأمتعة زائدة الوزن؟ نعم، قد تُفرض رسوم أمتعة إضافية على الحقائب التي تتجاوز حد الوزن المعتاد. يرجى مراجعة شروط أجرتك قبل تسجيل الوصول.",
      },
    ],
    cards: {
      title: "خدمات ترتقي بتجربتك",
      learnMore: "اعرف المزيد",
      items: [
        {
          id: "marhaba",
          image: "marhaba.png",
          title: "خدمة يا مرحبا",
          description: "اختبر خدمة الاستقبال المميزة مع مساعدة شخصية من الوصول حتى الصعود.",
          href: "/travel-experience/before-you-fly/transportation-service",
          imageAlt: "سيارة بيضاء متوقفة قرب الواجهة البحرية",
        },
        {
          id: "lounge",
          image: "lounge.png",
          title: "صالة رجال الأعمال",
          description: "استرخِ في صالة رجال الأعمال الحصرية مع مرافق مميزة ومرطبات وأجواء هادئة قبل رحلتك.",
          href: "/travel-experience/at-the-airport/business-lounge",
          imageAlt: "شخصان يتحدثان في صالة رجال الأعمال",
        },
      ],
    },
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", "/travel-experience/at-the-airport", ""];
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
        imageUrl: `${MEDIA}/hero.png`,
        imageAlt: copy.hero.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "page-intro",
      style: INTRO_STYLE,
      content: {
        lead: "",
        body: copy.intro,
        links: [{ text: copy.manageLabel, href: "/", type: "internal", occurrence: "first" }],
      },
    },
    {
      type: "support-steps",
      style: STEPS_STYLE,
      content: {
        title: copy.steps.title,
        description: copy.steps.description,
        imageUrl: `${MEDIA}/steps.png`,
        imageAlt: copy.steps.imageAlt,
        items: copy.steps.items.map((item) => ({
          ...item,
          linkLabel: "",
          href: "",
          linkIcon: "ArrowRight",
        })),
        links: [],
      },
    },
    {
      type: "promo-banner",
      style: PROMO_STYLE,
      content: {
        title: copy.promo.title,
        description: copy.promo.description,
        buttonLabel: copy.promo.buttonLabel,
        buttonHref: FORM_HREF,
        imageUrl: `${MEDIA}/request.png`,
        imageAlt: copy.promo.imageAlt,
        ctaButton: { content: copy.promo.buttonLabel, href: FORM_HREF },
        image: { fileUrl: `${MEDIA}/request.png`, alt: copy.promo.imageAlt },
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
    {
      type: "airport-service-cards",
      style: CARDS_STYLE,
      content: {
        title: copy.cards.title,
        subtitle: "",
        items: copy.cards.items.map((item) => ({
          id: item.id,
          imageUrl: `${MEDIA}/${item.image}`,
          imageAlt: item.imageAlt,
          title: item.title,
          description: item.description,
          cta: copy.cards.learnMore,
          href: item.href,
          icon: "ArrowRight",
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

function curl(method, path, { body, token, prefer, query, file, contentType, headers } = {}) {
  const qs = query ? `?${query}` : "";
  const args = [
    "-sS", "-X", method, `${url}${path}${qs}`,
    "-H", `apikey: ${key}`,
    "-H", `Content-Type: ${contentType || "application/json"}`,
  ];
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

function retargetHeader(node) {
  if (Array.isArray(node)) {
    node.forEach(retargetHeader);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (node.id === "wheelchair" && typeof node.href === "string") node.href = PAGE_HREF;
  Object.values(node).forEach(retargetHeader);
}

function retargetWheelchairCard(node) {
  if (Array.isArray(node)) {
    node.forEach(retargetWheelchairCard);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (node.id === "wheelchair" && typeof node.href === "string") node.href = PAGE_HREF;
  Object.values(node).forEach(retargetWheelchairCard);
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
    contentType: "image/png",
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
        label: "Wheelchair Service",
        description: "Complimentary wheelchair assistance from the terminal entrance through arrival",
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
      console.error(`components insert failed (${lang} ${block.type}):`, restError(inserted, "unknown error"));
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang} ${block.type}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${block.type} (${lang}) @${position}:`, comp.id);
  }
}

{
  const rows = curl("GET", "/rest/v1/site_header", { token, query: "select=lang,data,version" });
  if (Array.isArray(rows)) {
    for (const row of rows) {
      const before = JSON.stringify(row.data);
      retargetHeader(row.data);
      if (JSON.stringify(row.data) === before) {
        console.log("header already pointed:", row.lang);
        continue;
      }
      const res = curl("PATCH", "/rest/v1/site_header", {
        token,
        query: `lang=eq.${row.lang}`,
        prefer: "return=minimal",
        body: { data: row.data, version: Number(row.version || 1) + 1 },
      });
      if (res?.message) console.error(`header update failed (${row.lang}):`, restError(res, "unknown error"));
      else console.log("header link updated:", row.lang);
    }
  }
}

{
  const pages = curl("GET", "/rest/v1/pages", { token, query: "slug=eq.at-the-airport&select=id" });
  const parentId = Array.isArray(pages) ? pages[0]?.id : null;
  if (parentId) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${parentId}&select=component_id,components(id,content)`,
    });
    if (Array.isArray(links)) {
      for (const link of links) {
        const component = Array.isArray(link.components) ? link.components[0] : link.components;
        if (!component?.content) continue;
        const before = JSON.stringify(component.content);
        retargetWheelchairCard(component.content);
        if (JSON.stringify(component.content) === before) continue;
        const res = curl("PATCH", "/rest/v1/components", {
          token,
          query: `id=eq.${component.id}`,
          prefer: "return=minimal",
          body: { content: component.content },
        });
        if (res?.message) console.error("at-the-airport link update failed:", restError(res, "unknown error"));
        else console.log("at-the-airport wheelchair link updated:", component.id);
      }
    }
  }
}

console.log("Done. Open /en/travel-experience/at-the-airport/wheelchair-service");
