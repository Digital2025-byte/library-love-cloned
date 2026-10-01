/**
 * Seeds the birthday-onboard page from Figma 40281:46346.
 * URL: /travel-experience/on-board/birthday-onboard
 *
 *   node scripts/apply-birthday-onboard-page.mjs
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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL).replace(/\/$/, "");
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "birthday-onboard";
const FOLDER = "birthday-onboard";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/birthday-onboard");
const HUB = "/travel-experience/on-board";
const MAGAZINE = "/travel-experience/traveler-magazine";
const UPLOADS = ["hero.png", "cake.png", "special.png", "little.png", "toys.png", "entertainment.png", "meals.png", "magazine.png"];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "seat-journey", label: "Seat Journey" },
  { id: "split-cards", label: "Split Cards" },
  { id: "promo-banner", label: "Promo Banner" },
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
  const weightKey = colorKey.endsWith("Color") ? colorKey.replace(/Color$/, "FontWeight") : `${colorKey}FontWeight`;
  return { [colorKey]: color, [weightKey]: weight, [`${colorKey}Hover`]: color, [`${weightKey}Hover`]: weight };
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

const JOURNEY_STYLE = {
  ...LAYOUT,
  layout: "default",
  imageSide: "right",
  imageRadius: "2xl",
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  showButton: false,
  showButtonIcon: false,
  buttonSize: "medium",
  ...BACKLINKS,
};

const PAIR_STYLE = {
  ...LAYOUT,
  layout: "pair",
  columns: "2",
  showHeader: false,
  showSubtitle: false,
  cardBg: "background",
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "700", "normal"),
  showLink: false,
  showLinkIcon: false,
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
  columns: "3",
  cardGap: "default",
  cardRadius: "lg",
  imageHeight: "medium",
  ...text("titleColor", "700", "semibold"),
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

const FAQS_EN = [
  { question: "What is the maximum weight for checked baggage?", answer: "The checked baggage limit depends on your fare and route. Your ticket shows the allowance, and bags over that weight may need an extra fee at check-in." },
  { question: "Can I bring a musical instrument on board?", answer: "A small instrument may travel in the cabin when it fits the carry-on size. Larger instruments can be checked or booked as a special item before you fly." },
  { question: "What items are prohibited in carry-on luggage?", answer: "Liquids over 100 ml, sharp objects, and flammable items are not allowed in the cabin. The prohibited items page lists what you can and cannot bring." },
  { question: "How do I add extra baggage to my booking?", answer: "You can add extra baggage when you book, in Manage Booking, or at the airport check-in desk. The fee depends on the route and the extra weight." },
];

const TERMS_EN = [
  { id: "terms", title: "Baggage Terms and Conditions", body: "Baggage allowances vary by travel class and fare type. Carry-on baggage must fit in the overhead bin or under the seat in front of you. Checked baggage is subject to size and weight limits, and oversized items may require special handling.\n\nPlease check your ticket or contact our sales offices for the most up-to-date baggage information before your flight." },
  { id: "fees", title: "Baggage Fees", body: "Are there fees for overweight baggage? Yes, bags exceeding the standard weight limit may incur an extra baggage fee. Please check your fare conditions before checking in." },
];

const FAQS_AR = [
  { question: "ما هو الحد الأقصى لوزن الأمتعة المسجّلة؟", answer: "يعتمد حد الأمتعة المسجّلة على الأجرة والمسار. تظهر السماحية على تذكرتك، وقد تستلزم الحقائب التي تتجاوزها رسماً إضافياً عند تسجيل الوصول." },
  { question: "هل يمكنني اصطحاب آلة موسيقية على متن الطائرة؟", answer: "يمكن للآلات الصغيرة السفر في المقصورة إذا كانت ضمن حجم حقيبة اليد. أما الآلات الأكبر فيمكن تسجيلها أو حجزها كغرض خاص قبل السفر." },
  { question: "ما المواد الممنوعة في حقائب اليد؟", answer: "السوائل التي تزيد عن 100 مل، والأدوات الحادة، والمواد القابلة للاشتعال غير مسموحة في المقصورة. تعرض صفحة المواد المحظورة ما يمكن إحضاره وما لا يمكن." },
  { question: "كيف أضيف أمتعة إضافية إلى حجزي؟", answer: "يمكنك إضافة أمتعة إضافية عند الحجز، أو من إدارة الحجز، أو عند مكتب تسجيل الوصول في المطار. تعتمد الرسوم على المسار والوزن الإضافي." },
];

const TERMS_AR = [
  { id: "terms", title: "شروط وأحكام الأمتعة", body: "تختلف سماحية الأمتعة حسب درجة السفر ونوع الأجرة. يجب أن تتسع حقيبة اليد في الخزانة العلوية أو تحت المقعد أمامك. تخضع الأمتعة المسجّلة لحدود الحجم والوزن، وقد تحتاج القطع كبيرة الحجم إلى مناولة خاصة.\n\nيرجى مراجعة تذكرتك أو التواصل مع مكاتب المبيعات للاطلاع على أحدث معلومات الأمتعة قبل رحلتك." },
  { id: "fees", title: "رسوم الأمتعة", body: "هل توجد رسوم على الأمتعة زائدة الوزن؟ نعم، قد تُفرض رسوم أمتعة إضافية على الحقائب التي تتجاوز حد الوزن المعتاد. يرجى مراجعة شروط أجرتك قبل تسجيل الوصول." },
];

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Onboard", "Birthday onboard"],
    ariaLabel: "Breadcrumb",
    hero: { title: "Birthday Onboard", subtitle: "Celebrate Your Birthday With Us In The Sky", imageAlt: "A birthday celebration on board" },
    journey: {
      title: "Make Your Birthday Flight Memorable",
      description: "We believe that every moment of your flight is an opportunity to celebrate, especially if it's your birthday. That's why we offer you a unique onboard celebratory experience, where we share the joy with you over a delicious cake and our crew, who create a warm and special atmosphere for your birthday",
      imageAlt: "A birthday cake served on a tray",
    },
    pair: [
      { id: "special", image: "special.png", title: "Your Special Day Deserves Celebration", description: "Whether you're traveling alone or with loved ones, your birthday celebration will make your day even more special, allowing you to enjoy joy and beautiful memories together during your flight.", imageAlt: "A birthday celebration" },
      { id: "little", image: "little.png", title: "Happy Moments for Little Travelers", description: "We celebrate your child's special day with joyful moments that make their journey even more memorable and magical.", imageAlt: "A child traveler" },
    ],
    promo: {
      title: "Toys for Young Travelers",
      description: "Keep your little ones engaged and entertained throughout the flight with our complimentary activity packs.",
      buttonLabel: "Explore Kids Toys",
      imageAlt: "Children's activity packs",
    },
    faqsTitle: "Frequently Asked Questions",
    browseLabel: "Browse FAQs",
    faqs: FAQS_EN,
    terms: TERMS_EN,
    cardsTitle: "More to Make Your Journey Special",
    learnMore: "Learn More",
    cards: [
      { id: "entertainment", image: "entertainment.png", title: "Entertainment System", description: "Explore the in-flight entertainment system with movies, music, and more for every seat", href: HUB, imageAlt: "In-flight entertainment" },
      { id: "meals", image: "meals.png", title: "Meals Onboard", description: "Browse our onboard meal options and pre-order your favorite dishes for a delightful dining experience during your flight.", href: HUB, imageAlt: "A meal served on board" },
      { id: "magazine", image: "magazine.png", title: "Marhaba Magazine", description: "Enjoy reading a distinguished collection of curated articles about international travel, business and tourism.", href: MAGAZINE, imageAlt: "Marhaba magazine" },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "على متن الطائرة", "عيد الميلاد على المتن"],
    ariaLabel: "مسار التنقل",
    hero: { title: "عيد الميلاد على المتن", subtitle: "احتفل بعيد ميلادك معنا في السماء", imageAlt: "احتفال بعيد ميلاد على متن الطائرة" },
    journey: {
      title: "اجعل رحلة عيد ميلادك لا تُنسى",
      description: "نؤمن أن كل لحظة في رحلتك فرصة للاحتفال، خصوصاً إذا كان عيد ميلادك. لذلك نقدّم لك تجربة احتفال مميزة على متن الطائرة، نشاركك فيها الفرح مع كعكة لذيذة وطاقمنا الذي يخلق أجواء دافئة وخاصة لعيد ميلادك",
      imageAlt: "كعكة عيد ميلاد على صينية",
    },
    pair: [
      { id: "special", image: "special.png", title: "يومك المميز يستحق الاحتفال", description: "سواء كنت تسافر وحدك أو مع من تحب، سيجعل احتفال عيد ميلادك يومك أكثر تميزاً، لتستمتع بالفرح والذكريات الجميلة معاً أثناء الرحلة.", imageAlt: "احتفال بعيد ميلاد" },
      { id: "little", image: "little.png", title: "لحظات سعيدة للمسافرين الصغار", description: "نحتفل بيوم طفلك المميز بلحظات مبهجة تجعل رحلته أكثر تذكراً وسحراً.", imageAlt: "طفل مسافر" },
    ],
    promo: {
      title: "ألعاب للمسافرين الصغار",
      description: "أبقِ أطفالك منشغلين ومستمتعين طوال الرحلة مع حقائب الأنشطة المجانية.",
      buttonLabel: "استكشف ألعاب الأطفال",
      imageAlt: "حقائب أنشطة للأطفال",
    },
    faqsTitle: "الأسئلة الشائعة",
    browseLabel: "تصفّح الأسئلة الشائعة",
    faqs: FAQS_AR,
    terms: TERMS_AR,
    cardsTitle: "المزيد لجعل رحلتك مميزة",
    learnMore: "اعرف المزيد",
    cards: [
      { id: "entertainment", image: "entertainment.png", title: "نظام الترفيه", description: "استكشف نظام الترفيه على متن الطائرة مع الأفلام والموسيقى والمزيد لكل مقعد", href: HUB, imageAlt: "الترفيه على متن الطائرة" },
      { id: "meals", image: "meals.png", title: "الوجبات على متن الطائرة", description: "تصفّح خيارات الوجبات على متن الطائرة واطلب أطباقك المفضلة مسبقاً لتجربة طعام ممتعة أثناء الرحلة.", href: HUB, imageAlt: "وجبة تُقدَّم على متن الطائرة" },
      { id: "magazine", image: "magazine.png", title: "مجلة مرحبا", description: "استمتع بقراءة مجموعة مختارة من المقالات عن السفر الدولي والأعمال والسياحة.", href: MAGAZINE, imageAlt: "مجلة مرحبا" },
    ],
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", HUB, ""];
  return [
    {
      type: "breadcrumbs",
      style: CRUMBS_STYLE,
      content: { items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })), separator: "/", ariaLabel: copy.ariaLabel, links: [] },
    },
    {
      type: "page-media-hero",
      style: HERO_STYLE,
      content: { title: copy.hero.title, subtitle: copy.hero.subtitle, imageUrl: `${MEDIA}/hero.png`, imageAlt: copy.hero.imageAlt, buttonLabel: "", buttonHref: "", slides: [], links: [] },
    },
    {
      type: "seat-journey",
      style: JOURNEY_STYLE,
      content: { title: copy.journey.title, description: copy.journey.description, imageUrl: `${MEDIA}/cake.png`, imageAlt: copy.journey.imageAlt, buttonLabel: "", buttonHref: "", buttonIcon: "ArrowRight", links: [] },
    },
    {
      type: "split-cards",
      style: PAIR_STYLE,
      content: {
        title: "",
        subtitle: "",
        items: copy.pair.map((item) => ({ id: item.id, imageUrl: `${MEDIA}/${item.image}`, imageAlt: item.imageAlt, title: item.title, description: item.description, cta: "", href: "", icon: "" })),
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
        buttonHref: HUB,
        imageUrl: `${MEDIA}/toys.png`,
        imageAlt: copy.promo.imageAlt,
        ctaButton: { content: copy.promo.buttonLabel, href: HUB },
        image: { fileUrl: `${MEDIA}/toys.png`, alt: copy.promo.imageAlt },
        links: [],
      },
    },
    {
      type: "faqs",
      style: FAQS_STYLE,
      content: { title: copy.faqsTitle, browseLabel: copy.browseLabel, browseHref: "/help/faqs", items: copy.faqs, links: [] },
    },
    {
      type: "info-accordion",
      style: TERMS_STYLE,
      content: { items: copy.terms.map((item) => ({ ...item, defaultOpen: true })), links: [] },
    },
    {
      type: "airport-service-cards",
      style: CARDS_STYLE,
      content: {
        title: copy.cardsTitle,
        subtitle: "",
        items: copy.cards.map((item) => ({ id: item.id, imageUrl: `${MEDIA}/${item.image}`, imageAlt: item.imageAlt, title: item.title, description: item.description, cta: copy.learnMore, href: item.href, icon: "ArrowRight" })),
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
  const args = ["-sS", "-X", method, `${url}${path}${qs}`, "-H", `apikey: ${key}`, "-H", `Content-Type: ${contentType || "application/json"}`];
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

console.log("Target project:", url);
const auth = curl("POST", "/auth/v1/token", { query: "grant_type=password", body: { email, password } });
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
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
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
        label: "Birthday Onboard",
        description: "Celebrate a birthday on board with cake and a warm welcome from the crew",
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
    console.log(`kept ${lang} (${links.length} blocks)`);
    continue;
  }
  const blocks = buildBlocks(lang);
  for (let position = 0; position < blocks.length; position += 1) {
    const block = blocks[position];
    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: { type: block.type, position, style: { [lang]: block.style }, content: { [lang]: block.content } },
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

console.log("Done. Open /en/travel-experience/on-board/birthday-onboard");
