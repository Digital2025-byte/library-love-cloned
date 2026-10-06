/**
 * Adds the Baggage Calculator RESULTS blocks (Figma 40814:22701 desktop /
 * 40814:23739 mobile) to the existing "baggage-calculator" page, right after
 * the calculator, in EN + AR:
 *   baggage-route-summary         "Damascus → Dubai", class chip, tier
 *   baggage-allowance-breakdown   Each adult/child — Economy (classFilter economy)
 *   baggage-allowance-breakdown   Each adult/child — Business (classFilter business)
 *   baggage-allowance-breakdown   Each infant with no booked seat
 *   baggage-addons                Additional baggage
 * Later blocks shift down. The calculator's Calculate link is pointed at this
 * page's #results. All result blocks show only once the URL has ?from=&to=.
 *
 *   node scripts/apply-baggage-calculator-results.mjs
 *   node scripts/apply-baggage-calculator-results.mjs --repair
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

const PAGE_SLUG = "baggage-calculator";
const FOLDER = "baggage-calculator";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), `../new_fly_cham/src/assets/images-webp/${FOLDER}`);
const UPLOADS = ["checked-bag.webp", "cabin-bag.webp", "tier-gold.webp"];
const CALCULATE_HREF = "/travel-experience/before-you-fly/baggage-calculator#results";
const RESULT_TYPES = ["baggage-route-summary", "baggage-allowance-breakdown", "baggage-addons"];

const COMPONENT_TYPES = [
  { id: "baggage-route-summary", label: "Baggage Route Summary" },
  { id: "baggage-allowance-breakdown", label: "Baggage Allowance Breakdown" },
  { id: "baggage-addons", label: "Baggage Add-ons" },
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
  const weightKey = colorKey.endsWith("Color")
    ? colorKey.replace(/Color$/, "FontWeight")
    : `${colorKey}FontWeight`;
  return {
    [colorKey]: color,
    [weightKey]: weight,
    [`${colorKey}Hover`]: color,
    [`${weightKey}Hover`]: weight,
  };
};

const LAYOUT = { onlyAfterCalculate: true, sectionPadding: "none", showSectionBg: false, sectionBg: "100" };

const SUMMARY_STYLE = {
  ...LAYOUT,
  showClass: true,
  showTier: true,
  ...text("titleColor", "primary-1", "bold"),
  arrowColor: "400",
  chipBg: "",
  ...text("chipText", "primary-1", "normal"),
  dividerColor: "700",
  ...text("nameColor", "foreground", "normal"),
  ...BACKLINKS,
};

const BREAKDOWN_STYLE = {
  ...LAYOUT,
  panelBg: "",
  showDividers: true,
  dividerColor: "400",
  showPromo: true,
  showDimensions: true,
  iconColor: "700",
  ...text("titleColor", "700", "medium"),
  ...text("cardTitleColor", "secondary-2", "normal"),
  ...text("valueColor", "foreground", "bold"),
  ...text("labelColor", "foreground", "semibold"),
  ...text("bodyColor", "foreground", "normal"),
  ...text("itemColor", "800", "normal"),
  bulletColor: "secondary",
  ...text("ctaColor", "primary-1", "semibold"),
  ctaColorHover: "primary-800",
  linkIconBg: "primary-1",
  linkIconColor: "50",
  badgeBg: "200",
  ...text("badgeText", "foreground", "semibold"),
  countBg: "secondary",
  ...text("numberColor", "primary-1", "bold"),
  arrowColor: "500",
  ...text("metaColor", "700", "normal"),
  ...text("headingColor", "secondary-2", "normal"),
  ...text("descriptionColor", "foreground", "normal"),
  promoBadgeBg: "secondary",
  promoBadgeIconColor: "primary-1",
  buttonBg: "secondary",
  buttonBgHover: "",
  ...text("buttonText", "700", "semibold"),
  ...BACKLINKS,
};

const ADDONS_STYLE = {
  ...LAYOUT,
  columns: "4",
  cardBg: "background",
  showCardShadow: false,
  iconColor: "primary-1",
  ...text("titleColor", "700", "semibold"),
  ...text("labelColor", "800", "semibold"),
  ...text("valueColor", "700", "medium"),
  ...BACKLINKS,
};

const AIRPORT_CODES = ["DAM", "ALP", "DXB", "SHJ", "AUH", "KWI", "MCT", "BGW", "EBL", "EVN", "SAW", "MJI"];
const CLASS_VALUES = ["economy", "business"];
const TIER_VALUES = ["none", "classic", "silver", "gold", "platinum"];

function loadDemoLocale(lang) {
  const path = resolve(process.cwd(), `../flychamadmin/src/cms2/i18n/locales/${lang}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

/** One column of the adult panel (checked or cabin) for a given checked weight. */
function bagColumn(copy, unit, cm, kind, weight) {
  const checked = kind === "checked";
  const c = copy[kind];
  return {
    id: kind,
    title: c.title,
    pieces: c.pieces,
    weightLabel: c.weightLabel,
    weightValue: checked ? `${weight}kg / ${Math.round(weight * 2.2)}lbs` : "7kg / 15lbs",
    sizeLabel: c.sizeLabel,
    sizeValue: c.sizeValue,
    listTitle: "",
    listItems: [],
    linkLabel: "",
    linkHref: "",
    linkIcon: "ArrowRight",
    imageUrl: `${MEDIA}/${checked ? "checked-bag.webp" : "cabin-bag.webp"}`,
    imageAlt: c.imageAlt,
    weightBadge: checked ? String(weight) : "7",
    weightUnit: unit,
    countBadge: "x1",
    dimHeight: `${checked ? 70 : 55} ${cm}`,
    dimWidth: `${checked ? 50 : 40} ${cm}`,
    dimDepth: `${checked ? 25 : 23} ${cm}`,
  };
}

