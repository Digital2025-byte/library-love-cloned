/**
 * One-off admin task: put a Breadcrumbs block at the top (position 0) of the
 * help sub-pages that were missing one:
 *   /help/faqs                      slug faqs
 *   /help/contact-us/our-gsa        slug our-gsa
 *   /help/contact-us/forms          slug forms
 *   /help/contact-us/our-offices    slug our-offices
 *   /our-destinations               slug our-destinations
 *   /media-center/recent-news       slug recent-news
 *
 * Style mirrors the existing breadcrumbs block on /help/contact-us. Only the
 * languages that already have blocks on a page are touched; a language that
 * already has a breadcrumbs block is skipped. Existing blocks shift down one.
 *
 *   node scripts/apply-help-breadcrumbs.mjs
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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const CRUMBS = "breadcrumbs";

// Same tokens as the /help/contact-us breadcrumbs block.
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

const LABELS = {
  en: {
    home: "Home",
    help: "Help",
    contactUs: "Contact us",
    faqs: "FAQs",
    ourGsa: "Our GSA",
    forms: "Forms",
    ourOffices: "Our Offices",
    ourDestinations: "Our Destinations",
    mediaCenter: "Media Center",
    recentNews: "Recent News",
    aria: "Breadcrumb",
  },
  ar: {
    home: "الرئيسية",
    help: "المساعدة",
    contactUs: "اتصل بنا",
    faqs: "الأسئلة الشائعة",
    ourGsa: "وكلاؤنا العامون",
    forms: "النماذج",
    ourOffices: "مكاتبنا",
    ourDestinations: "وجهاتنا",
    mediaCenter: "المركز الإعلامي",
    recentNews: "آخر الأخبار",
    aria: "مسار التنقل",
  },
};

// [slug, trail of [labelKey, href]] — the last entry is the current page.
const PAGES = [
  ["faqs", [["home", "/"], ["help", "/help"], ["faqs", "/help/faqs"]]],
  [
    "our-gsa",
    [
      ["home", "/"],
      ["help", "/help"],
      ["contactUs", "/help/contact-us"],
      ["ourGsa", "/help/contact-us/our-gsa"],
    ],
  ],
  [
    "forms",
    [
      ["home", "/"],
      ["help", "/help"],
      ["contactUs", "/help/contact-us"],
      ["forms", "/help/contact-us/forms"],
    ],
  ],
  [
    "our-offices",
    [
      ["home", "/"],
      ["help", "/help"],
      ["contactUs", "/help/contact-us"],
      ["ourOffices", "/help/contact-us/our-offices"],
    ],
  ],
  ["our-destinations", [["home", "/"], ["ourDestinations", "/our-destinations"]]],
  [
    "recent-news",
    [
      ["home", "/"],
      ["mediaCenter", "/media-center"],
      ["recentNews", "/media-center/recent-news"],
    ],
  ],
];

function crumbsContent(trail, lang) {
  const l = LABELS[lang];
  return {
    items: trail.map(([labelKey, href]) => ({ label: l[labelKey], href })),
    separator: "/",
    ariaLabel: l.aria,
    links: [],
  };
}

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

// JSON body goes through a UTF-8 temp file: `curl -d <arg>` on Windows
// mangles Arabic into "????".
function curl(method, path, { body, token, prefer, query } = {}) {
  const origin = String(url).replace(/\/$/, "");
  const qs = query ? `?${query}` : "";
  const args = [
    "-sS",
    "-X",
    method,
    `${origin}${path}${qs}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    "Content-Type: application/json",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  let dir;
  if (body !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "cms-seed-"));
    const file = join(dir, "body.json");
    writeFileSync(file, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${file}`);
  }
  let stdout;
  try {
    stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
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

function fail(label, res) {
  console.error(`${label}:`, restError(res, "unknown error"));
  process.exit(1);
}

console.log("Target project:", url);

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail("Sign-in failed", auth);
const token = auth.access_token;
console.log("Signed in as", email);

for (const [slug, trail] of PAGES) {
  const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${slug}&select=id` });
  if (!Array.isArray(pages)) fail(`pages lookup failed (${slug})`, pages);
  const pageId = pages[0]?.id;
  if (!pageId) {
    console.warn(`skip ${slug}: page not found`);
    continue;
  }

  for (const lang of ["en", "ar"]) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
    });
    if (!Array.isArray(links)) fail(`page_components lookup failed (${slug} ${lang})`, links);

    if (links.length === 0) {
      console.log(`skip ${slug} (${lang}): no blocks in this language`);
      continue;
    }
    if (links.some((row) => componentTypeOf(row) === CRUMBS)) {
      console.log(`skip ${slug} (${lang}): already has breadcrumbs`);
      continue;
    }

    // Shift existing blocks down one (highest first).
    const sorted = links.slice().sort((a, b) => (b.position ?? 0) - (a.position ?? 0));
    for (const row of sorted) {
      const next = (row.position ?? 0) + 1;
      const res = curl("PATCH", "/rest/v1/page_components", {
        token,
        query: `id=eq.${row.id}`,
        prefer: "return=minimal",
        body: { position: next },
      });
      if (res?.message) fail(`shift failed (${slug} ${lang})`, res);
    }

    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: {
        type: CRUMBS,
        position: 0,
        style: { [lang]: CRUMBS_STYLE },
        content: { [lang]: crumbsContent(trail, lang) },
      },
    });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) fail(`components insert failed (${slug} ${lang})`, inserted);

    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position: 0, lang },
    });
    if (link?.message) fail(`page_components insert failed (${slug} ${lang})`, link);

    console.log(`added breadcrumbs to ${slug} (${lang}):`, comp.id);
  }
}

console.log("Done.");
