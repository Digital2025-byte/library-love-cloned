/**
 * Seeds payment-methods from Figma 40502:24283.
 * URL: /travel-experience/before-you-fly/payment-methods
 *
 *   node scripts/apply-payment-methods-page.mjs
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
const PAGE_SLUG = "payment-methods";
const FOLDER = "payment-methods";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/payment-methods");
const PAGE = "/travel-experience/before-you-fly/payment-methods";
const PARENT = "/travel-experience/before-you-fly";
const OFFICES = "/help/contact-us/our-offices";
const KIDS = "/travel-experience/on-board/kids-toys";
const ONBOARD = "/travel-experience/on-board";

const UPLOADS = [
  ["hero.png", "image/png"],
  ["cash.svg", "image/svg+xml"],
  ["card.svg", "image/svg+xml"],
  ["visa.svg", "image/svg+xml"],
  ["miles.png", "image/png"],
  ["google-pay.svg", "image/svg+xml"],
  ["apple.svg", "image/svg+xml"],
  ["stripe.svg", "image/svg+xml"],
  ["mastercard.svg", "image/svg+xml"],
  ["amex.svg", "image/svg+xml"],
  ["tabby.png", "image/png"],
  ["sales.png", "image/png"],
  ["kids.png", "image/png"],
  ["onboard.png", "image/png"],
];

const text = (colorKey, color, weight) => {
  const weightKey = colorKey.endsWith("Color") ? colorKey.replace(/Color$/, "FontWeight") : `${colorKey}FontWeight`;
  return { [colorKey]: color, [weightKey]: weight, [`${colorKey}Hover`]: color, [`${weightKey}Hover`]: weight };
};
const BACKLINKS = { showLinks: true, linkColor: "primary-1", linkHoverColor: "primary-2", linkFontWeight: "semibold", linkUnderline: "always", linkItalic: false };
const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };
const CRUMBS_STYLE = { ...LAYOUT, ...text("crumbColor", "600", "medium"), crumbColorHover: "primary-1", ...text("currentColor", "primary-1", "semibold"), ...text("focusColor", "primary-1", "medium"), separatorColor: "600", crumbUnderline: false, ...BACKLINKS };
const HERO_STYLE = { layout: "cover", height: "default", titleSize: "default", contentWidth: "default", overlayWidth: "default", objectPosition: "center 30%", sectionBg: "100", showTitle: true, showSubtitle: true, showOverlay: true, showButton: false, ...text("titleColor", "primary-1", "bold"), ...text("subtitleColor", "700", "medium"), ...BACKLINKS };
const INTRO_STYLE = { ...LAYOUT, leadSize: "default", ...text("leadColor", "700", "semibold"), ...text("bodyColor", "700", "normal"), ...BACKLINKS };
const GATEWAY_STYLE = { ...LAYOUT, columns: "4", showHeader: true, cardBg: "background", ...text("titleColor", "700", "semibold"), ...text("cardTitleColor", "700", "medium"), ...text("cardDescriptionColor", "800", "normal"), ...BACKLINKS };
const PROMO_STYLE = { showTitle: true, showDescription: true, showButton: true, showSectionBg: false, showOverlay: true, sectionBg: "100", sectionPadding: "none", bannerHeight: "medium", bannerRadius: "sm", objectPosition: "center", overlayColor: "#01263B", ...text("titleColor", "50", "semibold"), ...text("descriptionColor", "50", "normal"), buttonBg: "secondary", buttonBgHover: "secondary-800", ...text("buttonText", "700", "semibold"), ...BACKLINKS };
const FAQS_STYLE = { ...LAYOUT, showTitle: true, showBrowse: true, itemGap: "default", titleAlign: "left", ...text("titleColor", "700", "semibold"), itemBg: "background", itemBorderColor: "200", itemRadius: "lg", ...text("questionColor", "700", "medium"), ...text("answerColor", "600", "normal"), iconColor: "700", browseBg: "secondary", browseHoverBg: "secondary-800", ...text("browseText", "700", "semibold"), ...BACKLINKS };
const TERMS_STYLE = { ...LAYOUT, cardBg: "background", cardRadius: "sm", dividerColor: "200", ...text("titleColor", "700", "semibold"), ...text("bodyColor", "600", "normal"), iconColor: "700", ...BACKLINKS };
const RESOURCES_STYLE = { ...LAYOUT, showHeader: true, showDescription: false, columns: "2", cardGap: "default", cardRadius: "lg", imageHeight: "xl", cardBg: "background", showCardShadow: true, showButton: true, showButtonIcon: true, buttonBg: "primary-1", buttonBgHover: "primary-800", ...text("titleColor", "700", "semibold"), ...text("cardTitleColor", "700", "semibold"), ...text("cardDescriptionColor", "700", "normal"), ...text("buttonText", "50", "semibold"), ...BACKLINKS };

const LOCAL_EN = [
  { id: "cash", image: "cash.svg", title: "Cash", description: "All Fly Cham sales offices or authorized travel agents.", imageAlt: "Cash" },
  { id: "card", image: "card.svg", title: "Debit & Credit Card", description: "All Fly Cham sales offices or authorized travel agents.", imageAlt: "Debit and credit card" },
  { id: "paymera", image: "visa.svg", title: "Paymera", description: "", imageAlt: "Paymera" },
  { id: "miles", image: "miles.png", title: "Cash and Miles", description: "Use your Cham Miles  and cash to pay and complete booking", imageAlt: "Cham Miles" },
];
const LOCAL_AR = [
  { id: "cash", image: "cash.svg", title: "نقداً", description: "جميع مكاتب مبيعات فلاي شام أو وكلاء السفر المعتمدين.", imageAlt: "نقداً" },
  { id: "card", image: "card.svg", title: "بطاقة خصم وائتمان", description: "جميع مكاتب مبيعات فلاي شام أو وكلاء السفر المعتمدين.", imageAlt: "بطاقة خصم وائتمان" },
  { id: "paymera", image: "visa.svg", title: "Paymera", description: "", imageAlt: "Paymera" },
  { id: "miles", image: "miles.png", title: "نقد وأميال", description: "استخدم أميال شام والنقد لإتمام الحجز والدفع", imageAlt: "أميال شام" },
];
const GLOBAL_EN = [
  { id: "gpay", image: "google-pay.svg", title: "Google Pay", imageAlt: "Google Pay" },
  { id: "apple", image: "apple.svg", title: "Apple Pay", imageAlt: "Apple Pay" },
  { id: "visa", image: "visa.svg", title: "Visa", imageAlt: "Visa" },
  { id: "stripe", image: "stripe.svg", title: "Stripe", imageAlt: "Stripe" },
  { id: "mastercard", image: "mastercard.svg", title: "Mastercard", imageAlt: "Mastercard" },
  { id: "amex", image: "amex.svg", title: "American Express", imageAlt: "American Express" },
  { id: "tabby", image: "tabby.png", title: "Tabby", imageAlt: "Tabby" },
  { id: "gpay-2", image: "google-pay.svg", title: "Google Pay", imageAlt: "Google Pay" },
];
const GLOBAL_AR = GLOBAL_EN.map((item) => ({ ...item, title: item.title, description: "" }));

const FAQS_EN = [
  { question: "Who is eligible for the in-flight oxygen service?", answer: "Passengers who need supplemental oxygen in flight can request the service when a recent medical report confirms they are fit to travel." },
  { question: "What is the oxygen flow rate provided on board?", answer: "The flow rate follows the medical report you submit and the equipment approved for the flight." },
  { question: "Can I bring my own portable oxygen concentrator (POC)?", answer: "Yes, when the device is an approved portable oxygen concentrator and you tell Fly Cham at least 48 hours before departure." },
  { question: "Is there an additional charge for the oxygen service?", answer: "A charge may apply. The sales office confirms the fee when you submit the request." },
];
const FAQS_AR = [
  { question: "من المؤهل لخدمة الأكسجين على متن الطائرة؟", answer: "يمكن للركاب الذين يحتاجون إلى أكسجين إضافي أثناء الرحلة طلب الخدمة عندما يؤكد تقرير طبي حديث أنهم لائقون للسفر." },
  { question: "ما معدل تدفق الأكسجين المتوفر على متن الطائرة؟", answer: "يتبع معدل التدفق التقرير الطبي الذي تقدمه والمعدات المعتمدة للرحلة." },
  { question: "هل يمكنني إحضار جهاز تركيز الأكسجين المحمول الخاص بي؟", answer: "نعم، عندما يكون الجهاز معتمداً وتبلغ فلاي شام قبل 48 ساعة على الأقل من المغادرة." },
  { question: "هل هناك رسوم إضافية على خدمة الأكسجين؟", answer: "قد تُطبَّق رسوم. يؤكد مكتب المبيعات الرسوم عند تقديم الطلب." },
];
const TERMS_EN = [
  { id: "terms", title: "Oxygen Service Terms and Conditions", body: "Fly Cham reserves the right to reassign the passenger's seat for the oxygen cylinder service in accordance with applicable safety standards and procedures for such cases." },
  { id: "availability", title: "Service Availability", body: "The in-flight oxygen service is available on selected Fly Cham routes. Availability may be subject to aircraft type and route. Please confirm availability when submitting your service request at least 48 hours before departure." },
];
const TERMS_AR = [
  { id: "terms", title: "شروط وأحكام خدمة الأكسجين", body: "تحتفظ فلاي شام بالحق في إعادة تعيين مقعد الراكب لخدمة أسطوانة الأكسجين وفق معايير السلامة والإجراءات المعتمدة لهذه الحالات." },
  { id: "availability", title: "توفر الخدمة", body: "تتوفر خدمة الأكسجين على متن الطائرة على مسارات مختارة من فلاي شام. قد يخضع التوفر لنوع الطائرة والمسار. يرجى تأكيد التوفر عند تقديم طلب الخدمة قبل 48 ساعة على الأقل من المغادرة." },
];
const LEFTOVER_DESC = "Check the list of restricted and prohibited items to stay safe and compliant with international aviation regulations.";
const LEFTOVER_DESC_AR = "راجع قائمة المواد المقيدة والمحظورة للبقاء آمناً ومتوافقاً مع لوائح الطيران الدولية.";

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Before You Fly", "Payment Methods"],
    aria: "Breadcrumb",
    hero: { title: "Payment Methods", subtitle: "Flexible and Secure Payment Options for Your Bookings", imageAlt: "A passenger paying with a card" },
    intro: "Learn about the secure and easy payment options for your bookings with Cham Wings Airlines through our website, and choose the payment method that suits you from a variety of payment methods. These include paying for tickets in cash, redeeming miles through the Cham Miles loyalty program, using a bank card at our sales offices, using electronic payment, or using the network of service providers.",
    localTitle: "Local payment Gateway",
    local: LOCAL_EN,
    globalTitle: "Global payment Gateway",
    global: GLOBAL_EN,
    promo: { title: "Explore our sales office", description: "where we share the joy with you over a delicious cake and our crew, who create a warm and special atmosphere for your birthday", button: "Discover sales office", imageAlt: "A sales agent with a headset" },
    faqsTitle: "Frequently Asked Questions",
    browse: "Browse all FAQs",
    faqs: FAQS_EN,
    terms: TERMS_EN,
    resourcesTitle: "Everything You Need to know",
    resources: [
      { id: "kids", image: "kids.png", title: "Kids toys", description: LEFTOVER_DESC, button: "Discover kids toys", href: KIDS, imageAlt: "Children's toys" },
      { id: "onboard", image: "onboard.png", title: "Check onboard experience", description: LEFTOVER_DESC, button: "Explore onboard experience", href: ONBOARD, imageAlt: "The onboard cabin" },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "قبل السفر", "طرق الدفع"],
    aria: "مسار التنقل",
    hero: { title: "طرق الدفع", subtitle: "خيارات دفع مرنة وآمنة لحجوزاتك", imageAlt: "راكبة تدفع ببطاقة" },
    intro: "تعرّف على خيارات الدفع الآمنة والسهلة لحجوزاتك مع خطوط أجنحة الشام عبر موقعنا، واختر طريقة الدفع التي تناسبك. تشمل الدفع نقداً عن التذاكر، واستبدال الأميال عبر برنامج ولاء أميال شام، واستخدام بطاقة مصرفية في مكاتب المبيعات، والدفع الإلكتروني، أو شبكة مزودي الخدمة.",
    localTitle: "بوابة الدفع المحلية",
    local: LOCAL_AR,
    globalTitle: "بوابة الدفع العالمية",
    global: GLOBAL_AR,
    promo: { title: "استكشف مكاتب المبيعات", description: "حيث نشارككم الفرحة بكعكة لذيذة وطاقمنا الذي يخلق أجواء دافئة وخاصة لعيد ميلادكم", button: "اكتشف مكاتب المبيعات", imageAlt: "موظفة مبيعات بسماعة رأس" },
    faqsTitle: "الأسئلة الشائعة",
    browse: "تصفّح كل الأسئلة الشائعة",
    faqs: FAQS_AR,
    terms: TERMS_AR,
    resourcesTitle: "كل ما تحتاج إلى معرفته",
    resources: [
      { id: "kids", image: "kids.png", title: "ألعاب الأطفال", description: LEFTOVER_DESC_AR, button: "اكتشف ألعاب الأطفال", href: KIDS, imageAlt: "ألعاب أطفال" },
      { id: "onboard", image: "onboard.png", title: "تعرّف على تجربة الرحلة", description: LEFTOVER_DESC_AR, button: "استكشف تجربة الرحلة", href: ONBOARD, imageAlt: "مقصورة الطائرة" },
    ],
  },
};

function gatewayItems(items) {
  return items.map((item) => ({
    id: item.id,
    imageUrl: `${MEDIA}/${item.image}`,
    imageAlt: item.imageAlt,
    title: item.title,
    description: item.description || "",
    href: "",
  }));
}

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", PARENT, ""];
  const promoImage = `${MEDIA}/sales.png`;
  return [
    { type: "breadcrumbs", style: CRUMBS_STYLE, content: { items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })), separator: "/", ariaLabel: copy.aria, links: [] } },
    { type: "page-media-hero", style: HERO_STYLE, content: { title: copy.hero.title, subtitle: copy.hero.subtitle, imageUrl: `${MEDIA}/hero.png`, imageAlt: copy.hero.imageAlt, buttonLabel: "", buttonHref: "", slides: [], links: [] } },
    { type: "page-intro", style: INTRO_STYLE, content: { lead: "", body: copy.intro, imageUrl: "", imageAlt: "", links: [] } },
    { type: "gateway-cards", style: GATEWAY_STYLE, content: { title: copy.localTitle, items: gatewayItems(copy.local), links: [] } },
    { type: "gateway-cards", style: GATEWAY_STYLE, content: { title: copy.globalTitle, items: gatewayItems(copy.global), links: [] } },
    { type: "promo-banner", style: PROMO_STYLE, content: { title: copy.promo.title, description: copy.promo.description, buttonLabel: copy.promo.button, buttonHref: OFFICES, ctaButton: { content: copy.promo.button, href: OFFICES }, imageUrl: promoImage, imageAlt: copy.promo.imageAlt, image: { fileUrl: promoImage, alt: copy.promo.imageAlt }, links: [] } },
    { type: "faqs", style: FAQS_STYLE, content: { title: copy.faqsTitle, browseLabel: copy.browse, browseHref: "/help/faqs", items: copy.faqs, links: [] } },
    { type: "info-accordion", style: TERMS_STYLE, content: { items: copy.terms.map((item) => ({ ...item, defaultOpen: true })), links: [] } },
    { type: "baggage-resource-cards", style: RESOURCES_STYLE, content: { title: copy.resourcesTitle, description: "", items: copy.resources.map((item) => ({ id: item.id, imageUrl: `${MEDIA}/${item.image}`, imageAlt: item.imageAlt, title: item.title, description: item.description, buttonLabel: item.button, href: item.href, buttonIcon: "ArrowRight" })), links: [] } },
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
  try { stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 40_000_000 }); }
  finally { if (dir) rmSync(dir, { recursive: true, force: true }); }
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try { return JSON.parse(trimmed); }
  catch { throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`); }
}
function retarget(node) {
  if (Array.isArray(node)) { node.forEach(retarget); return; }
  if (!node || typeof node !== "object") return;
  if (node.id === "paymentMethods" && (node.href === PARENT || node.href === "/help" || node.href === "/")) node.href = PAGE;
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
  { id: "gateway-cards", label: "Gateway Cards" },
  { id: "promo-banner", label: "Promo Banner" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
  { id: "baggage-resource-cards", label: "Baggage Resource Cards" },
]) {
  const res = curl("POST", "/rest/v1/component_types", { token, query: "on_conflict=id", prefer: "resolution=merge-duplicates,return=minimal", body: row });
  if (res?.message) { console.error("component_types upsert failed:", restError(res, "unknown error")); process.exit(1); }
  console.log("component_types ok:", row.id);
}
for (const [name, contentType] of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, { token, file: resolve(ASSETS, name), contentType, headers: ["x-upsert: true", "Cache-Control: max-age=3600"] });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) { console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res))); process.exit(1); }
  console.log("image uploaded:", `${FOLDER}/${name}`);
}
let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
  if (!Array.isArray(existing)) { console.error("pages lookup failed:", restError(existing, "unknown error")); process.exit(1); }
  if (existing[0]?.id) pageId = existing[0].id;
  else {
    const inserted = curl("POST", "/rest/v1/pages", { token, prefer: "return=representation", body: { slug: PAGE_SLUG, label: "Payment Methods", description: "Flexible and secure payment options for Fly Cham bookings", status: "published" } });
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
  const parents = curl("GET", "/rest/v1/pages", { token, query: "slug=eq.before-you-fly&select=id" });
  const parentId = Array.isArray(parents) ? parents[0]?.id : null;
  if (parentId) {
    const links = curl("GET", "/rest/v1/page_components", { token, query: `page_id=eq.${parentId}&select=component_id` });
    const seen = new Set();
    for (const link of Array.isArray(links) ? links : []) {
      if (!link?.component_id || seen.has(link.component_id)) continue;
      seen.add(link.component_id);
      const rows = curl("GET", "/rest/v1/components", { token, query: `id=eq.${link.component_id}&select=id,content` });
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!row?.content) continue;
      const before = JSON.stringify(row.content);
      retarget(row.content);
      if (JSON.stringify(row.content) === before) continue;
      const res = curl("PATCH", "/rest/v1/components", { token, query: `id=eq.${row.id}`, prefer: "return=minimal", body: { content: row.content } });
      if (res?.message) console.error("before-you-fly link update failed", restError(res, ""));
      else console.log("before-you-fly payment link updated", row.id);
    }
  }
}
console.log("done", PAGE_SLUG, pageId);
