/**
 * Seeds the on-board page from Figma 40263:33281.
 * URL: /travel-experience/on-board
 * Leaves the older slug `onboard` (/travel-experience/onboard) in place.
 *
 *   node scripts/apply-on-board-page.mjs
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

const PAGE_SLUG = "on-board";
const FOLDER = "on-board";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/on-board");
const HUB = "/travel-experience/on-board";
const BIRTHDAY = "/travel-experience/on-board/birthday-onboard";
const MAGAZINE = "/travel-experience/traveler-magazine";
const HELP = "/help";
const OLD = "/travel-experience/onboard";
const UPLOADS = ["hero.png", "classes.png", "meals.png", "entertainment.png", "birthday.png", "magazine.png", "toys.png", "wifi.png", "support.png"];
const HUB_IDS = new Set(["travelClasses", "meals", "entertainment", "kidsToys", "wifiOnboard"]);

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "split-cards", label: "Split Cards" },
  { id: "promo-banner", label: "Promo Banner" },
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
  ...text("subtitleColor", "700", "normal"),
  ...BACKLINKS,
};

const SPLIT_STYLE = {
  ...LAYOUT,
  layout: "featured",
  columns: "2",
  showHeader: true,
  showSubtitle: true,
  ...text("titleColor", "700", "semibold"),
  ...text("subtitleColor", "700", "normal"),
  cardBg: "background",
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "600", "normal"),
  showLink: true,
  showLinkIcon: true,
  ...text("learnMoreColor", "primary-1", "semibold"),
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
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

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Onboard"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Onboard",
      subtitle: "Comfort, entertainment and thoughtful details to make your journey enjoyable.",
      imageAlt: "A passenger wearing headphones in the cabin",
    },
    services: {
      title: "Your Time Onboard",
      subtitle: "Thoughtful services designed to make your flight more enjoyable.",
      learnMore: "Learn More",
      items: [
        { id: "classes", image: "classes.png", title: "Travel Classes", description: "Discover our travel classes and fare options for a tailored experience at every stage of your journey. Settle into spacious cabins built around your absolute peace of mind.", href: HUB, imageAlt: "Aircraft cabin seats" },
        { id: "meals", image: "meals.png", title: "Meals Onboard", description: "Explore our meal and drink options available during your flight, prepared by world-class chefs.", href: HUB, imageAlt: "A meal served on board" },
        { id: "entertainment", image: "entertainment.png", title: "Entertainment System", description: "A variety of songs, movies and TV series await you on our in-flight entertainment system with personal high-res screens.", href: HUB, imageAlt: "In-flight entertainment screens" },
        { id: "birthday", image: "birthday.png", title: "Birthday Cakes Onboard", description: "Make your special day more memorable by enjoying a delicious birthday cake onboard during flight.", href: BIRTHDAY, imageAlt: "A birthday cake on board" },
        { id: "magazine", image: "magazine.png", title: "Marhaba Magazine", description: "Enjoy reading a distinguished collection of curated articles about international travel, business and tourism.", href: MAGAZINE, imageAlt: "Marhaba magazine" },
        { id: "toys", image: "toys.png", title: "Kids Toys", description: "Fun activities, games, and toys to keep your children entertained and happy throughout the flight.", href: HUB, imageAlt: "Children's toys for the flight" },
        { id: "wifi", image: "wifi.png", title: "Wi-Fi Onboard", description: "Learn about our onboard Wi-Fi availability and high-speed connectivity options to stay close to what matters.", href: HUB, imageAlt: "A passenger using a laptop on board" },
      ],
    },
    promo: {
      title: "Find the Support You Need",
      description: "Access helpful information, contact Fly Cham, browse frequently asked questions, or submit and track a request through our Help Centre.",
      buttonLabel: "Visit the Help Center",
      imageAlt: "A passenger speaking with a support agent",
    },
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "على متن الطائرة"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "على متن الطائرة",
      subtitle: "راحة وترفيه وتفاصيل مدروسة لجعل رحلتك ممتعة.",
      imageAlt: "راكب يضع سماعات في المقصورة",
    },
    services: {
      title: "وقتك على متن الطائرة",
      subtitle: "خدمات مدروسة لجعل رحلتك أكثر متعة.",
      learnMore: "اعرف المزيد",
      items: [
        { id: "classes", image: "classes.png", title: "درجات السفر", description: "اكتشف درجات السفر وخيارات الأجرة لتجربة تناسبك في كل مرحلة من رحلتك. استرخِ في مقصورات واسعة صُممت لراحتك التامة.", href: HUB, imageAlt: "مقاعد مقصورة الطائرة" },
        { id: "meals", image: "meals.png", title: "الوجبات على متن الطائرة", description: "تعرّف على خيارات الطعام والشراب المتاحة أثناء رحلتك، والتي يُعدّها طهاة من الطراز العالمي.", href: HUB, imageAlt: "وجبة تُقدَّم على متن الطائرة" },
        { id: "entertainment", image: "entertainment.png", title: "نظام الترفيه", description: "مجموعة من الأغاني والأفلام والمسلسلات بانتظارك على نظام الترفيه بشاشات شخصية عالية الدقة.", href: HUB, imageAlt: "شاشات الترفيه على متن الطائرة" },
        { id: "birthday", image: "birthday.png", title: "كعك أعياد الميلاد على المتن", description: "اجعل يومك المميز أكثر تميزاً بالاستمتاع بكعكة عيد ميلاد لذيذة أثناء الرحلة.", href: BIRTHDAY, imageAlt: "كعكة عيد ميلاد على متن الطائرة" },
        { id: "magazine", image: "magazine.png", title: "مجلة مرحبا", description: "استمتع بقراءة مجموعة مختارة من المقالات عن السفر الدولي والأعمال والسياحة.", href: MAGAZINE, imageAlt: "مجلة مرحبا" },
        { id: "toys", image: "toys.png", title: "ألعاب الأطفال", description: "أنشطة وألعاب ممتعة تُبقي أطفالك مستمتعين وسعيدين طوال الرحلة.", href: HUB, imageAlt: "ألعاب أطفال للرحلة" },
        { id: "wifi", image: "wifi.png", title: "واي فاي على المتن", description: "تعرّف على توفر الواي فاي على متن الطائرة وخيارات الاتصال السريع لتبقى قريباً مما يهمك.", href: HUB, imageAlt: "راكب يستخدم حاسوباً محمولاً على متن الطائرة" },
      ],
    },
    promo: {
      title: "اعثر على الدعم الذي تحتاجه",
      description: "اطّلع على المعلومات المفيدة، وتواصل مع فلاي شام، وتصفّح الأسئلة الشائعة، أو أرسل طلباً وتابعه عبر مركز المساعدة.",
      buttonLabel: "زيارة مركز المساعدة",
      imageAlt: "راكب يتحدث مع موظف دعم",
    },
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", "/travel-experience", ""];
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
      type: "split-cards",
      style: SPLIT_STYLE,
      content: {
        title: copy.services.title,
        subtitle: copy.services.subtitle,
        items: copy.services.items.map((item) => ({
          id: item.id,
          imageUrl: `${MEDIA}/${item.image}`,
          imageAlt: item.imageAlt,
          title: item.title,
          description: item.description,
          cta: copy.services.learnMore,
          href: item.href,
          icon: "ArrowRight",
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
        buttonHref: HELP,
        imageUrl: `${MEDIA}/support.png`,
        imageAlt: copy.promo.imageAlt,
        ctaButton: { content: copy.promo.buttonLabel, href: HELP },
        image: { fileUrl: `${MEDIA}/support.png`, alt: copy.promo.imageAlt },
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

function retarget(node) {
  if (Array.isArray(node)) {
    node.forEach(retarget);
    return;
  }
  if (!node || typeof node !== "object") return;
  if ((node.id === "birthdayCakes" || node.id === "birthdayCake") && typeof node.href === "string") node.href = BIRTHDAY;
  else if (node.id === "onboard") {
    if (typeof node.ctaHref === "string") node.ctaHref = HUB;
    if (typeof node.href === "string" && (node.href === OLD || node.href === HUB)) node.href = HUB;
  } else if (HUB_IDS.has(node.id) && node.href === OLD) node.href = HUB;
  Object.values(node).forEach(retarget);
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
        label: "Onboard",
        description: "Comfort, entertainment and thoughtful details on board",
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

function patchTable(table) {
  const rows = curl("GET", `/rest/v1/${table}`, { token, query: "select=lang,data,version" });
  if (!Array.isArray(rows)) {
    console.log(`${table} skipped:`, restError(rows, "unavailable"));
    return;
  }
  for (const row of rows) {
    const before = JSON.stringify(row.data);
    retarget(row.data);
    if (JSON.stringify(row.data) === before) {
      console.log(`${table} already pointed:`, row.lang);
      continue;
    }
    const res = curl("PATCH", `/rest/v1/${table}`, {
      token,
      query: `lang=eq.${row.lang}`,
      prefer: "return=minimal",
      body: { data: row.data, version: Number(row.version || 1) + 1 },
    });
    if (res?.message) console.error(`${table} update failed (${row.lang}):`, restError(res, "unknown error"));
    else console.log(`${table} link updated:`, row.lang);
  }
}

patchTable("site_header");
patchTable("site_footer");

for (const slug of ["travel-experience", "at-the-airport"]) {
  const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${slug}&select=id` });
  const parentId = Array.isArray(pages) ? pages[0]?.id : null;
  if (!parentId) continue;
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${parentId}&select=component_id,components(id,content)`,
  });
  if (!Array.isArray(links)) continue;
  for (const link of links) {
    const component = Array.isArray(link.components) ? link.components[0] : link.components;
    if (!component?.content) continue;
    const before = JSON.stringify(component.content);
    retarget(component.content);
    if (JSON.stringify(component.content) === before) continue;
    const res = curl("PATCH", "/rest/v1/components", {
      token,
      query: `id=eq.${component.id}`,
      prefer: "return=minimal",
      body: { content: component.content },
    });
    if (res?.message) console.error(`${slug} link update failed:`, restError(res, "unknown error"));
    else console.log(`${slug} onboard link updated:`, component.id);
  }
}

console.log("Done. Open /en/travel-experience/on-board");
