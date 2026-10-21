/**
 * Swap the "baggage-calculator" block on the Baggage Calculator page for the
 * new "excess-baggage-calculator" block (EN + AR), at the same position:
 *   1. Register the excess-baggage-calculator component type.
 *   2. Per language: insert the new component and re-point the page link that
 *      held the old calculator to it. The old component row is left in place
 *      (unlinked) so the swap can be rolled back by re-pointing the link; its
 *      id is printed. The "baggage-calculator" type stays in the library.
 *
 * Copy comes from cms2's demo i18n (excessBaggageCalculator), same as Add
 * component in the page builder. From / To options are the POS list at render
 * time; an existing block still on the old airport shape is upgraded in place
 * (POS-code defaults, airport list/currency/no-price text dropped).
 *
 * Frontend URL: /travel-experience/before-you-fly/baggage-calculator
 * CMS slug:     baggage-calculator
 *
 *   node scripts/apply-excess-baggage-calculator.mjs [--dry-run]
 *   node scripts/apply-excess-baggage-calculator.mjs --repair   # re-write the
 *     seeded content/style onto the existing excess-baggage-calculator blocks
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

const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL).replace(/\/$/, "");
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";
const DRY_RUN = process.argv.includes("--dry-run");
const REPAIR = process.argv.includes("--repair");

const PAGE_SLUG = "baggage-calculator";
const OLD_TYPE = "baggage-calculator";
const NEW_TYPE = "excess-baggage-calculator";
const NEW_LABEL = "Excess Baggage Calculator";

// From / To list the POS countries (GET /api/public/pos-list); content only
// pre-selects POS codes. Keys dropped since (airport list → POS, then the
// "Illustrative price only" note removed). The price itself now comes from
// GET /api/public/baggage-prices/quote, with `unavailableText` when unpriced.
const RETIRED_KEYS = ["airports", "currency", "resultNote"];
const RETIRED_STYLE_KEYS = [
  "showResultNote",
  "noteItalic",
  "noteColor",
  "noteFontWeight",
  "noteColorHover",
  "noteFontWeightHover",
];
/** Content keys added later; filled from the seed copy when missing. */
const ADDED_KEYS = ["unavailableText"];
const DEFAULT_FROM = "sy";
const DEFAULT_TO = "ae";
const WEIGHTS_KG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30];

/** color + weight + both hover twins for one text role. */
const text = (colorKey, color, weight, hoverColor = color) => {
  const weightKey = colorKey.endsWith("Color")
    ? colorKey.replace(/Color$/, "FontWeight")
    : `${colorKey}FontWeight`;
  return {
    [colorKey]: color,
    [weightKey]: weight,
    [`${colorKey}Hover`]: hoverColor,
    [`${weightKey}Hover`]: weight,
  };
};

// = DEFAULT_EXCESS_BAGGAGE_STYLE in cms2 ExcessBaggageCalculator/utils/style.js.
const STYLE = {
  sectionPadding: "none",
  showSectionBg: false,
  sectionBg: "100",
  showTitle: true,
  showSubtitle: true,
  cardBg: "background",
  showCardBorder: true,
  cardBorderColor: "200",
  showCardShadow: false,
  dividerColor: "200",
  showLink: true,
  fieldBg: "100",
  fieldBorderColor: "200",
  iconColor: "700",
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "600", "normal"),
  ...text("labelColor", "600", "normal"),
  ...text("valueColor", "800", "normal"),
  ...text("placeholderColor", "500", "normal"),
  ...text("descriptionColor", "600", "normal"),
  ...text("priceColor", "primary-1", "bold"),
  ...text("ctaColor", "primary-1", "normal", "primary-800"),
  showButtonIcon: true,
  buttonBg: "primary-1",
  buttonBgHover: "",
  ...text("buttonText", "50", "semibold"),
  disabledBg: "300",
  disabledText: "500",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

