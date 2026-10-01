/**
 * One-off admin task: every /travel-experience page gets a Breadcrumbs block
 * at position 0 (EN + AR), matching the existing ones on its sibling pages
 * (same style as /travel-experience/before-you-fly/allowed-baggage).
 *
 *   - Page without breadcrumbs in a language → insert one, shift blocks down.
 *   - Page whose breadcrumbs trail skips a parent level (e.g. at-the-airport
 *     missing "Travel experience") → rewrite only the trail items.
 *   - Everything else is left alone.
 *
 *   node scripts/apply-travel-experience-breadcrumbs.mjs [--dry-run]
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
const DRY_RUN = process.argv.includes("--dry-run");

const CRUMBS = "breadcrumbs";

// Same tokens as the existing allowed-baggage breadcrumbs block.
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
  focusFontWeight: "medium",
  focusColorHover: "primary-1",
  focusFontWeightHover: "medium",
  separatorColor: "600",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

// Labels used by the existing sibling breadcrumbs, plus the six new pages.
const LABELS = {
  en: {
    home: "Home",
    travelExperience: "Travel experience",
    beforeYouFly: "Before You Fly",
    atTheAirport: "At The Airport",
    onBoard: "Onboard",
    seatSelection: "Seat Selection",
    onboardServices: "Onboard Services",
    afterTravel: "After Your Flight",
    travelerMagazine: "Traveler Magazine",
    aria: "Breadcrumb",
  },
  ar: {
    home: "الرئيسية",
    travelExperience: "تجربة السفر",
    beforeYouFly: "قبل أن تسافر",
    atTheAirport: "في المطار",
    onBoard: "على متن الطائرة",
    seatSelection: "اختيار المقعد",
    onboardServices: "خدمات على متن الطائرة",
    afterTravel: "بعد رحلتك",
    travelerMagazine: "مجلة المسافر",
    aria: "مسار التنقل",
  },
};

const HOME = ["home", "/"];
const TE = ["travelExperience", "/travel-experience"];
const BYF = ["beforeYouFly", "/travel-experience/before-you-fly"];
const ATA = ["atTheAirport", "/travel-experience/at-the-airport"];
const OB = ["onBoard", "/travel-experience/on-board"];

// slug → parent trail (current page is appended as the last, unlinked crumb).
// `label` = labels key for pages that are NEW here; existing blocks keep
// their current-page label.
const PAGES = {
  "travel-experience": { parents: [HOME], label: "travelExperience" },
  "seat-selection": { parents: [HOME, TE], label: "seatSelection" },
  "before-you-fly": { parents: [HOME, TE], label: "beforeYouFly" },
  "allowed-baggage": { parents: [HOME, TE, BYF] },
  "prohibited-items": { parents: [HOME, TE, BYF] },
  "unaccompanied-minors": { parents: [HOME, TE, BYF] },
  "oxygen-service": { parents: [HOME, TE, BYF] },
  "limousine-service": { parents: [HOME, TE, BYF] },
  "transportation-service": { parents: [HOME, TE, BYF] },
  "manage-booking": { parents: [HOME, TE, BYF] },
  "at-the-airport": { parents: [HOME, TE] },
  "business-lounge": { parents: [HOME, TE, ATA] },
  "wheelchair-service": { parents: [HOME, TE, ATA] },
  "vip-boarding": { parents: [HOME, TE, ATA] },
  onboard: { parents: [HOME, TE], label: "onboardServices" },
  "on-board": { parents: [HOME, TE] },
  "birthday-onboard": { parents: [HOME, TE, OB] },
  "kids-toys": { parents: [HOME, TE, OB] },
  "entertainment-system": { parents: [HOME, TE, OB] },
  "meals-onboard": { parents: [HOME, TE, OB] },
  "travel-classes": { parents: [HOME, TE, OB] },
  "onboard-wi-fi": { parents: [HOME, TE, OB] },
  "after-travel": { parents: [HOME, TE], label: "afterTravel" },
  "traveler-magazine": { parents: [HOME, TE], label: "travelerMagazine" },
};

const auth = await (
  await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
  })
).json();
if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
const headers = (extra = {}) => ({
  apikey: key,
  Authorization: `Bearer ${auth.access_token}`,
  "Content-Type": "application/json",
  ...extra,
});

async function rest(method, path, body, prefer = "return=representation") {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: headers({ Prefer: prefer }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  const json = text ? JSON.parse(text) : null;
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return json;
}

const parentItems = (parents, lang) =>
  parents.map(([k, href]) => ({ href, label: LABELS[lang][k] }));

for (const [slug, cfg] of Object.entries(PAGES)) {
  const [page] = await rest("GET", `pages?select=id&slug=eq.${slug}`);
  if (!page) {
    console.log(`skip ${slug}: page not found`);
    continue;
  }
  const links = await rest(
    "GET",
    `page_components?page_id=eq.${page.id}&select=id,lang,position,component_id,components(id,type,content)`
  );

  for (const lang of ["en", "ar"]) {
    const rows = links.filter((l) => l.lang === lang);
    if (!rows.length) {
      console.log(`skip ${slug} (${lang}): no blocks`);
      continue;
    }
    const existing = rows.find((l) => l.components?.type === CRUMBS);

    if (existing) {
      const content = existing.components.content || {};
      const cur = content[lang] || {};
      const items = cur.items || [];
      const want = parentItems(cfg.parents, lang);
      const haveHrefs = items.slice(0, -1).map((i) => i.href);
      if (JSON.stringify(haveHrefs) === JSON.stringify(want.map((i) => i.href))) continue;
      const last = items[items.length - 1] || { href: "", label: "" };
      const next = [...want, last];
      console.log(
        `fix ${slug} (${lang}): ${items.map((i) => i.label).join(" / ")}  →  ${next.map((i) => i.label).join(" / ")}`
      );
      if (!DRY_RUN)
        await rest("PATCH", `components?id=eq.${existing.component_id}`, {
          content: { ...content, [lang]: { ...cur, items: next } },
        });
      continue;
    }

    if (!cfg.label) {
      console.log(`?? ${slug} (${lang}): no breadcrumbs and no label configured — skipped`);
      continue;
    }
    const items = [...parentItems(cfg.parents, lang), { href: "", label: LABELS[lang][cfg.label] }];
    console.log(`add ${slug} (${lang}): ${items.map((i) => i.label).join(" / ")}`);
    if (DRY_RUN) continue;

    // Shift existing blocks down one (highest first).
    for (const row of rows.slice().sort((a, b) => (b.position ?? 0) - (a.position ?? 0)))
      await rest("PATCH", `page_components?id=eq.${row.id}`, { position: (row.position ?? 0) + 1 }, "return=minimal");

    const [comp] = await rest("POST", "components", {
      type: CRUMBS,
      position: 0,
      style: { [lang]: CRUMBS_STYLE },
      content: {
        [lang]: { items, separator: "/", ariaLabel: LABELS[lang].aria, links: [] },
      },
    });
    await rest(
      "POST",
      "page_components",
      { page_id: page.id, component_id: comp.id, position: 0, lang },
      "return=minimal"
    );
  }
}
console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