function buildResultBlocks(lang) {
  const demo = loadDemoLocale(lang);
  const calc = demo.baggageCalculator;
  const b = demo.baggageBreakdown;
  const adult = b.adult;
  const promo = {
    promoTitle: b.promo.title,
    promoBody: b.promo.body,
    promoButtonLabel: b.promo.buttonLabel,
    promoButtonHref: "/travel-experience/before-you-fly/manage-booking",
    promoImageUrl: `${MEDIA}/checked-bag.webp`,
    promoImageAlt: "",
    promoBadgeIcon: "Plus",
  };
  const noPromo = Object.fromEntries(Object.keys(promo).map((k) => [k, ""]));
  const adultPanel = (cls, weight) => ({
    type: "baggage-allowance-breakdown",
    style: BREAKDOWN_STYLE,
    content: {
      icon: "Users",
      title: adult.title,
      classFilter: cls,
      columns: [
        bagColumn(adult, adult.unit, adult.cm, "checked", weight),
        bagColumn(adult, adult.unit, adult.cm, "cabin", weight),
      ],
      ...promo,
      links: [],
    },
  });
  const infantChecked = {
    ...bagColumn(adult, adult.unit, adult.cm, "checked", 10),
    weightValue: "10kg / 22lbs",
  };

  return [
    {
      type: "baggage-route-summary",
      style: SUMMARY_STYLE,
      content: {
        arrowIcon: "ArrowRight",
        tierPrefix: demo.baggageRouteSummary.tierPrefix,
        anchorId: "results",
        previewFrom: "DAM",
        previewTo: "DXB",
        previewClass: "economy",
        previewTier: "gold",
        airports: AIRPORT_CODES.map((code) => ({ id: code.toLowerCase(), value: code, label: calc.airports[code] })),
        classes: CLASS_VALUES.map((value) => ({ id: value, value, label: calc.classes[value] })),
        tiers: TIER_VALUES.map((value) => ({
          id: value,
          value,
          label: calc.tiers[value],
          imageUrl: value === "gold" ? `${MEDIA}/tier-gold.webp` : "",
        })),
        links: [],
      },
    },
    adultPanel("economy", 30),
    adultPanel("business", 40),
    {
      type: "baggage-allowance-breakdown",
      style: { ...BREAKDOWN_STYLE, showPromo: false },
      content: {
        icon: "BabyCarriage",
        title: b.infant.title,
        classFilter: "",
        columns: [
          infantChecked,
          {
            id: "other",
            title: b.infant.otherTitle,
            pieces: "",
            weightLabel: "",
            weightValue: "",
            sizeLabel: "",
            sizeValue: "",
            listTitle: b.infant.listTitle,
            listItems: b.infant.items.map((itemText, i) => ({ id: `item-${i + 1}`, text: itemText })),
            linkLabel: b.infant.linkLabel,
            linkHref: "/travel-experience/before-you-fly/unaccompanied-minors",
            linkIcon: "ArrowRight",
            imageUrl: "",
            imageAlt: "",
            weightBadge: "",
            weightUnit: "",
            countBadge: "",
            dimHeight: "",
            dimWidth: "",
            dimDepth: "",
          },
        ],
        ...noPromo,
        links: [],
      },
    },
    {
      type: "baggage-addons",
      style: ADDONS_STYLE,
      content: {
        title: demo.baggageAddons.title,
        items: [5, 10, 15, 20].map((kg, i) => ({
          id: `plus${kg}`,
          icon: "SuitcaseRolling",
          label: `+${kg}${demo.baggageAddons.unit}`,
          price: ["$10.00", "$18.00", "$25.00", "$32.00"][i],
          href: "/travel-experience/before-you-fly/manage-booking",
        })),
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
  const args = [
    "-sS",
    "-X",
    method,
    `${url}${path}${qs}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    `Content-Type: ${contentType || "application/json"}`,
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  for (const header of headers || []) args.push("-H", header);
  // Send bodies from a UTF-8 file: passing JSON as a CLI arg goes through the
  // Windows ANSI codepage and turns Arabic into "????".
  let dir;
  if (file) {
    args.push("--data-binary", `@${file}`);
  } else if (body !== undefined) {
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

function componentTypeOf(link) {
  const row = link?.components;
  const component = Array.isArray(row) ? row[0] : row;
  return component?.type || null;
}


console.log("Target project:", url);

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) {
  console.error("Sign-in failed:", restError(auth, "no access_token"));
  process.exit(1);
}
const token = auth.access_token;

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
    contentType: "image/webp",
    headers: ["x-upsert: true", "Cache-Control: max-age=3600"],
  });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) {
    console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res)));
    process.exit(1);
  }
  console.log("image uploaded:", `${FOLDER}/${name}`);
}

const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
const pageId = Array.isArray(pages) ? pages[0]?.id : null;
if (!pageId) {
  console.error(`page ${PAGE_SLUG} not found — run apply-baggage-calculator-page.mjs first`);
  process.exit(1);
}

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type,content)&order=position.asc`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }
  const rows = links.map((row) => ({ ...row, type: componentTypeOf(row) }));
  const blocks = buildResultBlocks(lang);

  // Point Calculate at the results on this page.
  const calc = rows.find((row) => row.type === "baggage-calculator");
  if (calc) {
    const comp = Array.isArray(calc.components) ? calc.components[0] : calc.components;
    const content = comp?.content?.[lang] || {};
    if (content.buttonHref !== CALCULATE_HREF) {
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${calc.component_id}`,
        prefer: "return=minimal",
        body: { content: { [lang]: { ...content, buttonHref: CALCULATE_HREF } } },
      });
      if (res?.message) {
        console.error(`calculator patch failed (${lang}):`, restError(res, "unknown error"));
        process.exit(1);
      }
      console.log(`calculator (${lang}) → ${CALCULATE_HREF}`);
    }
  }

  const existing = rows.filter((row) => RESULT_TYPES.includes(row.type));
  if (existing.length && process.argv.includes("--repair")) {
    for (const [i, row] of existing.entries()) {
      const block = blocks[i];
      if (!block) continue;
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${row.component_id}`,
        prefer: "return=minimal",
        body: { type: block.type, style: { [lang]: block.style }, content: { [lang]: block.content } },
      });
      if (res?.message) {
        console.error(`repair failed (${lang} ${block.type}):`, restError(res, "unknown error"));
        process.exit(1);
      }
      console.log(`repaired ${block.type} (${lang}) @${row.position}`);
    }
    continue;
  }
  if (existing.length) {
    console.log(`kept ${lang}: results already seeded (${existing.length} blocks)`);
    continue;
  }

  // Insert right after the calculator; shift everything below it down.
  const insertAt = (calc ? calc.position : 2) + 1;
  const toShift = rows.filter((row) => row.position >= insertAt).sort((a, b) => b.position - a.position);
  for (const row of toShift) {
    const next = row.position + blocks.length;
    const a = curl("PATCH", "/rest/v1/page_components", {
      token,
      query: `id=eq.${row.id}`,
      prefer: "return=minimal",
      body: { position: next },
    });
    const b = curl("PATCH", "/rest/v1/components", {
      token,
      query: `id=eq.${row.component_id}`,
      prefer: "return=minimal",
      body: { position: next },
    });
    if (a?.message || b?.message) {
      console.error(`shift failed (${lang} ${row.type}):`, restError(a?.message ? a : b, "unknown error"));
      process.exit(1);
    }
    console.log(`shifted ${row.type} (${lang}) ${row.position} → ${next}`);
  }

  for (const [i, block] of blocks.entries()) {
    const position = insertAt + i;
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

console.log("Done. Open /en/travel-experience/before-you-fly/baggage-calculator?from=DAM&to=DXB&class=economy&tier=gold");