function loadDemoLocale(lang) {
  const path = resolve(process.cwd(), `../flychamadmin/src/cms2/i18n/locales/${lang}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

/** = buildExcessBaggageData() content in cms2 ExcessBaggageCalculator/utils/data.js. */
function buildContent(lang) {
  const demo = loadDemoLocale(lang);
  const copy = demo.excessBaggageCalculator;
  if (!copy?.title) throw new Error(`excessBaggageCalculator copy missing in ${lang}.json`);
  return {
    title: copy.title,
    subtitle: copy.subtitle,
    fromLabel: copy.fromLabel,
    toLabel: copy.toLabel,
    weightLabel: copy.weightLabel,
    fromPlaceholder: copy.fromPlaceholder,
    toPlaceholder: copy.toPlaceholder,
    weightPlaceholder: copy.weightPlaceholder,
    defaultFrom: DEFAULT_FROM,
    defaultTo: DEFAULT_TO,
    defaultWeight: "5",
    weights: WEIGHTS_KG.map((kg) => ({
      id: `kg-${kg}`,
      value: String(kg),
      label: `${kg} ${copy.weightUnit}`,
    })),
    buttonLabel: copy.buttonLabel,
    buttonIcon: "Calculator",
    resultLabel: copy.resultLabel,
    unavailableText: copy.unavailableText,
    linkLabel: copy.linkLabel,
    linkHref: "/travel-experience/before-you-fly/manage-booking",
    links: [],
  };
}

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query } = {}) {
  const qs = query ? `?${query}` : "";
  const args = [
    "-sS",
    "-X",
    method,
    `${url}${path}${qs}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    "Content-Type: application/json",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  // Send bodies from a UTF-8 file: passing JSON as a CLI arg goes through the
  // Windows ANSI codepage and turns Arabic into "????".
  let dir;
  if (body !== undefined) {
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

function fail(message, payload) {
  console.error(message, restError(payload, "unknown error"));
  process.exit(1);
}

function componentOf(link) {
  const row = link?.components;
  return (Array.isArray(row) ? row[0] : row) || null;
}

function componentTypeOf(link) {
  return componentOf(link)?.type || null;
}


/**
 * Stored content from an older shape (airport list + DAM/DXB defaults, price
 * note): drop the retired keys and pre-select POS codes, keeping every other
 * edit. Null when it is already current.
 */
function upgradedContent(stored, lang) {
  const outdated =
    RETIRED_KEYS.some((key) => key in stored) ||
    ADDED_KEYS.some((key) => !(key in stored)) ||
    !("defaultFrom" in stored) ||
    !("defaultTo" in stored);
  if (!outdated) return null;
  const seed = buildContent(lang);
  const next = Object.fromEntries(
    Object.entries(stored).filter(([key]) => !RETIRED_KEYS.includes(key))
  );
  for (const key of ADDED_KEYS) if (!(key in next)) next[key] = seed[key];
  // Pre-selections are the editor's call; only fill them when missing (a code
  // that isn't a POS option simply shows the placeholder).
  if (!("defaultFrom" in next)) next.defaultFrom = DEFAULT_FROM;
  if (!("defaultTo" in next)) next.defaultTo = DEFAULT_TO;
  return next;
}

/** Stored style without the retired price/note keys; null when none are left. */
function upgradedStyle(stored) {
  if (!RETIRED_STYLE_KEYS.some((key) => key in stored)) return null;
  return Object.fromEntries(
    Object.entries(stored).filter(([key]) => !RETIRED_STYLE_KEYS.includes(key))
  );
}

console.log("Target project:", url, DRY_RUN ? "(dry run)" : "");

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail("Sign-in failed:", auth);
const token = auth.access_token;
console.log("Signed in as", email);

if (!DRY_RUN) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id: NEW_TYPE, label: NEW_LABEL },
  });
  if (res?.message) fail("component_types upsert failed:", res);
}
console.log("component_types ok:", NEW_TYPE);

const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
if (!Array.isArray(pages) || !pages[0]?.id) fail(`page "${PAGE_SLUG}" not found:`, pages);
const pageId = pages[0].id;

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type,content,style)&order=position`,
  });
  if (!Array.isArray(links)) fail(`page_components lookup failed (${lang}):`, links);

  const current = links.find((row) => componentTypeOf(row) === NEW_TYPE);
  if (current) {
    if (!REPAIR) {
      const allContent = componentOf(current)?.content || {};
      const allStyle = componentOf(current)?.style || {};
      const content = upgradedContent(allContent[lang] || {}, lang);
      const style = upgradedStyle(allStyle[lang] || {});
      if (!content && !style) {
        console.log(`kept ${lang}: ${NEW_TYPE} already @${current.position} (${current.component_id})`);
        continue;
      }
      if (!DRY_RUN) {
        const res = curl("PATCH", "/rest/v1/components", {
          token,
          query: `id=eq.${current.component_id}`,
          prefer: "return=minimal",
          body: {
            ...(content ? { content: { ...allContent, [lang]: content } } : null),
            ...(style ? { style: { ...allStyle, [lang]: style } } : null),
          },
        });
        if (res?.message) fail(`upgrade failed (${lang}):`, res);
      }
      console.log(
        `${DRY_RUN ? "would upgrade" : "upgraded"} ${lang} @${current.position}:` +
          (content ? ` content (added ${ADDED_KEYS.join("/")}, retired keys dropped; From/To ${content.defaultFrom} → ${content.defaultTo})` : "") +
          (style ? " style (price/note keys dropped)" : "")
      );
      continue;
    }
    if (!DRY_RUN) {
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${current.component_id}`,
        prefer: "return=minimal",
        body: { style: { [lang]: STYLE }, content: { [lang]: buildContent(lang) } },
      });
      if (res?.message) fail(`repair failed (${lang}):`, res);
    }
    console.log(`repaired ${NEW_TYPE} (${lang}) @${current.position}`);
    continue;
  }

  const old = links.find((row) => componentTypeOf(row) === OLD_TYPE);
  if (!old) fail(`no ${OLD_TYPE} block on ${PAGE_SLUG} (${lang}) to replace`, null);

  if (DRY_RUN) {
    console.log(`would replace ${lang} @${old.position}: ${OLD_TYPE} ${old.component_id} → new ${NEW_TYPE}`);
    continue;
  }

  const inserted = curl("POST", "/rest/v1/components", {
    token,
    prefer: "return=representation",
    body: {
      type: NEW_TYPE,
      position: old.position,
      style: { [lang]: STYLE },
      content: { [lang]: buildContent(lang) },
    },
  });
  const comp = Array.isArray(inserted) ? inserted[0] : inserted;
  if (!comp?.id) fail(`components insert failed (${lang}):`, inserted);

  const relinked = curl("PATCH", "/rest/v1/page_components", {
    token,
    query: `id=eq.${old.id}`,
    prefer: "return=representation",
    body: { component_id: comp.id },
  });
  if (!Array.isArray(relinked) || !relinked.length) fail(`page link update failed (${lang}):`, relinked);

  console.log(
    `replaced ${lang} @${old.position}: ${OLD_TYPE} ${old.component_id} (kept, unlinked) → ${NEW_TYPE} ${comp.id}`
  );
}

console.log("Done. Open /en/travel-experience/before-you-fly/baggage-calculator");
