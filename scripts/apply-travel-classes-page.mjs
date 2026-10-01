/**
 * Seeds travel-classes from Figma 40426:10291.
 * URL: /travel-experience/on-board/travel-classes
 *
 *   node scripts/apply-travel-classes-page.mjs
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
const PAGE_SLUG = "travel-classes";
const FOLDER = "travel-classes";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/travel-classes");
const PAGE = "/travel-experience/on-board/travel-classes";
const MEALS = "/travel-experience/on-board/meals-onboard";
const HUB = "/travel-experience/on-board";
const OLD = "/travel-experience/onboard";
const UPLOADS = ["hero.png", "economy.png", "business.png", "meals.png", "wifi.png"];

const text = (colorKey, color, weight) => {
  const weightKey = colorKey.endsWith("Color") ? colorKey.replace(/Color$/, "FontWeight") : `${colorKey}FontWeight`;
  return { [colorKey]: color, [weightKey]: weight, [`${colorKey}Hover`]: color, [`${weightKey}Hover`]: weight };
};
const BACKLINKS = { showLinks: true, linkColor: "primary-1", linkHoverColor: "primary-2", linkFontWeight: "semibold", linkUnderline: "always", linkItalic: false };
const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };
const CRUMBS_STYLE = { ...LAYOUT, ...text("crumbColor", "600", "medium"), crumbColorHover: "primary-1", ...text("currentColor", "primary-1", "semibold"), ...text("focusColor", "primary-1", "medium"), separatorColor: "600", crumbUnderline: false, ...BACKLINKS };
const HERO_STYLE = { layout: "cover", height: "default", titleSize: "default", contentWidth: "narrow", overlayWidth: "default", objectPosition: "center", sectionBg: "100", showTitle: true, showSubtitle: true, showOverlay: true, showButton: false, ...text("titleColor", "primary-1", "bold"), ...text("subtitleColor", "700", "medium"), ...BACKLINKS };
const INTRO_STYLE = { ...LAYOUT, leadSize: "lg", ...text("leadColor", "700", "medium"), ...text("bodyColor", "700", "normal"), ...BACKLINKS };
const PANEL = { showEyebrow: true, iconColor: "700", ...text("eyebrowColor", "primary-1", "medium"), ...text("titleColor", "700", "semibold"), ...text("descriptionColor", "700", "normal"), ...text("cardTitleColor", "700", "medium"), ...text("cardDescriptionColor", "700", "medium"), ...BACKLINKS };
const ECONOMY_STYLE = { ...PANEL, imageSide: "left", tileColumns: "4" };
const BUSINESS_STYLE = { ...PANEL, imageSide: "right", tileColumns: "5" };
const FAQS_STYLE = { ...LAYOUT, showTitle: true, showBrowse: true, itemGap: "default", titleAlign: "left", ...text("titleColor", "700", "semibold"), itemBg: "background", itemBorderColor: "200", itemRadius: "lg", ...text("questionColor", "700", "medium"), ...text("answerColor", "600", "normal"), iconColor: "700", browseBg: "secondary", browseHoverBg: "secondary-800", ...text("browseText", "700", "semibold"), ...BACKLINKS };
const TERMS_STYLE = { ...LAYOUT, cardBg: "background", cardRadius: "sm", dividerColor: "200", ...text("titleColor", "700", "semibold"), ...text("bodyColor", "600", "normal"), iconColor: "700", ...BACKLINKS };
const CARDS_STYLE = { ...LAYOUT, showHeader: true, showTitle: true, showSubtitle: false, headerAlign: "start", columns: "2", cardGap: "default", cardRadius: "lg", imageHeight: "xl", ...text("titleColor", "700", "semibold"), cardBg: "background", showCardShadow: true, ...text("cardTitleColor", "700", "semibold"), ...text("cardDescriptionColor", "700", "normal"), showLink: true, showLinkIcon: true, learnMoreColor: "primary-1", learnMoreFontWeight: "semibold", learnMoreColorHover: "50", learnMoreFontWeightHover: "semibold", arrowBadgeBg: "primary-1", arrowColor: "50", ...BACKLINKS };

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
    crumbs: ["Home", "Travel experience", "Onboard", "Travel Classes"],
    aria: "Breadcrumb",
    hero: { title: "Travel Classes", subtitle: "Each Travel Class is Special", imageAlt: "An aircraft cabin" },
    intro: {
      lead: "A unique travel experience aboard our flights, rich with our warm hospitality and authenticity",
      body: "Discover our specially designed travel classes to provide you with comfort and luxury, and find what suits your needs, from Economy Class to Business Class for a more luxurious journey. We will take care of every detail of your journey with us to provide you with an unforgettable travel experience.",
    },
    economy: {
      eyebrow: "Economy Class",
      title: "Comfort That Suits You",
      description: "Travel comfortably in Economy Class, with a variety of in-flight entertainment to make your journey more enjoyable. Guest services include snacks and refreshing beverages, as well as a convenient baggage allowance of up to 30 kg for checked baggage and 7 kg for hand luggage.",
      imageAlt: "A parent and child seated in economy",
      items: [
        { id: "checked", icon: "SuitcaseRolling", title: "30 kg", description: "Checked baggage" },
        { id: "hand", icon: "Tote", title: "7 kg", description: "Hand luggage" },
        { id: "screen", icon: "Monitor", title: "In-flight", description: "entertainment" },
        { id: "meal", icon: "ForkKnife", title: "Standard Meal", description: "" },
      ],
    },
    business: {
      eyebrow: "Business Class",
      title: "For a Flight Full of Luxury",
      description: "Enjoy luxury and elegance throughout your journey with Business Class, which offers you a range of benefits to enhance your travel experience, including:\n- Additional weight of up to 40 kg, in addition to 7 kg for hand luggage.",
      imageAlt: "A business class seat",
      items: [
        { id: "checked", icon: "SuitcaseRolling", title: "Up to 40 kg", description: "Checked baggage" },
        { id: "hand", icon: "Tote", title: "7 kg", description: "Hand luggage" },
        { id: "meal", icon: "ForkKnife", title: "Premium Meal", description: "" },
        { id: "lounge", icon: "Armchair", title: "Free Lounges", description: "" },
        { id: "car", icon: "Car", title: "Free limousine", description: "" },
      ],
    },
    faqsTitle: "Frequently Asked Questions",
    browse: "Browse FAQs",
    faqs: FAQS_EN,
    terms: TERMS_EN,
    cardsTitle: "Services Elevate Your Experience",
    learnMore: "Learn More",
    cards: [
      { id: "meals", image: "meals.png", title: "Meals Onboard", description: "Enjoy a curated selection of gourmet meals and beverages served fresh during your flight.", href: MEALS, imageAlt: "A meal served on board" },
      { id: "wifi", image: "wifi.png", title: "Onboard Wi-Fi", description: "Stay connected at 35,000 feet with our fast and reliable in-flight Wi-Fi service.", href: HUB, imageAlt: "A passenger using a phone on board" },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "على متن الطائرة", "درجات السفر"],
    aria: "مسار التنقل",
    hero: { title: "درجات السفر", subtitle: "كل درجة سفر مميزة", imageAlt: "مقصورة الطائرة" },
    intro: {
      lead: "تجربة سفر فريدة على متن رحلاتنا، غنية بضيافتنا الدافئة وأصالتنا",
      body: "اكتشف درجات السفر المصممة خصيصاً لتمنحك الراحة والفخامة، واختر ما يناسب احتياجاتك، من الدرجة السياحية إلى درجة الأعمال لرحلة أكثر فخامة. سنهتم بكل تفصيل في رحلتك معنا لنمنحك تجربة سفر لا تُنسى.",
    },
    economy: {
      eyebrow: "الدرجة السياحية",
      title: "راحة تناسبك",
      description: "سافر براحة في الدرجة السياحية، مع مجموعة من وسائل الترفيه على متن الطائرة لجعل رحلتك أكثر متعة. تشمل خدمات الضيوف الوجبات الخفيفة والمشروبات المنعشة، إضافة إلى سماحية أمتعة مريحة تصل إلى 30 كغ للأمتعة المسجّلة و7 كغ لحقيبة اليد.",
      imageAlt: "والد وطفل في مقاعد الدرجة السياحية",
      items: [
        { id: "checked", icon: "SuitcaseRolling", title: "30 كغ", description: "أمتعة مسجّلة" },
        { id: "hand", icon: "Tote", title: "7 كغ", description: "حقيبة يد" },
        { id: "screen", icon: "Monitor", title: "على متن الطائرة", description: "الترفيه" },
        { id: "meal", icon: "ForkKnife", title: "وجبة عادية", description: "" },
      ],
    },
    business: {
      eyebrow: "درجة الأعمال",
      title: "لرحلة مليئة بالفخامة",
      description: "استمتع بالفخامة والأناقة طوال رحلتك مع درجة الأعمال، التي تمنحك مجموعة من المزايا لتعزيز تجربة سفرك، منها:\n- وزن إضافي يصل إلى 40 كغ، إضافة إلى 7 كغ لحقيبة اليد.",
      imageAlt: "مقعد درجة الأعمال",
      items: [
        { id: "checked", icon: "SuitcaseRolling", title: "حتى 40 كغ", description: "أمتعة مسجّلة" },
        { id: "hand", icon: "Tote", title: "7 كغ", description: "حقيبة يد" },
        { id: "meal", icon: "ForkKnife", title: "وجبة فاخرة", description: "" },
        { id: "lounge", icon: "Armchair", title: "صالات مجانية", description: "" },
        { id: "car", icon: "Car", title: "ليموزين مجاني", description: "" },
      ],
    },
    faqsTitle: "الأسئلة الشائعة",
    browse: "تصفّح الأسئلة الشائعة",
    faqs: FAQS_AR,
    terms: TERMS_AR,
    cardsTitle: "خدمات ترتقي بتجربتك",
    learnMore: "اعرف المزيد",
    cards: [
      { id: "meals", image: "meals.png", title: "الوجبات على متن الطائرة", description: "استمتع بتشكيلة منتقاة من الوجبات والمشروبات الفاخرة التي تُقدَّم طازجة أثناء رحلتك.", href: MEALS, imageAlt: "وجبة تُقدَّم على متن الطائرة" },
      { id: "wifi", image: "wifi.png", title: "واي فاي على المتن", description: "ابقَ على اتصال على ارتفاع 35,000 قدم مع خدمة واي فاي سريعة وموثوقة على متن الطائرة.", href: HUB, imageAlt: "راكب يستخدم هاتفاً على متن الطائرة" },
    ],
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", HUB, ""];
  const panel = (block, image) => ({
    eyebrow: block.eyebrow,
    title: block.title,
    description: block.description,
    imageUrl: `${MEDIA}/${image}`,
    imageAlt: block.imageAlt,
    items: block.items.map((item) => ({ ...item, href: "" })),
    links: [],
  });
  return [
    { type: "breadcrumbs", style: CRUMBS_STYLE, content: { items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })), separator: "/", ariaLabel: copy.aria, links: [] } },
    { type: "page-media-hero", style: HERO_STYLE, content: { title: copy.hero.title, subtitle: copy.hero.subtitle, imageUrl: `${MEDIA}/hero.png`, imageAlt: copy.hero.imageAlt, buttonLabel: "", buttonHref: "", slides: [], links: [] } },
    { type: "page-intro", style: INTRO_STYLE, content: { lead: copy.intro.lead, body: copy.intro.body, links: [] } },
    { type: "class-panel", style: ECONOMY_STYLE, content: panel(copy.economy, "economy.png") },
    { type: "class-panel", style: BUSINESS_STYLE, content: panel(copy.business, "business.png") },
    { type: "faqs", style: FAQS_STYLE, content: { title: copy.faqsTitle, browseLabel: copy.browse, browseHref: "/help/faqs", items: copy.faqs, links: [] } },
    { type: "info-accordion", style: TERMS_STYLE, content: { items: copy.terms.map((item) => ({ ...item, defaultOpen: true })), links: [] } },
    { type: "airport-service-cards", style: CARDS_STYLE, content: { title: copy.cardsTitle, subtitle: "", items: copy.cards.map((item) => ({ id: item.id, imageUrl: `${MEDIA}/${item.image}`, imageAlt: item.imageAlt, title: item.title, description: item.description, cta: copy.learnMore, href: item.href, icon: "ArrowRight" })), links: [] } },
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
  try { stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 20_000_000 }); }
  finally { if (dir) rmSync(dir, { recursive: true, force: true }); }
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try { return JSON.parse(trimmed); }
  catch { throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`); }
}
function retarget(node) {
  if (Array.isArray(node)) { node.forEach(retarget); return; }
  if (!node || typeof node !== "object") return;
  const hubish = node.href === HUB || node.href === OLD;
  if (hubish && (node.id === "meals" || node.key === "mealService")) node.href = MEALS;
  if (hubish && (node.id === "travelClasses" || node.id === "classes")) node.href = PAGE;
  Object.values(node).forEach(retarget);
}

console.log("Target project:", url);
const auth = curl("POST", "/auth/v1/token", { query: "grant_type=password", body: { email, password } });
if (!auth?.access_token) { console.error("Sign-in failed:", restError(auth, "no access_token")); process.exit(1); }
const token = auth.access_token;
for (const row of [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "page-intro", label: "Page Intro" },
  { id: "class-panel", label: "Class Panel" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
  { id: "airport-service-cards", label: "Airport Service Cards" },
]) {
  const res = curl("POST", "/rest/v1/component_types", { token, query: "on_conflict=id", prefer: "resolution=merge-duplicates,return=minimal", body: row });
  if (res?.message) { console.error("component_types upsert failed:", restError(res, "unknown error")); process.exit(1); }
  console.log("component_types ok:", row.id);
}
for (const name of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, { token, file: resolve(ASSETS, name), contentType: "image/png", headers: ["x-upsert: true", "Cache-Control: max-age=3600"] });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) { console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res))); process.exit(1); }
  console.log("image uploaded:", `${FOLDER}/${name}`);
}
let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
  if (!Array.isArray(existing)) { console.error("pages lookup failed:", restError(existing, "unknown error")); process.exit(1); }
  if (existing[0]?.id) pageId = existing[0].id;
  else {
    const inserted = curl("POST", "/rest/v1/pages", { token, prefer: "return=representation", body: { slug: PAGE_SLUG, label: "Travel Classes", description: "Economy and business class on board", status: "published" } });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) { console.error("pages insert failed:", restError(inserted, "unknown error")); process.exit(1); }
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}
for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", { token, query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id` });
  if (!Array.isArray(links)) { console.error(`lookup failed (${lang})`); process.exit(1); }
  if (links.length > 0) { console.log(`kept ${lang} (${links.length} blocks)`); continue; }
  const blocks = buildBlocks(lang);
  for (let position = 0; position < blocks.length; position += 1) {
    const block = blocks[position];
    const inserted = curl("POST", "/rest/v1/components", { token, prefer: "return=representation", body: { type: block.type, position, style: { [lang]: block.style }, content: { [lang]: block.content } } });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) { console.error(`components insert failed (${lang} ${block.type})`, restError(inserted, "")); process.exit(1); }
    const link = curl("POST", "/rest/v1/page_components", { token, prefer: "return=minimal", body: { page_id: pageId, component_id: comp.id, position, lang } });
    if (link?.message) { console.error(restError(link, "")); process.exit(1); }
    console.log(`seeded ${block.type} (${lang}) @${position}`);
  }
}
{
  const rows = curl("GET", "/rest/v1/site_header", { token, query: "select=lang,data,version" });
  if (Array.isArray(rows)) {
    for (const row of rows) {
      const before = JSON.stringify(row.data);
      retarget(row.data);
      if (JSON.stringify(row.data) === before) continue;
      const res = curl("PATCH", "/rest/v1/site_header", { token, query: `lang=eq.${row.lang}`, prefer: "return=minimal", body: { data: row.data, version: Number(row.version || 1) + 1 } });
      if (res?.message) console.error("header update failed", restError(res, ""));
      else console.log("header updated", row.lang);
    }
  }
}
{
  const pages = curl("GET", "/rest/v1/pages", { token, query: "slug=in.(on-board,vip-boarding,help)&select=id,slug" });
  if (Array.isArray(pages)) {
    for (const page of pages) {
      const links = curl("GET", "/rest/v1/page_components", { token, query: `page_id=eq.${page.id}&select=component_id,components(id,content)` });
      if (!Array.isArray(links)) continue;
      for (const link of links) {
        const component = Array.isArray(link.components) ? link.components[0] : link.components;
        if (!component?.content) continue;
        const before = JSON.stringify(component.content);
        retarget(component.content);
        if (JSON.stringify(component.content) === before) continue;
        const res = curl("PATCH", "/rest/v1/components", { token, query: `id=eq.${component.id}`, prefer: "return=minimal", body: { content: component.content } });
        if (res?.message) console.error("link update failed", restError(res, ""));
        else console.log("link updated", page.slug, component.id);
      }
    }
  }
}
console.log("Done. Open /en/travel-experience/on-board/travel-classes");
