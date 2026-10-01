/**
 * One-off admin task for the Travel Update detail pages (Figma 40139:21964).
 * Each /travel-updates/<id> URL renders the CMS page `travel-update-<kebab id>`
 * when it exists (new_fly_cham falls back to the static page otherwise).
 *   1. Register the travel-update-hero / travel-update-detail component types
 *      (+ ensure breadcrumbs exists).
 *   2. Ensure a page row per update in UPDATES.
 *   3. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs            Home / Help / Travel Updates
 *        1 travel-update-hero     tag (type + date), title, subtitle
 *        2 travel-update-detail   overview + guideline cards | hub status + resources
 *
 * Copy comes from new_fly_cham's `travelUpdates.*` locale strings.
 *
 *   node scripts/apply-travel-update-pages.mjs
 *   node scripts/apply-travel-update-pages.mjs --print-demo   # cms2 demo i18n JSON
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
const HERO = "travel-update-hero";
const DETAIL = "travel-update-detail";

const COMPONENT_TYPES = [
  { id: CRUMBS, label: "Breadcrumbs" },
  { id: HERO, label: "Travel Update Hero" },
  { id: DETAIL, label: "Travel Update Detail" },
];

/** Updates to publish as CMS pages (id = the /travel-updates/<id> segment). */
const UPDATES = [
  { id: "loungeAccess", badge: "travelUpdate", dateKey: "october242025" },
  {
    id: "autumnWeather",
    badge: "operationalAdvisory",
    dateKey: "october242025",
    hubs: [
      { id: "lhr", tone: "warning" },
      { id: "fra", tone: "warning" },
      { id: "dam", tone: "normal" },
    ],
    guidelines: [
      { id: "routeChange", icon: "Path", link: { key: "contactCenter", href: "/help/contact-us" } },
      { id: "dateChange", icon: "CalendarBlank", link: { key: "manageBooking", href: "/coming-soon" } },
      { id: "refund", icon: "Receipt", bullets: ["online", "agency"] },
    ],
  },
];

const RESOURCES = [
  { id: "flightTracker", href: "/help" },
  { id: "damascusGuide", href: "/our-destinations/flights-to-damascus" },
  { id: "baggageClaim", href: "/travel-experience/after-travel" },
];

const kebab = (id) => id.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
export const pageSlugFor = (id) => `travel-update-${kebab(id)}`;

// Figma breadcrumbs: Home 14px medium #5F5F5C, current page semibold primary.
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

