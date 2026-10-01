/**
 * Seeds manage-booking from Figma 40529:12570.
 * URL: /travel-experience/before-you-fly/manage-booking
 *
 *   node scripts/apply-manage-booking-page.mjs
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
const PAGE_SLUG = "manage-booking";
const FOLDER = "manage-booking";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/manage-booking");
const PAGE = "/travel-experience/before-you-fly/manage-booking";
const PARENT = "/travel-experience/before-you-fly";
const UPLOADS = ["hero.png", "change.png", "seat.png", "baggage.png", "upgrade.png", "infant.png", "special.png", "chauffeur.png", "cancel.png"];

const text = (colorKey, color, weight) => {
  const weightKey = colorKey.endsWith("Color") ? colorKey.replace(/Color$/, "FontWeight") : `${colorKey}FontWeight`;
  return { [colorKey]: color, [weightKey]: weight, [`${colorKey}Hover`]: color, [`${weightKey}Hover`]: weight };
};
const BACKLINKS = { showLinks: true, linkColor: "primary-1", linkHoverColor: "primary-2", linkFontWeight: "semibold", linkUnderline: "always", linkItalic: false };
const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };
const CRUMBS_STYLE = { ...LAYOUT, ...text("crumbColor", "600", "medium"), crumbColorHover: "primary-1", ...text("currentColor", "primary-1", "semibold"), ...text("focusColor", "primary-1", "medium"), separatorColor: "600", crumbUnderline: false, ...BACKLINKS };
const HERO_STYLE = { layout: "cover", height: "default", titleSize: "default", contentWidth: "default", overlayWidth: "default", objectPosition: "center top", sectionBg: "100", showTitle: true, showSubtitle: true, showOverlay: true, showButton: false, ...text("titleColor", "primary-1", "bold"), ...text("subtitleColor", "700", "medium"), ...BACKLINKS };
const INTRO_STYLE = { ...LAYOUT, leadSize: "default", ...text("leadColor", "700", "semibold"), ...text("bodyColor", "700", "normal"), ...BACKLINKS };
const LOOKUP_STYLE = { ...LAYOUT, showTitle: true, showHelp: true, showButton: true, cardBg: "background", fieldBg: "100", iconColor: "800", submitBg: "secondary", ...text("titleColor", "secondary-2", "semibold"), ...text("labelColor", "800", "medium"), ...text("helpTitleColor", "primary-1", "medium"), ...text("buttonColor", "700", "semibold"), ...BACKLINKS };
const CARDS_STYLE = { ...LAYOUT, columns: "4", headerAlign: "start", cardRadius: "xl", showHeader: true, showSubtitle: true, iconColor: "50", ...text("titleColor", "800", "semibold"), ...text("subtitleColor", "700", "normal"), ...text("cardTitleColor", "50", "semibold"), ...text("cardDescriptionColor", "50", "normal"), ...BACKLINKS };
const FAQS_STYLE = { ...LAYOUT, showTitle: true, showBrowse: true, itemGap: "default", titleAlign: "left", ...text("titleColor", "700", "semibold"), itemBg: "background", itemBorderColor: "200", itemRadius: "lg", ...text("questionColor", "700", "medium"), ...text("answerColor", "600", "normal"), iconColor: "700", browseBg: "secondary", browseHoverBg: "secondary-800", ...text("browseText", "700", "semibold"), ...BACKLINKS };
const TERMS_STYLE = { ...LAYOUT, cardBg: "background", cardRadius: "sm", dividerColor: "200", ...text("titleColor", "700", "semibold"), ...text("bodyColor", "600", "normal"), iconColor: "700", ...BACKLINKS };

const FAQS_EN = [
  { question: "How can I view or manage my booking online?", answer: "Enter your reservation number and last name on this page, then search. Your itinerary opens on flycham.com, where you can review the trip and the changes your fare allows." },
  { question: "Can I change my flight date or destination after booking?", answer: "Yes, when your fare allows it. Retrieve your booking and choose Change Flight to pick a new date or route. A fare difference may apply." },
  { question: "How do I cancel my booking and request a refund?", answer: "Retrieve your booking and choose Cancel Booking. Refunds follow the fare rules on your ticket, and the timing depends on how you paid." },
  { question: "Can I add special requests or extra services to my booking?", answer: "Yes. After you retrieve your booking you can add baggage, a seat, an infant, or a special service such as a wheelchair or a special meal, when the flight still allows it." },
];
const TERMS_EN = [
  { id: "terms", title: "Oxygen Service Terms and Conditions", body: "Fly Cham reserves the right to reassign the passenger's seat for the oxygen cylinder service in accordance with applicable safety standards and procedures for such cases." },
  { id: "availability", title: "Service Availability", body: "The in-flight oxygen service is available on selected Fly Cham routes. Availability may be subject to aircraft type and route. Please confirm availability when submitting your service request at least 48 hours before departure." },
];
const FAQS_AR = [
  { question: "كيف أعرض حجزي أو أديره عبر الإنترنت؟", answer: "أدخل رقم الحجز واسم العائلة في هذه الصفحة ثم ابحث. يفتح خط سيرك على flycham.com، حيث يمكنك مراجعة الرحلة والتغييرات التي تسمح بها أجرتك." },
  { question: "هل يمكنني تغيير تاريخ الرحلة أو الوجهة بعد الحجز؟", answer: "نعم، عندما تسمح أجرتك بذلك. استرجع حجزك واختر تغيير الرحلة لتحديد تاريخ أو مسار جديد. قد يُطبَّق فرق في الأجرة." },
  { question: "كيف ألغي حجزي وأطلب استرداد المبلغ؟", answer: "استرجع حجزك واختر إلغاء الحجز. يتبع الاسترداد قواعد الأجرة على تذكرتك، ويعتمد التوقيت على طريقة الدفع." },
  { question: "هل يمكنني إضافة طلبات خاصة أو خدمات إضافية إلى حجزي؟", answer: "نعم. بعد استرجاع الحجز يمكنك إضافة أمتعة أو مقعد أو رضيع أو خدمة خاصة مثل الكرسي المتحرك أو وجبة خاصة، عندما لا تزال الرحلة تسمح بذلك." },
];
const TERMS_AR = [
  { id: "terms", title: "شروط وأحكام خدمة الأكسجين", body: "تحتفظ فلاي شام بالحق في إعادة تعيين مقعد الراكب لخدمة أسطوانة الأكسجين وفق معايير السلامة والإجراءات المعتمدة لهذه الحالات." },
  { id: "availability", title: "توفر الخدمة", body: "تتوفر خدمة الأكسجين على متن الطائرة على مسارات مختارة من فلاي شام. قد يخضع التوفر لنوع الطائرة والمسار. يرجى تأكيد التوفر عند تقديم طلب الخدمة قبل 48 ساعة على الأقل من المغادرة." },
];

const CARDS_EN = [
  { id: "change", image: "change.png", icon: "", title: "Change Flight", description: "Modify your flight date, time, or route with ease.", imageAlt: "A calendar and a pen" },
  { id: "seat", image: "seat.png", icon: "", title: "Seat Selection", description: "Choose or change your preferred seat for a comfortable journey.", imageAlt: "Rows of airplane seats" },
  { id: "baggage", image: "baggage.png", icon: "", title: "Add Extra Baggage", description: "Purchase additional baggage allowance for your trip.", imageAlt: "Stacked suitcases" },
  { id: "upgrade", image: "upgrade.png", icon: "ArrowFatLinesUp", title: "Upgrade Class", description: "Elevate your travel experience by upgrading your cabin class.", imageAlt: "A business class seat" },
  { id: "infant", image: "infant.png", icon: "", title: "Add Infant", description: "Add an infant traveller to your existing booking.", imageAlt: "A family travelling together" },
  { id: "special", image: "special.png", icon: "", title: "Add Special Service", description: "Request wheelchair assistance, special meals, or other services.", imageAlt: "A passenger receiving assistance" },
  { id: "chauffeur", image: "chauffeur.png", icon: "", title: "Chauffeur Driver", description: "Book a professional chauffeur driver for a safe and luxurious ride.", imageAlt: "A chauffeur standing by a car" },
  { id: "cancel", image: "cancel.png", icon: "", title: "Cancel Booking", description: "Choose or change your preferred seat for a comfortable journey.", imageAlt: "A passenger at an airport desk" },
];
const CARDS_AR = [
  { id: "change", image: "change.png", icon: "", title: "تغيير الرحلة", description: "عدّل تاريخ رحلتك أو وقتها أو مسارها بسهولة.", imageAlt: "تقويم وقلم" },
  { id: "seat", image: "seat.png", icon: "", title: "اختيار المقعد", description: "اختر مقعدك المفضل أو غيّره لرحلة مريحة.", imageAlt: "صفوف مقاعد الطائرة" },
  { id: "baggage", image: "baggage.png", icon: "", title: "إضافة أمتعة إضافية", description: "اشترِ سماحية أمتعة إضافية لرحلتك.", imageAlt: "حقائب مكدسة" },
  { id: "upgrade", image: "upgrade.png", icon: "ArrowFatLinesUp", title: "ترقية الدرجة", description: "ارتقِ بتجربة سفرك عبر ترقية درجة المقصورة.", imageAlt: "مقعد درجة الأعمال" },
  { id: "infant", image: "infant.png", icon: "", title: "إضافة رضيع", description: "أضف مسافراً رضيعاً إلى حجزك الحالي.", imageAlt: "عائلة تسافر معاً" },
  { id: "special", image: "special.png", icon: "", title: "إضافة خدمة خاصة", description: "اطلب مساعدة الكرسي المتحرك أو وجبات خاصة أو خدمات أخرى.", imageAlt: "راكب يتلقى المساعدة" },
  { id: "chauffeur", image: "chauffeur.png", icon: "", title: "سائق خاص", description: "احجز سائقاً خاصاً لرحلة آمنة وفاخرة.", imageAlt: "سائق يقف بجانب سيارة" },
  { id: "cancel", image: "cancel.png", icon: "", title: "إلغاء الحجز", description: "اختر مقعدك المفضل أو غيّره لرحلة مريحة.", imageAlt: "راكب عند مكتب في المطار" },
];

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Before You Fly", "Manage Booking"],
    aria: "Breadcrumb",
    hero: { title: "Manage Booking", subtitle: "Manage  your flight with ease", imageAlt: "Hands typing on a laptop" },
    intro: "Need to modify your itinerary or elevate your travel experience? Simply enter your booking reference and last name to seamlessly manage your Fly Cham reservation.",
    lookup: {
      title: "Find your booking",
      pnrLabel: "Reservation number(pnr)",
      pnrPlaceholder: "ex.4XKCT2",
      lastNameLabel: "Last name",
      helpLabel: "I can’t find my Reservation number",
      buttonLabel: "Search",
    },
    cardsTitle: "What can you manage?",
    cardsSubtitle: "From seat swaps to itinerary updates, explore everything you can change, upgrade, and personalize after you've retrieved your booking.",
    cards: CARDS_EN,
    faqsTitle: "Frequently Asked Questions",
    browse: "Browse all FAQs",
    faqs: FAQS_EN,
    terms: TERMS_EN,
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "قبل السفر", "إدارة الحجز"],
    aria: "مسار التنقل",
    hero: { title: "إدارة الحجز", subtitle: "أدر رحلتك بسهولة", imageAlt: "يدان تكتبان على حاسوب محمول" },
    intro: "هل تحتاج إلى تعديل خط سيرك أو الارتقاء بتجربة سفرك؟ أدخل رقم الحجز واسم العائلة لإدارة حجز فلاي شام بسهولة.",
    lookup: {
      title: "اعثر على حجزك",
      pnrLabel: "رقم الحجز (PNR)",
      pnrPlaceholder: "مثال: 4XKCT2",
      lastNameLabel: "اسم العائلة",
      helpLabel: "لا أجد رقم الحجز",
      buttonLabel: "بحث",
    },
    cardsTitle: "ماذا يمكنك إدارته؟",
    cardsSubtitle: "من تبديل المقاعد إلى تحديث خط السير، استكشف كل ما يمكنك تغييره وترقيته وتخصيصه بعد استرجاع حجزك.",
    cards: CARDS_AR,
    faqsTitle: "الأسئلة الشائعة",
    browse: "تصفّح كل الأسئلة الشائعة",
    faqs: FAQS_AR,
    terms: TERMS_AR,
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", PARENT, ""];
  return [
    { type: "breadcrumbs", style: CRUMBS_STYLE, content: { items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })), separator: "/", ariaLabel: copy.aria, links: [] } },
    { type: "page-media-hero", style: HERO_STYLE, content: { title: copy.hero.title, subtitle: copy.hero.subtitle, imageUrl: `${MEDIA}/hero.png`, imageAlt: copy.hero.imageAlt, buttonLabel: "", buttonHref: "", slides: [], links: [] } },
    { type: "page-intro", style: INTRO_STYLE, content: { lead: "", body: copy.intro, imageUrl: "", imageAlt: "", links: [] } },
    { type: "booking-lookup", style: LOOKUP_STYLE, content: { title: copy.lookup.title, pnrLabel: copy.lookup.pnrLabel, pnrPlaceholder: copy.lookup.pnrPlaceholder, pnrIcon: "Ticket", lastNameLabel: copy.lookup.lastNameLabel, lastNamePlaceholder: "", lastNameIcon: "User", helpLabel: copy.lookup.helpLabel, helpHref: "", helpIcon: "Info", buttonLabel: copy.lookup.buttonLabel, buttonHref: "", links: [] } },
    { type: "overlay-cards", style: CARDS_STYLE, content: { title: copy.cardsTitle, subtitle: copy.cardsSubtitle, items: copy.cards.map((item) => ({ id: item.id, imageUrl: `${MEDIA}/${item.image}`, imageAlt: item.imageAlt, icon: item.icon, title: item.title, description: item.description, href: "" })), links: [] } },
    { type: "faqs", style: FAQS_STYLE, content: { title: copy.faqsTitle, browseLabel: copy.browse, browseHref: "/help/faqs", items: copy.faqs, links: [] } },
    { type: "info-accordion", style: TERMS_STYLE, content: { items: copy.terms.map((item) => ({ ...item, defaultOpen: true })), links: [] } },
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
  if (node.id === "manageBooking" && node.ctaHref === "/") node.ctaHref = PAGE;
  if (node.id === "manageBookingService" && (node.href === PARENT || node.href === "/")) node.href = PAGE;
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
  { id: "booking-lookup", label: "Booking Lookup" },
  { id: "overlay-cards", label: "Overlay Cards" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
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
    const inserted = curl("POST", "/rest/v1/pages", { token, prefer: "return=representation", body: { slug: PAGE_SLUG, label: "Manage Booking", description: "Retrieve and manage a Fly Cham reservation", status: "published" } });
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
console.log("done", PAGE_SLUG, pageId);
