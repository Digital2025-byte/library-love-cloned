/**
 * Seed the CMS page "magazine-view" (public /magazine-view) with breadcrumbs
 * plus the magazine viewer. Page images are uploaded to
 * cms-media/magazine-view and stored as public URLs.
 *
 * Idempotent: re-running replaces this page's blocks.
 *
 *   node scripts/apply-magazine-view-page.mjs
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
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(
  /\/$/,
  "",
);
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "magazine-view";
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images");
const MEDIA = `${url}/storage/v1/object/public/cms-media/magazine-view`;

const UPLOADS = [
  { name: "cover.jpg", file: "city-sights/magazine-cover.jpg", type: "image/jpeg" },
  { name: "spread-1.jpg", file: "city-sights/magazine-spread-1.jpg", type: "image/jpeg" },
  { name: "spread-2.jpg", file: "city-sights/magazine-spread-2.jpg", type: "image/jpeg" },
  { name: "destination-damascus.jpg", file: "our-destenations/damascus.jpeg", type: "image/jpeg" },
  { name: "destination-dubai.jpg", file: "our-destenations/dubai.jpg", type: "image/jpeg" },
  { name: "destination-istanbul.jpg", file: "our-destenations/istanbul.jpg", type: "image/jpeg" },
  { name: "feature-1.jpg", file: "media-center/latest-news.jpg", type: "image/jpeg" },
  { name: "feature-2.jpg", file: "media-center/news-grid-2.jpg", type: "image/jpeg" },
  { name: "feature-3.jpg", file: "media-center/news-grid-3.jpg", type: "image/jpeg" },
  { name: "closing.jpg", file: "our-destenations/ph2.jpg", type: "image/jpeg" },
];

const PAGE_FILES = [
  ["cover", "cover.jpg"],
  ["spreadOne", "spread-1.jpg"],
  ["spreadTwo", "spread-2.jpg"],
  ["destinationOne", "destination-damascus.jpg"],
  ["destinationTwo", "destination-dubai.jpg"],
  ["destinationThree", "destination-istanbul.jpg"],
  ["featureOne", "feature-1.jpg"],
  ["featureTwo", "feature-2.jpg"],
  ["featureThree", "feature-3.jpg"],
  ["closing", "closing.jpg"],
];

const COPY = {
  en: {
    home: "Home",
    media: "Media Center",
    breadcrumb: "Marhaba Magazine",
    title: "Marhaba Magazine",
    description:
      "Flip through the latest Marhaba onboard magazine. Drag pages or use the controls to browse, then download the full issue.",
    prevLabel: "Previous",
    nextLabel: "Next",
    downloadLabel: "Download",
    pageOfLabel: "Page {current} of {total}",
    spreadOfLabel: "Pages {start}–{end} of {total}",
    fullscreenLabel: "Fullscreen",
    exitFullscreenLabel: "Exit fullscreen",
    alts: {
      cover: "Marhaba magazine cover",
      spreadOne: "Marhaba magazine spread one",
      spreadTwo: "Marhaba magazine spread two",
      destinationOne: "Damascus destination feature",
      destinationTwo: "Dubai destination feature",
      destinationThree: "Istanbul destination feature",
      featureOne: "Feature story page one",
      featureTwo: "Feature story page two",
      featureThree: "Feature story page three",
      closing: "Closing magazine page",
    },
  },
  ar: {
    home: "الرئيسية",
    media: "المركز الإعلامي",
    breadcrumb: "مجلة مرحبا",
    title: "مجلة مرحبا",
    description:
      "تصفّح أحدث أعداد مجلة مرحبا على متن الطائرة. اسحب الصفحات أو استخدم أزرار التحكم، ثم حمّل العدد كاملاً.",
    prevLabel: "السابق",
    nextLabel: "التالي",
    downloadLabel: "تحميل",
    pageOfLabel: "صفحة {current} من {total}",
    spreadOfLabel: "الصفحات {start}–{end} من {total}",
    fullscreenLabel: "ملء الشاشة",
    exitFullscreenLabel: "إنهاء ملء الشاشة",
    alts: {
      cover: "غلاف مجلة مرحبا",
      spreadOne: "صفحة مجلة مرحبا الأولى",
      spreadTwo: "صفحة مجلة مرحبا الثانية",
      destinationOne: "ميزة وجهة دمشق",
      destinationTwo: "ميزة وجهة دبي",
      destinationThree: "ميزة وجهة إسطنبول",
      featureOne: "صفحة القصة الأولى",
      featureTwo: "صفحة القصة الثانية",
      featureThree: "صفحة القصة الثالثة",
      closing: "الصفحة الختامية للمجلة",
    },
  },
};

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

const BREADCRUMB_STYLE = {
  sectionPadding: "chrome",
  showSectionBg: false,
  sectionBg: "100",
  crumbColor: "600",
  crumbFontWeight: "medium",
  crumbColorHover: "primary-1",
  crumbFontWeightHover: "medium",
  currentColor: "primary-1",
  currentFontWeight: "semibold",
  currentColorHover: "primary-1",
  currentFontWeightHover: "semibold",
  separatorColor: "600",
  ...BACKLINKS,
};

const VIEW_STYLE = {
  titleColor: "primary-1",
  titleFontWeight: "semibold",
  titleColorHover: "primary-1",
  titleFontWeightHover: "semibold",
  descriptionColor: "700",
  descriptionFontWeight: "normal",
  descriptionColorHover: "700",
  descriptionFontWeightHover: "normal",
  buttonBg: "secondary",
  buttonHoverBg: "",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

const imageUrl = (name) => `${MEDIA}/${name}`;

function buildBlocks(lang) {
  const copy = COPY[lang];
  return [
    {
      type: "breadcrumbs",
      style: BREADCRUMB_STYLE,
      content: {
        items: [
          { label: copy.home, href: "/" },
          { label: copy.media, href: "/media-center" },
          { label: copy.breadcrumb, href: "" },
        ],
        separator: "/",
        ariaLabel: "Breadcrumb",
        links: [],
      },
    },
    {
      type: "magazine-view",
      style: VIEW_STYLE,
      content: {
        title: copy.title,
        description: copy.description,
        prevLabel: copy.prevLabel,
        nextLabel: copy.nextLabel,
        downloadLabel: copy.downloadLabel,
        pageOfLabel: copy.pageOfLabel,
        spreadOfLabel: copy.spreadOfLabel,
        fullscreenLabel: copy.fullscreenLabel,
        exitFullscreenLabel: copy.exitFullscreenLabel,
        pdfUrl: "https://flycham.com/api/gallery/Sky-Talk-Magazine-August-2025.pdf",
        pdfFilename: "Sky-Talk-Magazine-August-2025.pdf",
        pages: PAGE_FILES.map(([id, file]) => ({
          id,
          imageUrl: imageUrl(file),
          imageAlt: copy.alts[id],
        })),
        links: [],
      },
    },
  ];
}

const workDir = mkdtempSync(join(tmpdir(), "magazine-view-"));
let seq = 0;

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query, file, contentType, headers } = {}) {
  const args = [
    "-sS",
    "-X",
    method,
    `${url}${path}${query ? `?${query}` : ""}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    `Content-Type: ${contentType || "application/json; charset=utf-8"}`,
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  for (const header of headers || []) args.push("-H", header);
  if (file) args.push("--data-binary", `@${file}`);
  else if (body !== undefined) {
    const tmp = join(workDir, `body-${(seq += 1)}.json`);
    writeFileSync(tmp, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${tmp}`);
  }
  const trimmed = execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 20_000_000,
  }).trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
  }
}

function fail(message) {
  console.error(message);
  rmSync(workDir, { recursive: true, force: true });
  process.exit(1);
}

console.log("Target project:", url);

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail(`Sign-in failed: ${restError(auth, "no access_token")}`);
const token = auth.access_token;
console.log("Signed in as", email);

{
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id: "magazine-view", label: "Magazine View" },
  });
  if (res?.message) fail(`component_types upsert failed: ${restError(res, "?")}`);
  console.log("component type ok: magazine-view");
}

for (const item of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/magazine-view/${item.name}`, {
    token,
    file: resolve(ASSETS, item.file),
    contentType: item.type,
    headers: ["x-upsert: true"],
  });
  if (res?.statusCode && res.statusCode >= 400) {
    fail(`image upload failed (${item.name}): ${restError(res, JSON.stringify(res))}`);
  }
  if (res?.error || res?.message) {
    fail(`image upload failed (${item.name}): ${restError(res, JSON.stringify(res))}`);
  }
  console.log("image uploaded:", item.name);
}

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${PAGE_SLUG}&select=id`,
  });
  if (!Array.isArray(existing)) fail(`pages lookup failed: ${restError(existing, "?")}`);
  if (existing[0]?.id) {
    pageId = existing[0].id;
    const patched = curl("PATCH", `/rest/v1/pages?id=eq.${pageId}`, {
      token,
      prefer: "return=minimal",
      body: {
        label: "Magazine View",
        description: "Marhaba onboard magazine viewer",
        status: "published",
      },
    });
    if (patched?.message) fail(`pages update failed: ${restError(patched, "?")}`);
    console.log("page exists:", pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Magazine View",
        description: "Marhaba onboard magazine viewer",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) fail(`pages insert failed: ${restError(inserted, "?")}`);
    pageId = row.id;
    console.log("page created:", pageId);
  }
}

{
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&select=id,component_id`,
  });
  if (!Array.isArray(links)) fail(`page_components lookup failed: ${restError(links, "?")}`);
  const componentIds = [...new Set(links.map((row) => row.component_id).filter(Boolean))];
  if (links.length) {
    const removed = curl("DELETE", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      query: `page_id=eq.${pageId}`,
    });
    if (removed?.message) fail(`page_components delete failed: ${restError(removed, "?")}`);
  }
  for (const id of componentIds) {
    const removed = curl("DELETE", "/rest/v1/components", {
      token,
      prefer: "return=minimal",
      query: `id=eq.${id}`,
    });
    if (removed?.message) fail(`components delete failed: ${restError(removed, "?")}`);
  }
  if (links.length) console.log(`cleared ${links.length} existing block link(s)`);
}

for (const lang of ["en", "ar"]) {
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
      fail(`components insert failed (${lang} ${block.type}): ${restError(inserted, "?")}`);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: {
        page_id: pageId,
        component_id: comp.id,
        position,
        lang,
      },
    });
    if (link?.message) {
      fail(`page_components insert failed (${lang} ${block.type}): ${restError(link, "?")}`);
    }
    console.log(`seeded ${block.type} (${lang})`);
  }
}

rmSync(workDir, { recursive: true, force: true });
console.log("Done:", PAGE_SLUG);
