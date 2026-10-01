/**
 * Seeds entertainment-system from Figma 40396:21310.
 * URL: /travel-experience/on-board/entertainment-system
 *
 *   node scripts/apply-entertainment-system-page.mjs
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
const PAGE_SLUG = "entertainment-system";
const FOLDER = "entertainment-system";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/entertainment-system");
const PAGE = "/travel-experience/on-board/entertainment-system";
const HUB = "/travel-experience/on-board";
const MAGAZINE = "/travel-experience/traveler-magazine";
const MARHABA = "/travel-experience/before-you-fly/transportation-service";
const LOUNGE = "/travel-experience/at-the-airport/business-lounge";
const UPLOADS = ["hero.png", "movies.png", "music.png", "kids.png", "connect.png", "magazine.png", "marhaba.png", "lounge.png"];

const text = (colorKey, color, weight) => {
  const weightKey = colorKey.endsWith("Color") ? colorKey.replace(/Color$/, "FontWeight") : `${colorKey}FontWeight`;
  return { [colorKey]: color, [weightKey]: weight, [`${colorKey}Hover`]: color, [`${weightKey}Hover`]: weight };
};
const BACKLINKS = { showLinks: true, linkColor: "primary-1", linkHoverColor: "primary-2", linkFontWeight: "semibold", linkUnderline: "always", linkItalic: false };
const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };
const CRUMBS_STYLE = { ...LAYOUT, ...text("crumbColor", "600", "medium"), crumbColorHover: "primary-1", ...text("currentColor", "primary-1", "semibold"), ...text("focusColor", "primary-1", "medium"), separatorColor: "600", crumbUnderline: false, ...BACKLINKS };
const HERO_STYLE = { layout: "cover", height: "default", titleSize: "default", contentWidth: "default", overlayWidth: "default", objectPosition: "center", sectionBg: "100", showTitle: true, showSubtitle: true, showOverlay: true, showButton: false, ...text("titleColor", "primary-1", "bold"), ...text("subtitleColor", "700", "medium"), ...BACKLINKS };
const CATALOG_STYLE = { ...LAYOUT, columns: "3", showHeader: true, showSubtitle: true, ...text("titleColor", "700", "semibold"), ...text("subtitleColor", "700", "normal"), ...text("cardTitleColor", "700", "semibold"), ...text("cardDescriptionColor", "600", "normal"), showLink: false, showLinkIcon: false, ...BACKLINKS };
const STEPS_STYLE = { ...LAYOUT, imageSide: "right", imageRadius: "xl", ...text("titleColor", "700", "semibold"), ...text("bodyColor", "600", "normal"), showIcon: true, iconBg: "primary-1", iconColor: "50", showStepBadge: true, badgeBg: "secondary", badgeColor: "50", showConnectors: true, connectorColor: "700", ...text("stepTitleColor", "700", "normal"), ...text("stepDescriptionColor", "700", "normal"), showLink: false, showLinkIcon: false, ...BACKLINKS };
const PROMO_STYLE = { showTitle: true, showDescription: true, showButton: true, showSectionBg: false, showOverlay: true, sectionBg: "100", sectionPadding: "none", bannerHeight: "medium", bannerRadius: "sm", objectPosition: "center", overlayColor: "#01263B", ...text("titleColor", "50", "semibold"), ...text("descriptionColor", "50", "normal"), buttonBg: "secondary", buttonBgHover: "secondary-800", buttonText: "700", buttonTextFontWeight: "semibold", buttonTextHover: "700", buttonTextFontWeightHover: "semibold", ...BACKLINKS };
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

const STEPS_EN = [
  { id: "mode", icon: "AirplaneTilt", title: "Activate airplane mode and Wi-Fi" },
  { id: "network", icon: "Screencast", title: "Connect to your entertainment system's network" },
  { id: "browser", icon: "GlobeSimple", title: "Open your browser" },
  { id: "enjoy", icon: "MonitorPlay", title: "Enjoy a variety of entertainment options" },
];
const STEPS_AR = [
  { id: "mode", icon: "AirplaneTilt", title: "فعّل وضع الطيران والواي فاي" },
  { id: "network", icon: "Screencast", title: "اتصل بشبكة نظام الترفيه" },
  { id: "browser", icon: "GlobeSimple", title: "افتح المتصفح" },
  { id: "enjoy", icon: "MonitorPlay", title: "استمتع بمجموعة من خيارات الترفيه" },
];

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Onboard", "Entertainment System"],
    aria: "Breadcrumb",
    hero: { title: "Entertainment System", subtitle: "Celebrate Your Birthday With Us In The Sky", imageAlt: "A family watching a screen together" },
    catalog: {
      title: "Something for Everyone",
      subtitle: "From the latest movies to your favorite music, and fun content for kids enjoy a selection that suits all tastes and ages.",
      items: [
        { id: "movies", image: "movies.png", title: "Movies & TV Shows", description: "Toys that help children unleash their imagination and make their time on board enjoyable and special.", imageAlt: "A child watching a screen by the window" },
        { id: "music", image: "music.png", title: "Music & Audio", description: "Innovative toys suitable for different ages, ensuring fun and entertainment during the flight.", imageAlt: "A passenger listening with headphones" },
        { id: "kids", image: "kids.png", title: "Kids Entertainment", description: "Each child receives a special toy as a beautiful souvenir of his flight with us", imageAlt: "A child holding a teddy bear" },
      ],
    },
    steps: { title: "How to Connect Your Device", description: "Our in-flight entertainment system is easy to use and available on all our flights. Follow these simple steps and start exploring.", imageAlt: "A passenger connecting a phone", caption: "Tap, Connect, Enjoy ♡", items: STEPS_EN },
    promo: { title: "Inspiration On Board", description: "Enjoy reading a distinguished collection of articles about travel and tourism in our Traveler magazine. Discover local secrets, cultural highlights, and expert recommendations.", buttonLabel: "Explore the Magazine", imageAlt: "Marhaba magazine" },
    faqsTitle: "Frequently Asked Questions",
    browse: "Browse FAQs",
    faqs: FAQS_EN,
    terms: TERMS_EN,
    cardsTitle: "Services Elevate Your Experience",
    learnMore: "Learn More",
    cards: [
      { id: "marhaba", image: "marhaba.png", title: "Ya Marhaba service", description: "Experience our signature meet-and-greet service with personalized assistance from arrival to boarding.", href: MARHABA, imageAlt: "A meet-and-greet car at the airport" },
      { id: "lounge", image: "lounge.png", title: "Business lounge", description: "Relax in our exclusive business lounge with premium amenities, refreshments, and a peaceful atmosphere before your flight.", href: LOUNGE, imageAlt: "Passengers in a business lounge" },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "على متن الطائرة", "نظام الترفيه"],
    aria: "مسار التنقل",
    hero: { title: "نظام الترفيه", subtitle: "احتفل بعيد ميلادك معنا في السماء", imageAlt: "عائلة تشاهد شاشة معاً" },
    catalog: {
      title: "شيء للجميع",
      subtitle: "من أحدث الأفلام إلى موسيقاك المفضلة ومحتوى ممتع للأطفال، استمتع باختيار يناسب كل الأذواق والأعمار.",
      items: [
        { id: "movies", image: "movies.png", title: "أفلام ومسلسلات", description: "ألعاب تساعد الأطفال على إطلاق خيالهم وتجعل وقتهم على متن الطائرة ممتعاً ومميزاً.", imageAlt: "طفل يشاهد شاشة بجانب النافذة" },
        { id: "music", image: "music.png", title: "موسيقى وصوت", description: "ألعاب مبتكرة تناسب مختلف الأعمار وتضمن المرح والترفيه أثناء الرحلة.", imageAlt: "راكب يستمع بسماعات" },
        { id: "kids", image: "kids.png", title: "ترفيه الأطفال", description: "يحصل كل طفل على لعبة خاصة كتذكار جميل من رحلته معنا", imageAlt: "طفل يحمل دباً محشواً" },
      ],
    },
    steps: { title: "كيف تصل جهازك", description: "نظام الترفيه على متن الطائرة سهل الاستخدام ومتاح على جميع رحلاتنا. اتبع هذه الخطوات البسيطة وابدأ الاستكشاف.", imageAlt: "راكب يوصل هاتفه", caption: "Tap, Connect, Enjoy ♡", items: STEPS_AR },
    promo: { title: "إلهام على المتن", description: "استمتع بقراءة مجموعة مميزة من المقالات عن السفر والسياحة في مجلة المسافر. اكتشف أسراراً محلية ولمحات ثقافية وتوصيات الخبراء.", buttonLabel: "استكشف المجلة", imageAlt: "مجلة مرحبا" },
    faqsTitle: "الأسئلة الشائعة",
    browse: "تصفّح الأسئلة الشائعة",
    faqs: FAQS_AR,
    terms: TERMS_AR,
    cardsTitle: "خدمات ترتقي بتجربتك",
    learnMore: "اعرف المزيد",
    cards: [
      { id: "marhaba", image: "marhaba.png", title: "خدمة يا مرحبا", description: "اختبر خدمة الاستقبال المميزة مع مساعدة شخصية من الوصول حتى الصعود.", href: MARHABA, imageAlt: "سيارة استقبال في المطار" },
      { id: "lounge", image: "lounge.png", title: "صالة رجال الأعمال", description: "استرخِ في صالة رجال الأعمال الحصرية مع مرافق مميزة ومرطبات وأجواء هادئة قبل رحلتك.", href: LOUNGE, imageAlt: "ركاب في صالة رجال الأعمال" },
    ],
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", HUB, ""];
  return [
    { type: "breadcrumbs", style: CRUMBS_STYLE, content: { items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })), separator: "/", ariaLabel: copy.aria, links: [] } },
    { type: "page-media-hero", style: HERO_STYLE, content: { title: copy.hero.title, subtitle: copy.hero.subtitle, imageUrl: `${MEDIA}/hero.png`, imageAlt: copy.hero.imageAlt, buttonLabel: "", buttonHref: "", slides: [], links: [] } },
    { type: "catalog-cards", style: CATALOG_STYLE, content: { title: copy.catalog.title, subtitle: copy.catalog.subtitle, items: copy.catalog.items.map((item) => ({ id: item.id, imageUrl: `${MEDIA}/${item.image}`, imageAlt: item.imageAlt, title: item.title, description: item.description, cta: "", href: "", icon: "" })), links: [] } },
    { type: "support-steps", style: STEPS_STYLE, content: { title: copy.steps.title, description: copy.steps.description, imageUrl: `${MEDIA}/connect.png`, imageAlt: copy.steps.imageAlt, imageCaption: copy.steps.caption, items: copy.steps.items.map((item) => ({ ...item, description: "", linkLabel: "", href: "", linkIcon: "" })), links: [] } },
    { type: "promo-banner", style: PROMO_STYLE, content: { title: copy.promo.title, description: copy.promo.description, buttonLabel: copy.promo.buttonLabel, buttonHref: MAGAZINE, imageUrl: `${MEDIA}/magazine.png`, imageAlt: copy.promo.imageAlt, ctaButton: { content: copy.promo.buttonLabel, href: MAGAZINE }, image: { fileUrl: `${MEDIA}/magazine.png`, alt: copy.promo.imageAlt }, links: [] } },
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
  if (node.id === "entertainment" && typeof node.href === "string") node.href = PAGE;
  Object.values(node).forEach(retarget);
}

console.log("Target project:", url);
const auth = curl("POST", "/auth/v1/token", { query: "grant_type=password", body: { email, password } });
if (!auth?.access_token) { console.error("Sign-in failed:", restError(auth, "no access_token")); process.exit(1); }
const token = auth.access_token;
for (const row of [
  { id: "catalog-cards", label: "Catalog Cards" },
  { id: "support-steps", label: "Support Steps" },
]) {
  const res = curl("POST", "/rest/v1/component_types", { token, query: "on_conflict=id", prefer: "resolution=merge-duplicates,return=minimal", body: row });
  if (res?.message) { console.error("component_types upsert failed:", restError(res, "unknown error")); process.exit(1); }
}
for (const name of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, { token, file: resolve(ASSETS, name), contentType: "image/png", headers: ["x-upsert: true", "Cache-Control: max-age=3600"] });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) { console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res))); process.exit(1); }
  console.log("image uploaded:", `${FOLDER}/${name}`);
}
let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
  if (!Array.isArray(existing)) { console.error("pages lookup failed"); process.exit(1); }
  if (existing[0]?.id) pageId = existing[0].id;
  else {
    const inserted = curl("POST", "/rest/v1/pages", { token, prefer: "return=representation", body: { slug: PAGE_SLUG, label: "Entertainment System", description: "Movies, music, and kids entertainment on board", status: "published" } });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) { console.error("pages insert failed", restError(inserted, "")); process.exit(1); }
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}
for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", { token, query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id` });
  if (!Array.isArray(links)) { console.error(`lookup failed (${lang})`); process.exit(1); }
  if (links.length > 0) { console.log(`kept ${lang}`); continue; }
  const blocks = buildBlocks(lang);
  for (let position = 0; position < blocks.length; position += 1) {
    const block = blocks[position];
    const inserted = curl("POST", "/rest/v1/components", { token, prefer: "return=representation", body: { type: block.type, position, style: { [lang]: block.style }, content: { [lang]: block.content } } });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) { console.error(`insert failed ${lang} ${block.type}`, restError(inserted, "")); process.exit(1); }
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
      curl("PATCH", "/rest/v1/site_header", { token, query: `lang=eq.${row.lang}`, prefer: "return=minimal", body: { data: row.data, version: Number(row.version || 1) + 1 } });
      console.log("header updated", row.lang);
    }
  }
}
for (const slug of ["on-board", "birthday-onboard", "kids-toys"]) {
  const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${slug}&select=id` });
  const parentId = Array.isArray(pages) ? pages[0]?.id : null;
  if (!parentId) continue;
  const links = curl("GET", "/rest/v1/page_components", { token, query: `page_id=eq.${parentId}&select=component_id,components(id,content)` });
  if (!Array.isArray(links)) continue;
  for (const link of links) {
    const component = Array.isArray(link.components) ? link.components[0] : link.components;
    if (!component?.content) continue;
    const before = JSON.stringify(component.content);
    retarget(component.content);
    if (JSON.stringify(component.content) === before) continue;
    curl("PATCH", "/rest/v1/components", { token, query: `id=eq.${component.id}`, prefer: "return=minimal", body: { content: component.content } });
    console.log(`${slug} entertainment link updated`, component.id);
  }
}
console.log("Done. Open /en/travel-experience/on-board/entertainment-system");
