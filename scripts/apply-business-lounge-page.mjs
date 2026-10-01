/**
 * Seeds the business-lounge page from Figma 40442:11924.
 * URL: /travel-experience/at-the-airport/business-lounge
 *
 * Blocks: breadcrumbs, page-media-hero, page-intro, feature-highlight,
 * lounge-cards, faqs, info-accordion, airport-service-cards.
 *
 *   node scripts/apply-business-lounge-page.mjs
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

const PAGE_SLUG = "business-lounge";
const FOLDER = "business-lounge";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/business-lounge");
const PAGE_HREF = "/travel-experience/at-the-airport/business-lounge";
const UPLOADS = [
  "hero.png",
  "buffet.png",
  "damascus.png",
  "aleppo.png",
  "sharjah.png",
  "istanbul.png",
  "entertainment.png",
  "meals.png",
  "magazine.png",
];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "page-intro", label: "Page Intro" },
  { id: "feature-highlight", label: "Feature Highlight" },
  { id: "lounge-cards", label: "Lounge Cards" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
  { id: "airport-service-cards", label: "Airport Service Cards" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
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

const FEATURE_STYLE = {
  imageSide: "right",
  featureColumns: "1",
  imageRadius: "xl",
  ...LAYOUT,
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  showIcon: true,
  iconBg: "primary-1",
  iconColor: "50",
  ...text("featureTitleColor", "primary-1", "medium"),
  ...text("featureDescriptionColor", "600", "normal"),
  showLink: true,
  showLinkIcon: true,
  ...text("buttonText", "primary-1", "semibold"),
  ...BACKLINKS,
};

const LOUNGE_STYLE = {
  showHeader: true,
  columns: "4",
  radius: "xl",
  ...LAYOUT,
  showOverlay: true,
  showArrows: true,
  showDots: true,
  ...text("titleColor", "700", "semibold"),
  ...text("cardTitleColor", "50", "semibold"),
  ...text("cardDescriptionColor", "50", "normal"),
  showLink: true,
  showLinkIcon: true,
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
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
  columns: "3",
  cardGap: "default",
  cardRadius: "lg",
  imageHeight: "medium",
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
    crumbs: ["Home", "Travel experience", "At The Airport", "Business Lounge"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Business Lounge",
      subtitle: "Luxury Begin At The Airport",
      imageAlt: "A passenger relaxing in the business lounge",
    },
    intro: {
      lead: "Your waiting time at the airport is now a chance to relax and enjoy an atmosphere that combines comfort.",
      body: "We offer our valued business class passengers’ complimentary access to business class lounges at Damascus, Kuwait, and Sharjah airports for a relaxing experience before takeoff.",
    },
    feature: {
      title: "Business Lounge at Damascus International Airport",
      description:
        "The Business Lounge at Damascus International Airport offers passengers a unique experience and a calm and relaxing atmosphere before their flights",
      imageAlt: "A buffet in the business lounge",
      items: [
        {
          id: "seating",
          icon: "Armchair",
          title: "Comfortable Seating",
          description: "Relax in a quiet and elegant environment",
        },
        {
          id: "refreshments",
          icon: "Coffee",
          title: "Refreshments",
          description: "Enjoy a selection of hot and cold beverages",
        },
        {
          id: "wifi",
          icon: "WifiHigh",
          title: "Stay Connected",
          description: "Complimentary high-speed Wi-Fi",
        },
      ],
    },
    lounges: {
      title: "Our Lounges",
      items: [
        { id: "damascus", image: "damascus.png", title: "Damascus International Airport (DAM)", imageAlt: "Damascus International Airport" },
        { id: "aleppo", image: "aleppo.png", title: "Aleppo International Airport (ALP)", imageAlt: "Aleppo International Airport" },
        { id: "sharjah", image: "sharjah.png", title: "Sharjah International Airport (SHJ)", imageAlt: "Sharjah International Airport" },
        { id: "istanbul", image: "istanbul.png", title: "Istanbul International Airport (IST)", imageAlt: "Istanbul International Airport" },
      ],
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
      title: "More to Make Your Journey Special",
      learnMore: "Learn More",
      items: [
        {
          id: "entertainment",
          image: "entertainment.png",
          title: "Entertainment System",
          description: "Explore the in-flight entertainment system with movies, music, and more for every seat",
          href: "/travel-experience/onboard",
          imageAlt: "A passenger using the in-flight entertainment screen",
        },
        {
          id: "meals",
          image: "meals.png",
          title: "Meals Onboard",
          description:
            "Browse our onboard meal options and pre-order your favorite dishes for a delightful dining experience during your flight.",
          href: "/travel-experience/onboard",
          imageAlt: "A meal served on board",
        },
        {
          id: "magazine",
          image: "magazine.png",
          title: "Marhaba Magazine",
          description:
            "Enjoy reading a distinguished collection of curated articles about international travel, business and tourism.",
          href: "/travel-experience/traveler-magazine",
          imageAlt: "The Marhaba magazine cover",
        },
      ],
    },
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "في المطار", "صالة رجال الأعمال"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "صالة رجال الأعمال",
      subtitle: "تبدأ الرفاهية في المطار",
      imageAlt: "راكب يسترخي في صالة رجال الأعمال",
    },
    intro: {
      lead: "أصبح وقت انتظارك في المطار فرصة للاسترخاء والاستمتاع بأجواء تجمع بين الراحة.",
      body: "نوفّر لركاب درجة رجال الأعمال دخولاً مجانياً إلى صالات درجة رجال الأعمال في مطارات دمشق والكويت والشارقة لتجربة مريحة قبل الإقلاع.",
    },
    feature: {
      title: "صالة رجال الأعمال في مطار دمشق الدولي",
      description:
        "تقدّم صالة رجال الأعمال في مطار دمشق الدولي للمسافرين تجربة فريدة وأجواء هادئة ومريحة قبل رحلاتهم",
      imageAlt: "بوفيه في صالة رجال الأعمال",
      items: [
        {
          id: "seating",
          icon: "Armchair",
          title: "مقاعد مريحة",
          description: "استرخِ في بيئة هادئة وأنيقة",
        },
        {
          id: "refreshments",
          icon: "Coffee",
          title: "المرطبات",
          description: "استمتع بتشكيلة من المشروبات الساخنة والباردة",
        },
        {
          id: "wifi",
          icon: "WifiHigh",
          title: "ابقَ على اتصال",
          description: "واي فاي عالي السرعة مجاناً",
        },
      ],
    },
    lounges: {
      title: "صالاتنا",
      items: [
        { id: "damascus", image: "damascus.png", title: "مطار دمشق الدولي (DAM)", imageAlt: "مطار دمشق الدولي" },
        { id: "aleppo", image: "aleppo.png", title: "مطار حلب الدولي (ALP)", imageAlt: "مطار حلب الدولي" },
        { id: "sharjah", image: "sharjah.png", title: "مطار الشارقة الدولي (SHJ)", imageAlt: "مطار الشارقة الدولي" },
        { id: "istanbul", image: "istanbul.png", title: "مطار إسطنبول الدولي (IST)", imageAlt: "مطار إسطنبول الدولي" },
      ],
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
      title: "المزيد لجعل رحلتك مميزة",
      learnMore: "اعرف المزيد",
      items: [
        {
          id: "entertainment",
          image: "entertainment.png",
          title: "نظام الترفيه",
          description: "استكشف نظام الترفيه على متن الطائرة مع الأفلام والموسيقى والمزيد لكل مقعد",
          href: "/travel-experience/onboard",
          imageAlt: "راكب يستخدم شاشة الترفيه على متن الطائرة",
        },
        {
          id: "meals",
          image: "meals.png",
          title: "الوجبات على متن الطائرة",
          description: "تصفّح خيارات الوجبات على متن الطائرة واطلب أطباقك المفضلة مسبقاً لتجربة طعام ممتعة أثناء الرحلة.",
          href: "/travel-experience/onboard",
          imageAlt: "وجبة تُقدَّم على متن الطائرة",
        },
        {
          id: "magazine",
          image: "magazine.png",
          title: "مجلة مرحبا",
          description: "استمتع بقراءة مجموعة مميزة من المقالات المختارة عن السفر الدولي والأعمال والسياحة.",
          href: "/travel-experience/traveler-magazine",
          imageAlt: "غلاف مجلة مرحبا",
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
        lead: copy.intro.lead,
        body: copy.intro.body,
        links: [],
      },
    },
    {
      type: "feature-highlight",
      style: FEATURE_STYLE,
      content: {
        title: copy.feature.title,
        description: copy.feature.description,
        imageUrl: `${MEDIA}/buffet.png`,
        imageAlt: copy.feature.imageAlt,
        items: copy.feature.items.map((item) => ({
          ...item,
          linkLabel: "",
          href: "",
          linkIcon: "ArrowRight",
        })),
        links: [],
      },
    },
    {
      type: "lounge-cards",
      style: LOUNGE_STYLE,
      content: {
        title: copy.lounges.title,
        items: copy.lounges.items.map((item) => ({
          id: item.id,
          imageUrl: `${MEDIA}/${item.image}`,
          imageAlt: item.imageAlt,
          title: item.title,
          description: lang === "ar" ? "نص حر" : "Free Text",
          href: "",
          icon: "ArrowRight",
        })),
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
  if (node.id === "businessLounge" && typeof node.href === "string") node.href = PAGE_HREF;
  Object.values(node).forEach(retargetHeader);
}

function retargetLoungeCard(node) {
  if (Array.isArray(node)) {
    node.forEach(retargetLoungeCard);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (node.id === "lounge" && typeof node.href === "string") node.href = PAGE_HREF;
  Object.values(node).forEach(retargetLoungeCard);
}

function retargetJourney(node) {
  if (Array.isArray(node)) {
    node.forEach(retargetJourney);
    return;
  }
  if (!node || typeof node !== "object") return;
  const key = node.id || node.key;
  if (key === "businessLounge" && typeof node.href === "string") node.href = PAGE_HREF;
  Object.values(node).forEach(retargetJourney);
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
        label: "Business Lounge",
        description: "Business class lounges at Damascus, Kuwait, and Sharjah airports",
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

function patchPage(slug, walk, label) {
  const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${slug}&select=id` });
  const parentId = Array.isArray(pages) ? pages[0]?.id : null;
  if (!parentId) return;
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${parentId}&select=component_id,components(id,content)`,
  });
  if (!Array.isArray(links)) return;
  for (const link of links) {
    const component = Array.isArray(link.components) ? link.components[0] : link.components;
    if (!component?.content) continue;
    const before = JSON.stringify(component.content);
    walk(component.content);
    if (JSON.stringify(component.content) === before) continue;
    const res = curl("PATCH", "/rest/v1/components", {
      token,
      query: `id=eq.${component.id}`,
      prefer: "return=minimal",
      body: { content: component.content },
    });
    if (res?.message) console.error(`${label} link update failed:`, restError(res, "unknown error"));
    else console.log(`${label} link updated:`, component.id);
  }
}

patchPage("at-the-airport", retargetLoungeCard, "at-the-airport lounge");
patchPage("travel-experience", retargetJourney, "travel-experience journey");

console.log("Done. Open /en/travel-experience/at-the-airport/business-lounge");
