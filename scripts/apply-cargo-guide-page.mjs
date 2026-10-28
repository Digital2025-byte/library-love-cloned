/**
 * Seed the CMS page "cargo-guide" (public /cargo/cargo-guide) with breadcrumbs
 * plus the cargo-guide-view flipbook. Images upload to cms-media/cargo-guide.
 *
 * Idempotent: re-running replaces this page's blocks.
 *
 *   node scripts/apply-cargo-guide-page.mjs
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

const PAGE_SLUG = "cargo-guide";
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/cargo-guide");
const MEDIA = `${url}/storage/v1/object/public/cms-media/cargo-guide`;

const UPLOADS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
  const name = `page-0${n}.jpg`;
  return { name, file: name, type: "image/jpeg" };
});

/** Brochure reading order for the flipbook (cover, spread halves, back). */
function buildPages(alts) {
  const img = (n) => `${MEDIA}/page-0${n}.jpg`;
  return [
    { id: "cover", imageUrl: img(1), imageAlt: alts.cover, hard: true },
    { id: "who-left", imageUrl: img(2), imageAlt: alts.who, side: "left" },
    { id: "who-right", imageUrl: img(2), imageAlt: alts.who, side: "right" },
    { id: "fleet-left", imageUrl: img(3), imageAlt: alts.fleet, side: "left" },
    { id: "fleet-right", imageUrl: img(3), imageAlt: alts.fleet, side: "right" },
    { id: "dept-left", imageUrl: img(4), imageAlt: alts.dept, side: "left" },
    { id: "dept-right", imageUrl: img(4), imageAlt: alts.dept, side: "right" },
    { id: "dest-left", imageUrl: img(5), imageAlt: alts.dest, side: "left" },
    { id: "dest-right", imageUrl: img(5), imageAlt: alts.dest, side: "right" },
    { id: "types-ar-left", imageUrl: img(6), imageAlt: alts.typesAr, side: "left" },
    { id: "types-ar-right", imageUrl: img(6), imageAlt: alts.typesAr, side: "right" },
    { id: "types-en-left", imageUrl: img(7), imageAlt: alts.typesEn, side: "left" },
    { id: "types-en-right", imageUrl: img(7), imageAlt: alts.typesEn, side: "right" },
    { id: "services-left", imageUrl: img(8), imageAlt: alts.services, side: "left" },
    { id: "services-right", imageUrl: img(8), imageAlt: alts.services, side: "right" },
    { id: "back", imageUrl: img(9), imageAlt: alts.back, hard: true },
  ];
}

const COPY = {
  en: {
    home: "Home",
    cargo: "Cargo",
    breadcrumb: "Cargo Guide",
    title: "Cargo Guide",
    description:
      "Flip through our cargo brochure to learn more about our cargo services, accepted shipments and destinations.",
    alts: {
      cover: "Cargo guide cover",
      who: "Who we are",
      fleet: "Our fleet",
      dept: "Cargo department",
      dest: "Destinations",
      typesAr: "Cargo types (Arabic)",
      typesEn: "Cargo types (English)",
      services: "Services",
      back: "Cargo guide back cover",
    },
  },
  ar: {
    home: "الرئيسية",
    cargo: "الشحن",
    breadcrumb: "دليل الشحن",
    title: "دليل الشحن",
    description:
      "تصفّح كتيب الشحن للتعرّف على خدماتنا والشحنات المقبولة والوجهات.",
    alts: {
      cover: "غلاف دليل الشحن",
      who: "من نحن",
      fleet: "أسطولنا",
      dept: "قسم الشحن",
      dest: "الوجهات",
      typesAr: "أنواع الشحن (عربي)",
      typesEn: "أنواع الشحن (إنجليزي)",
      services: "الخدمات",
      back: "الغلاف الخلفي لدليل الشحن",
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
  ...BACKLINKS,
};

function buildBlocks(lang) {
  const copy = COPY[lang];
  return [
    {
      type: "breadcrumbs",
      style: BREADCRUMB_STYLE,
      content: {
        items: [
          { label: copy.home, href: "/" },
          { label: copy.cargo, href: "/cargo" },
          { label: copy.breadcrumb, href: "" },
        ],
        separator: "/",
        ariaLabel: "Breadcrumb",
        links: [],
      },
    },
    {
      type: "cargo-guide-view",
      style: VIEW_STYLE,
      content: {
        title: copy.title,
        description: copy.description,
        pages: buildPages(copy.alts),
        links: [],
      },
    },
  ];
}

const workDir = mkdtempSync(join(tmpdir(), "cargo-guide-"));
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

{
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id: "cargo-guide-view", label: "Cargo Guide View" },
  });
  if (res?.message) fail(`component_types upsert failed: ${restError(res, "?")}`);
  console.log("component type ok: cargo-guide-view");
}

for (const item of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/cargo-guide/${item.name}`, {
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
        label: "Cargo Guide",
        description: "Fly Cham cargo brochure flipbook",
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
        label: "Cargo Guide",
        description: "Fly Cham cargo brochure flipbook",
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
console.log("Done. Open /en/cargo/cargo-guide");
