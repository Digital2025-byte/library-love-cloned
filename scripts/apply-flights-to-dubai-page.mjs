/**
 * Seed the CMS page "flights-to-dubai" with the same blocks as the static
 * Dubai guide (breadcrumbs, hero + stats, narratives, things to do, booking).
 * Uses existing component types only. Photos are uploaded to
 * cms-media/flights-to-dubai and stored as public URLs.
 *
 * Idempotent: re-running replaces this page's blocks.
 *
 *   node scripts/apply-flights-to-dubai-page.mjs
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

const PAGE_SLUG = "flights-to-dubai";
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images");
const MEDIA = `${url}/storage/v1/object/public/cms-media/flights-to-dubai`;

const UPLOADS = [
  { name: "hero.jpg", file: "our-destenations/dubai.jpg", type: "image/jpeg" },
  { name: "narrative-cuisine.png", file: "city-sights/sight-flame-towers.png", type: "image/png" },
  { name: "narrative-places.png", file: "city-sights/sight-burj-khalifa.png", type: "image/png" },
  { name: "narrative-activities.png", file: "city-sights/sight-doha-corniche.png", type: "image/png" },
  { name: "thing-al-fahidi.png", file: "city-sights/sight-roman-theatre.png", type: "image/png" },
  { name: "thing-global-village.png", file: "city-sights/sight-colosseum.png", type: "image/png" },
];

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

const HERO_STYLE = {
  cardBg: "white",
  height: "default",
  iconColor: "primary-1",
  showStats: true,
  titleColor: "50",
  countryColor: "50",
  overlayColor: "primary-1",
  tileLabelColor: "600",
  tileValueColor: "700",
  metaColor: "600",
  titleColorHover: "50",
  titleFontWeight: "semibold",
  countryColorHover: "50",
  countryFontWeight: "semibold",
  titleFontWeightHover: "semibold",
  countryFontWeightHover: "semibold",
  ...BACKLINKS,
};

const NARRATIVES_STYLE = {
  bodyColor: "800",
  sectionBg: "100",
  imageRadius: "lg",
  showSectionBg: false,
  bodyColorHover: "800",
  bodyFontWeight: "normal",
  sectionPadding: "none",
  bodyFontWeightHover: "normal",
  ...BACKLINKS,
};

const THINGS_STYLE = {
  cardGap: "default",
  columns: "3",
  showCta: true,
  buttonBg: "secondary",
  badgeText: "50",
  buttonText: "btn",
  cardRadius: "lg",
  showHeader: true,
  titleColor: "700",
  overlayColor: "secondary-2",
  showSubtitle: true,
  sectionBg: "100",
  showSectionBg: false,
  subtitleColor: "800",
  badgeTextHover: "50",
  cardTitleColor: "secondary",
  sectionPadding: "default",
  buttonTextHover: "btn",
  titleColorHover: "700",
  titleFontWeight: "semibold",
  badgeBorderColor: "50",
  subtitleColorHover: "800",
  subtitleFontWeight: "normal",
  badgeTextFontWeight: "semibold",
  cardTitleFontWeight: "semibold",
  buttonTextFontWeight: "semibold",
  cardDescriptionColor: "50",
  titleFontWeightHover: "semibold",
  subtitleFontWeightHover: "normal",
  badgeTextFontWeightHover: "semibold",
  cardTitleFontWeightHover: "semibold",
  buttonTextFontWeightHover: "semibold",
  cardDescriptionColorHover: "50",
  cardDescriptionFontWeight: "normal",
  cardDescriptionFontWeightHover: "normal",
  ...BACKLINKS,
};

const NARRATIVE_ROWS = [
  { id: "special", image: "hero.jpg", imageFirst: true, titleColor: "700", titleFontWeight: "semibold" },
  { id: "cuisine", image: "narrative-cuisine.png", imageFirst: false, titleColor: "primary-800", titleFontWeight: "semibold" },
  { id: "places", image: "narrative-places.png", imageFirst: true, titleColor: "primary-800", titleFontWeight: "semibold" },
  { id: "activities", image: "narrative-activities.png", imageFirst: false, titleColor: "primary-800", titleFontWeight: "bold" },
];

const THING_ROWS = [
  { id: "alFahidi", icon: "buildings", image: "thing-al-fahidi.png" },
  { id: "globalVillage", icon: "globe", image: "thing-global-village.png" },
  { id: "burjKhalifa", icon: "binoculars", image: "narrative-places.png" },
];

const STAT_ROWS = [
  { id: "airport", icon: "airTrafficControl" },
  { id: "time", icon: "clock" },
  { id: "weather", icon: "cloudSun" },
  { id: "currency", icon: "money" },
];

function locale(lang) {
  return JSON.parse(
    readFileSync(
      resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`),
      "utf8",
    ),
  );
}

function imageUrl(name) {
  return `${MEDIA}/${name}`;
}

function buildBlocks(lang) {
  const t = locale(lang);
  const guide = t.destinationGuides.dubai;
  const common = t.common;

  return [
    {
      type: "breadcrumbs",
      style: BREADCRUMB_STYLE,
      content: {
        separator: "/",
        ariaLabel: "Breadcrumb",
        items: [
          { label: common.home, href: "/" },
          { label: common.whereWeFly, href: "/our-destinations" },
          { label: guide.breadcrumb, href: "" },
        ],
        links: [],
      },
    },
    {
      type: "destination-hero-stats",
      style: HERO_STYLE,
      content: {
        title: guide.hero.title,
        country: guide.hero.country,
        imageUrl: imageUrl("hero.jpg"),
        imageAlt: guide.hero.imageAlt,
        stats: STAT_ROWS.map((row) => ({
          icon: row.icon,
          label: guide.stats[row.id].label,
          value: guide.stats[row.id].value,
          detail: guide.stats[row.id].detail,
        })),
        links: [],
      },
    },
    {
      type: "destination-narratives",
      style: NARRATIVES_STYLE,
      content: {
        items: NARRATIVE_ROWS.map((row) => ({
          id: row.id,
          title: guide.narratives[row.id].title,
          description: guide.narratives[row.id].description,
          imageUrl: imageUrl(row.image),
          imageAlt: guide.narratives[row.id].imageAlt,
          imageFirst: row.imageFirst,
          titleColor: row.titleColor,
          titleFontWeight: row.titleFontWeight,
        })),
        links: [],
      },
    },
    {
      type: "destination-things-to-do",
      style: THINGS_STYLE,
      content: {
        title: guide.thingsToDo.title,
        subtitle: guide.thingsToDo.subtitle,
        cta: guide.thingsToDo.cta,
        ctaHref: "/our-destinations/city-sights",
        items: THING_ROWS.map((row) => ({
          id: row.id,
          icon: row.icon,
          badge: guide.thingsToDo.items[row.id].badge,
          title: guide.thingsToDo.items[row.id].title,
          description: "",
          imageUrl: imageUrl(row.image),
          imageAlt: guide.thingsToDo.items[row.id].imageAlt,
        })),
        links: [],
      },
    },
    {
      type: "booking-widget",
      style: {},
      content: {},
    },
  ];
}

const workDir = mkdtempSync(join(tmpdir(), "flights-to-dubai-"));
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

for (const item of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/flights-to-dubai/${item.name}`, {
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
        label: "Flights to Dubai",
        description: "Destination guide for flights to Dubai",
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
        label: "Flights to Dubai",
        description: "Destination guide for flights to Dubai",
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