// cms2 DEFAULT_TRAVEL_UPDATE_HERO_STYLE.
const HERO_STYLE = {
  showTag: true,
  showSubtitle: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "none",
  tagBg: "secondary",
  badgeText: "primary-1",
  badgeTextFontWeight: "semibold",
  badgeTextHover: "primary-1",
  badgeTextFontWeightHover: "semibold",
  titleColor: "primary-1",
  titleFontWeight: "bold",
  titleColorHover: "primary-1",
  titleFontWeightHover: "bold",
  subtitleColor: "700",
  subtitleFontWeight: "medium",
  subtitleColorHover: "700",
  subtitleFontWeightHover: "medium",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

// cms2 DEFAULT_TRAVEL_UPDATE_DETAIL_STYLE.
const DETAIL_STYLE = {
  showGuidelines: true,
  showSidebar: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "none",
  articleBg: "background",
  sidebarBg: "background",
  guidelineBg: "100",
  dividerColor: "300",
  titleColor: "700",
  titleFontWeight: "semibold",
  bodyColor: "600",
  bodyFontWeight: "normal",
  headingColor: "primary-1",
  headingFontWeight: "semibold",
  headingIconColor: "primary-1",
  cardTitleColor: "700",
  cardTitleFontWeight: "semibold",
  cardIconColor: "700",
  cardBodyColor: "600",
  cardBodyFontWeight: "normal",
  bulletColor: "primary-1",
  inlineLinkColor: "primary-1",
  sectionTitleColor: "700",
  sectionTitleFontWeight: "bold",
  nameColor: "600",
  nameFontWeight: "semibold",
  statusWarningColor: "secondary",
  statusNormalColor: "primary-1",
  itemColor: "primary-1",
  itemFontWeight: "medium",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  bodyColorHover: "600",
  bodyFontWeightHover: "normal",
  headingColorHover: "primary-1",
  headingFontWeightHover: "semibold",
  cardTitleColorHover: "700",
  cardTitleFontWeightHover: "semibold",
  cardBodyColorHover: "600",
  cardBodyFontWeightHover: "normal",
  sectionTitleColorHover: "700",
  sectionTitleFontWeightHover: "bold",
  nameColorHover: "600",
  nameFontWeightHover: "semibold",
  itemColorHover: "primary-1",
  itemFontWeightHover: "medium",
};

function loadLocale(lang) {
  const path = resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Content for the hero + detail blocks of one update in one language. */
function buildUpdateContent(update, lang) {
  const locale = loadLocale(lang);
  const tu = locale.travelUpdates;
  const copy = tu.detail[update.id];
  const shared = tu.detail.shared;

  const hero = {
    tag: `${shared.badgeTypes[update.badge]}  ${tu.dates[update.dateKey]}`,
    title: copy.title,
    subtitle: copy.subtitle || "",
    links: [],
  };

  const guidelines = (update.guidelines || []).map((g) => {
    const text = copy.guidelines?.[g.id] || {};
    const link = g.link ? `[${tu.advisory.links[g.link.key]}](${g.link.href})` : "";
    return {
      icon: g.icon,
      title: text.title || "",
      body: `${text.before || ""}${link}${text.after || ""}`.trim(),
      bullets: (g.bullets || []).map((b) => text.bullets?.[b] || "").filter(Boolean).join("\n"),
    };
  });

  const detail = {
    overviewTitle: copy.overview?.title || "",
    overview: (copy.overview?.paragraphs || []).join("\n\n"),
    guidelinesIcon: "Question",
    guidelinesTitle: copy.guidelinesTitle || "",
    guidelines,
    hubsTitle: update.hubs?.length ? shared.hubStatus : "",
    hubs: (update.hubs || []).map((h) => ({
      name: copy.hubs?.[h.id]?.name || "",
      status: copy.hubs?.[h.id]?.status || "",
      tone: h.tone,
    })),
    resourcesTitle: shared.resources,
    resources: RESOURCES.map((r) => ({ label: shared.resourceLinks[r.id], href: r.href })),
  };

  const crumbs = {
    items: [
      { label: locale.common.home, href: "/" },
      { label: locale.common.help, href: "/help" },
      { label: tu.breadcrumb, href: "/travel-updates" },
    ],
    separator: "/",
    ariaLabel: lang === "ar" ? "مسار التنقل" : "Breadcrumb",
    links: [],
  };

  return { hero, detail, crumbs };
}

function buildBlocks(update, lang) {
  const { hero, detail, crumbs } = buildUpdateContent(update, lang);
  return [
    { type: CRUMBS, style: CRUMBS_STYLE, content: crumbs },
    { type: HERO, style: HERO_STYLE, content: hero },
    { type: DETAIL, style: DETAIL_STYLE, content: detail },
  ];
}

if (process.argv.includes("--print-demo")) {
  const demo = {};
  for (const lang of ["en", "ar"]) {
    const { hero, detail } = buildUpdateContent(UPDATES[1], lang);
    demo[lang] = {
      travelUpdateHero: { tag: hero.tag, title: hero.title, subtitle: hero.subtitle },
      travelUpdateDetail: {
        overviewTitle: detail.overviewTitle,
        overview: detail.overview,
        guidelinesTitle: detail.guidelinesTitle,
        guidelines: detail.guidelines,
        hubsTitle: detail.hubsTitle,
        hubs: detail.hubs,
        resourcesTitle: detail.resourcesTitle,
        resources: detail.resources,
      },
    };
  }
  console.log(JSON.stringify(demo));
  process.exit(0);
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

for (const row of COMPONENT_TYPES) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: row,
  });
  if (res?.message) fail("component_types upsert failed", res);
  console.log("component_types ok:", row.id);
}

for (const update of UPDATES) {
  const slug = pageSlugFor(update.id);
  const en = buildUpdateContent(update, "en");

  let pageId;
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${slug}&select=id` });
  if (!Array.isArray(existing)) fail(`pages lookup failed (${slug})`, existing);
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", slug, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug,
        label: `Travel Update: ${en.hero.title}`,
        description: en.hero.subtitle,
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) fail(`pages insert failed (${slug})`, inserted);
    pageId = row.id;
    console.log("page created:", slug, pageId);
  }

  for (const lang of ["en", "ar"]) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
    });
    if (!Array.isArray(links)) fail(`page_components lookup failed (${slug} ${lang})`, links);

    if (links.length > 0) {
      const order = links
        .slice()
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((row) => `${row.position}:${componentTypeOf(row)}`)
        .join(" → ");
      console.log(`kept ${slug} ${lang} (${links.length} blocks):`, order);
      continue;
    }

    const blocks = buildBlocks(update, lang);
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
      if (!comp?.id) fail(`components insert failed (${slug} ${lang} ${block.type})`, inserted);

      const link = curl("POST", "/rest/v1/page_components", {
        token,
        prefer: "return=minimal",
        body: { page_id: pageId, component_id: comp.id, position, lang },
      });
      if (link?.message) fail(`page_components insert failed (${slug} ${lang} ${block.type})`, link);
      console.log(`seeded ${slug} ${block.type} (${lang}) @${position}:`, comp.id);
    }
  }
}

console.log("Done. Open /en/travel-updates/loungeAccess and /en/travel-updates/autumnWeather");
