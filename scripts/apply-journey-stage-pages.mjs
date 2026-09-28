/**
 * One-off admin task: turn the three static journey-stage pages into CMS pages
 * built from the SAME components as the "before-you-fly" page:
 *
 *   /travel-experience/at-the-airport   CMS slug: at-the-airport
 *   /travel-experience/onboard          CMS slug: onboard
 *   /travel-experience/after-travel     CMS slug: after-travel
 *
 * Blocks (same order as before-you-fly): page-media-hero,
 * before-you-fly-services, journey-stage-next-steps.
 *
 *   - STYLE is copied from the live before-you-fly page, per language, so the
 *     stages look exactly like it (including any edits made in the editor).
 *   - CONTENT comes from new_fly_cham's locale files (`atTheAirport`,
 *     `onboard`, `afterTravel` in src/i18n/locales/{en,ar}.json) — the copy the
 *     static pages rendered. Item ids / links / icons / photos mirror
 *     new_fly_cham/src/pages/before-you-fly/utils/journeyStages.js.
 *   - Photos are the before-you-fly placeholders already in cms-media.
 *
 * Idempotent: creates each page only if missing and seeds a language only when
 * that language has no blocks yet. Request bodies go through
 * `curl --data-binary @file` (plain `-d` mangles Arabic on Windows).
 *
 *   node scripts/apply-journey-stage-pages.mjs
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
const CMS_API = process.env.CMS_API_BASE_URL || "http://187.127.155.20:3000";

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const TEMPLATE_SLUG = "before-you-fly";
const HERO = "page-media-hero";
const SERVICES = "before-you-fly-services";
const NEXT_STEPS = "journey-stage-next-steps";
const BLOCK_ORDER = [HERO, SERVICES, NEXT_STEPS];
const LANGS = ["en", "ar"];

const MEDIA = `${String(url).replace(/\/$/, "")}/storage/v1/object/public/cms-media/before-you-fly`;
const img = (name) => `${MEDIA}/${name}.webp`;
const HELP = "/help";

// Mirrors journeyStages.js (ids, photos, links, icons).
const STAGES = [
  {
    slug: "at-the-airport",
    i18nKey: "atTheAirport",
    description: "Airport services and facilities",
    services: [
      { id: "lounge", image: "manage-booking" },
      { id: "wheelchair", image: "unaccompanied-minor" },
      { id: "vipBoarding", image: "ya-marhaba" },
    ],
    nextSteps: [
      { id: "onboardServices", href: "/travel-experience/onboard", icon: "airplane" },
      { id: "getSupport", href: HELP, icon: "headset" },
    ],
  },
  {
    slug: "onboard",
    i18nKey: "onboard",
    description: "Onboard services and comfort",
    services: [
      { id: "travelClasses", image: "seat-selection" },
      { id: "meals", image: "limousine" },
      { id: "entertainment", image: "ya-marhaba" },
      { id: "birthdayCakes", image: "unaccompanied-minor" },
      { id: "travelerMagazine", image: "manage-booking" },
      { id: "kidsToys", image: "oxygen" },
      { id: "wifiOnboard", image: "seat-selection" },
    ],
    nextSteps: [
      { id: "afterTravel", href: "/travel-experience/after-travel", icon: "airplaneLanding" },
      { id: "getSupport", href: HELP, icon: "headset" },
    ],
  },
  {
    slug: "after-travel",
    i18nKey: "afterTravel",
    description: "Services and support after your flight",
    services: [
      { id: "baggageClaims", image: "manage-booking" },
      { id: "refunds", image: "ya-marhaba" },
      { id: "loyaltyMiles", image: "limousine" },
      { id: "feedbackSupport", image: "oxygen" },
    ],
    nextSteps: [
      { id: "helpSupport", href: HELP, icon: "headset" },
      { id: "quickAnswer", href: "/help/faqs", icon: "question" },
    ],
  },
];

const LOCALES = Object.fromEntries(
  LANGS.map((lang) => [
    lang,
    JSON.parse(
      readFileSync(
        resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`),
        "utf8",
      ),
    ),
  ]),
);

function buildContent(stage, lang, type) {
  const t = LOCALES[lang][stage.i18nKey];
  if (!t) throw new Error(`Missing locale ${lang}.${stage.i18nKey}`);
  if (type === HERO) {
    return {
      title: t.hero.title,
      subtitle: t.hero.subtitle,
      imageUrl: img("hero"),
      imageAlt: t.hero.imageAlt,
      links: [],
    };
  }
  if (type === SERVICES) {
    return {
      title: t.sectionTitle || "",
      subtitle: t.sectionDescription || "",
      learnMore: t.learnMore,
      items: stage.services.map((row) => ({
        id: row.id,
        imageUrl: img(row.image),
        imageAlt: t.services[row.id].imageAlt,
        title: t.services[row.id].title,
        description: t.services[row.id].description,
        href: HELP,
        cta: "",
      })),
      links: [],
    };
  }
  return {
    items: stage.nextSteps.map((row) => ({
      id: row.id,
      icon: row.icon,
      title: t.nextSteps[row.id].title,
      description: t.nextSteps[row.id].description,
      href: row.href,
      cta: t.nextSteps[row.id].cta,
    })),
    links: [],
  };
}

// ---------------------------------------------------------------- HTTP

const workDir = mkdtempSync(join(tmpdir(), "journey-stages-"));
let bodySeq = 0;

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query } = {}) {
  const origin = String(url).replace(/\/$/, "");
  const qs = query ? `?${query}` : "";
  const args = ["-sS", "-X", method, `${origin}${path}${qs}`,
    "-H", `apikey: ${key}`, "-H", "Content-Type: application/json; charset=utf-8"];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  if (body !== undefined) {
    const file = join(workDir, `body-${(bodySeq += 1)}.json`);
    writeFileSync(file, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${file}`);
  }
  const stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
  const trimmed = stdout.trim();
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

// ---------------------------------------------------------------- run

console.log("Target project:", url);

// Template styles: the live before-you-fly page, per language.
const templateStyle = {};
for (const lang of LANGS) {
  const raw = execFileSync(
    "curl.exe",
    ["-sS", `${CMS_API}/api/public/get-page?slug=${TEMPLATE_SLUG}&lang=${lang}`],
    { encoding: "utf8" },
  );
  const page = JSON.parse(raw);
  templateStyle[lang] = {};
  for (const block of page.blocks ?? []) {
    templateStyle[lang][block.sectionId] = block.style?.[lang] ?? block.style ?? {};
  }
  for (const type of BLOCK_ORDER) {
    if (!templateStyle[lang][type]) fail(`Template page has no ${type} block in ${lang}`);
  }
}
console.log("Copied template styles from", TEMPLATE_SLUG);

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail(`Sign-in failed: ${restError(auth, "no access_token")}`);
const token = auth.access_token;
console.log("Signed in as", email);

for (const stage of STAGES) {
  const label = LOCALES.en[stage.i18nKey].hero.title;
  let pageId;
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${stage.slug}&select=id`,
  });
  if (!Array.isArray(existing)) fail(`pages lookup failed: ${restError(existing, "?")}`);
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log(`page exists: ${stage.slug} ${pageId}`);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: { slug: stage.slug, label, description: stage.description, status: "published" },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) fail(`pages insert failed (${stage.slug}): ${restError(inserted, "?")}`);
    pageId = row.id;
    console.log(`page created: ${stage.slug} ${pageId}`);
  }

  for (const lang of LANGS) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id`,
    });
    if (!Array.isArray(links)) fail(`page_components lookup failed: ${restError(links, "?")}`);
    if (links.length) {
      console.log(`  ${stage.slug} ${lang}: already has ${links.length} block(s) — skipped`);
      continue;
    }
    for (let position = 0; position < BLOCK_ORDER.length; position += 1) {
      const type = BLOCK_ORDER[position];
      const inserted = curl("POST", "/rest/v1/components", {
        token,
        prefer: "return=representation",
        body: {
          type,
          position,
          style: { [lang]: templateStyle[lang][type] },
          content: { [lang]: buildContent(stage, lang, type) },
        },
      });
      const comp = Array.isArray(inserted) ? inserted[0] : inserted;
      if (!comp?.id) fail(`components insert failed (${stage.slug} ${lang} ${type}): ${restError(inserted, "?")}`);
      const link = curl("POST", "/rest/v1/page_components", {
        token,
        prefer: "return=minimal",
        body: { page_id: pageId, component_id: comp.id, position, lang },
      });
      if (link?.message) fail(`page_components insert failed: ${restError(link, "?")}`);
    }
    console.log(`  ${stage.slug} ${lang}: seeded ${BLOCK_ORDER.length} blocks`);
  }
}

rmSync(workDir, { recursive: true, force: true });
console.log("Done.");
