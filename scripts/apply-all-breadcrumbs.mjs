/**
 * One-off admin task: every CMS content page gets a Breadcrumbs block at
 * position 0 in each language that has blocks (EN + AR), like the
 * /travel-experience pages (see apply-travel-experience-breadcrumbs.mjs).
 *
 *   - Language with no blocks → skipped (empty page).
 *   - Language that already has a breadcrumbs block → left alone.
 *   - Otherwise → insert one, shift the other blocks down one.
 *
 * Trails use each page's CURRENT public URL (Page-settings renames:
 * help → help-center, legal → legal-information, cargo → air-cargo-service, …).
 * The current page is the last, unlinked crumb.
 *
 * Not listed on purpose: home, not-found, coming-soon, full-screen pages
 * (cham-miles, travel-agent-portal-login, route-map), site-map (its block
 * draws its own trail), flight-schedule (/flight-schedule is a static React
 * page), test-page, and pages with no blocks.
 *
 *   node scripts/apply-all-breadcrumbs.mjs [--dry-run]
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  const eq = t.indexOf("=");
  if (!t || t.startsWith("#") || eq === -1) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!process.env[k]) process.env[k] = v;
}
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const API = "https://cms-api.cms-flycham.alpatrose.com/api/public";
const DRY_RUN = process.argv.includes("--dry-run");

const CRUMBS = "breadcrumbs";

// The one style every existing breadcrumbs block shares (component_types.shared_style).
const CRUMBS_STYLE = {
  sectionPadding: "none",
  showSectionBg: false,
  sectionBg: "100",
  crumbColor: "600",
  crumbFontWeight: "medium",
  crumbColorHover: "primary-1",
  crumbFontWeightHover: "medium",
  crumbUnderline: false,
  currentColor: "primary-1",
  currentFontWeight: "semibold",
  currentColorHover: "primary-1",
  currentFontWeightHover: "semibold",
  focusColor: "primary-1",
  focusFontWeight: "semibold",
  focusColorHover: "primary-1",
  focusFontWeightHover: "semibold",
  separatorColor: "600",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

const ARIA = { en: "Breadcrumb", ar: "مسار التنقل" };

// [en label, ar label, href] — parents use their current public URL.
const HOME = ["Home", "الرئيسية", "/"];
const WHERE_WE_FLY = ["Where we fly", "وجهاتنا", "/our-destinations"];
const ABOUT = ["About Us", "من نحن", "/about-us"];
const CARGO = ["Air Cargo Service", "خدمة الشحن الجوي", "/air-cargo-service"];
const LEGAL = ["Legal Information", "المعلومات القانونية", "/legal-information"];
const HELP = ["Help Center", "مركز المساعدة", "/help-center"];
const CONTACT = ["Contact Us", "اتصل بنا", "/help-center/contact-us"];
const FORMS = ["Forms Requests", "استمارات الدعم", "/help-center/contact-us/forms-requests"];

// slug → { parents, page: [en, ar], langs? } (langs defaults to both).
const PAGES = {
  "about-us": { parents: [HOME], page: ["About Us", "من نحن"] },
  "our-responsibility": { parents: [HOME, ABOUT], page: ["Our Responsibility", "مسؤوليتنا"] },
  "air-cargo-service": { parents: [HOME], page: ["Air Cargo Service", "خدمة الشحن الجوي"] },
  // Public route is /cargo-stations; it sits under cargo in the page tree.
  "cargo-stations": { parents: [HOME, CARGO], page: ["Cargo Stations", "محطات الشحن"] },
  "media-center": { parents: [HOME], page: ["Media Center", "المركز الإعلامي"] },
  "our-fleet": { parents: [HOME], page: ["Our Fleet", "أسطولنا"] },
  "offers-and-deals": { parents: [HOME], page: ["Offers & Deals", "العروض والصفقات"] },
  "travel-updates": { parents: [HOME], page: ["Travel Updates", "تحديثات السفر"] },
  "legal-information": { parents: [HOME], page: ["Legal Information", "المعلومات القانونية"] },
  "website-terms-and-conditions": {
    parents: [HOME, LEGAL],
    page: ["Website Terms and Conditions", "شروط وأحكام الموقع"],
  },
  "booking-terms-and-conditions": {
    parents: [HOME, LEGAL],
    page: ["Booking Terms and Conditions", "شروط وأحكام الحجز"],
  },
  "privacy-policy": { parents: [HOME, LEGAL], page: ["Privacy Policy", "سياسة الخصوصية"] },
  "cookies-policy": { parents: [HOME, LEGAL], page: ["Cookies Policy", "ملفات تعريف الارتباط"] },
  "cham-miles-terms-and-conditions": {
    parents: [HOME, LEGAL],
    page: ["Cham Miles Terms", "شروط وأحكام شام مايلز"],
  },
  // EN already has one (Home / Help).
  "help-center": { parents: [HOME], page: ["Help Center", "مركز المساعدة"], langs: ["ar"] },
  "request-a-form": {
    parents: [HOME, HELP, CONTACT, FORMS],
    page: ["Request a Form", "طلب استمارة"],
  },
  "activities-and-attractions": {
    parents: [HOME, WHERE_WE_FLY],
    page: ["Activities and Attractions", "الأنشطة والمعالم"],
  },
  "flights-to-damascus": { parents: [HOME, WHERE_WE_FLY], page: ["Flights to Damascus", "رحلات إلى دمشق"] },
};

// Things-to-do guides keep the trail the site already draws for them
// (DynamicPage withDestinationBreadcrumbs): Home / Where we fly / Flights to X / Things to Do in X.
const CITIES = {
  "abu-dhabi": ["Abu Dhabi", "أبو ظبي"],
  aleppo: ["Aleppo", "حلب"],
  baghdad: ["Baghdad", "بغداد"],
  damascus: ["Damascus", "دمشق"],
  dammam: ["Dammam", "الدمام"],
  dubai: ["Dubai", "دبي"],
  erbil: ["Erbil", "أربيل"],
  istanbul: ["Istanbul", "إسطنبول"],
  jeddah: ["Jeddah", "جدة"],
  kuwait: ["Kuwait", "الكويت"],
  medina: ["Medina", "المدينة المنورة"],
  muscat: ["Muscat", "مسقط"],
  sharjah: ["Sharjah", "الشارقة"],
  tripoli: ["Tripoli", "طرابلس"],
  yerevan: ["Yerevan", "يريفان"],
};
for (const [city, [en, ar]] of Object.entries(CITIES)) {
  PAGES[`things-to-do-in-${city}`] = {
    parents: [
      HOME,
      WHERE_WE_FLY,
      [`Flights to ${en}`, `رحلات إلى ${ar}`, `/our-destinations/flights-to-${city}`],
    ],
    page: [`Things to Do in ${en}`, `أنشطة يمكن القيام بها في ${ar}`],
  };
}

const LANG_INDEX = { en: 0, ar: 1 };
const trail = (cfg, lang) => [
  ...cfg.parents.map((p) => ({ href: p[2], label: p[LANG_INDEX[lang]] })),
  { href: "", label: cfg.page[LANG_INDEX[lang]] },
];

async function getPage(slug, lang) {
  const r = await fetch(`${API}/get-page?slug=${encodeURIComponent(slug)}&lang=${lang}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`get-page ${slug} ${lang}: ${r.status}`);
  return r.json();
}

let token = null;
async function signIn() {
  const auth = await (
    await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
    })
  ).json();
  if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
  token = auth.access_token;
}

async function rest(method, path, body, prefer = "return=representation") {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: prefer,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

if (!DRY_RUN) await signIn();

const counts = { add: 0, has: 0, empty: 0, missing: 0 };
for (const [slug, cfg] of Object.entries(PAGES)) {
  for (const lang of cfg.langs || ["en", "ar"]) {
    const page = await getPage(slug, lang);
    if (!page) {
      console.log(`skip ${slug} (${lang}): page not found`);
      counts.missing++;
      continue;
    }
    const blocks = page.blocks || [];
    if (!blocks.length) {
      console.log(`skip ${slug} (${lang}): no blocks`);
      counts.empty++;
      continue;
    }
    if (blocks.some((b) => b.sectionId === CRUMBS)) {
      console.log(`has  ${slug} (${lang})`);
      counts.has++;
      continue;
    }

    const items = trail(cfg, lang);
    console.log(`add  ${slug} (${lang}) @0: ${items.map((i) => i.label + (i.href ? ` <${i.href}>` : "")).join(" / ")}`);
    counts.add++;
    if (DRY_RUN) continue;

    // Shift this language's blocks down one (highest first).
    for (const b of blocks.slice().sort((a, b) => (b.position ?? 0) - (a.position ?? 0)))
      await rest("PATCH", `page_components?id=eq.${b.linkId}`, { position: (b.position ?? 0) + 1 }, "return=minimal");

    const [comp] = await rest("POST", "components", {
      type: CRUMBS,
      position: 0,
      style: { [lang]: CRUMBS_STYLE },
      content: { [lang]: { items, separator: "/", ariaLabel: ARIA[lang], links: [] } },
    });
    await rest(
      "POST",
      "page_components",
      { page_id: page.id, component_id: comp.id, position: 0, lang },
      "return=minimal"
    );
  }
}
console.log(JSON.stringify(counts));
console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
