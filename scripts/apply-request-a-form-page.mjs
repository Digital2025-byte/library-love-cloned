/**
 * One-off admin task for the Request-a-form dynamic page — one CMS page shared
 * at /help/contact-us/forms/request-a-form (?form=<formId> selects the form):
 *   1. Register the `form-access` component type (+ ensure cta-banner exists).
 *   2. Ensure the "request-a-form" page row exists.
 *   3. Seed EN + AR blocks when a language has none:
 *        0 cta-banner   ("Need Urgent Help?" — same look as the /forms page)
 *        1 form-access  ("Find your booking" PNR + last name card)
 *
 * Copy comes from new_fly_cham's `help.urgent.*` / `forms.access.*` strings.
 *
 * Frontend URL: /help/contact-us/forms/request-a-form   CMS slug: request-a-form
 *
 *   node scripts/apply-request-a-form-page.mjs
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

const PAGE_SLUG = "request-a-form";
const MEDIA = `${String(url).replace(/\/$/, "")}/storage/v1/object/public/cms-media`;

const CTA = "cta-banner";
const FORM = "form-access";

const COMPONENT_TYPES = [
  { id: CTA, label: "CTA Banner" },
  { id: FORM, label: "Form Access" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

// Same tokens as the cta-banner block on the /help/contact-us/forms page.
const CTA_STYLE = {
  sectionPadding: "none",
  showSectionBg: false,
  sectionBg: "100",
  bannerHeight: "default",
  bannerRadius: "lg",
  verticalAlign: "center",
  titleAlign: "left",
  showHeroImage: true,
  showOverlay: true,
  overlayColor: "main",
  showTitle: true,
  showDescription: true,
  showButton: true,
  titleColor: "50",
  titleFontWeight: "semibold",
  titleColorHover: "50",
  titleFontWeightHover: "semibold",
  descriptionColor: "50",
  descriptionFontWeight: "medium",
  descriptionColorHover: "50",
  descriptionFontWeightHover: "medium",
  buttonBg: "secondary",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

// cms2 DEFAULT_FORM_ACCESS_STYLE — the old static page's look.
const FORM_STYLE = {
  showEyebrow: true,
  showTitle: true,
  showSubtitle: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "none",
  cardBg: "background",
  inputBg: "100",
  iconColor: "800",
  eyebrowColor: "primary-1",
  eyebrowFontWeight: "medium",
  eyebrowColorHover: "primary-1",
  eyebrowFontWeightHover: "medium",
  titleColor: "800",
  titleFontWeight: "bold",
  titleColorHover: "800",
  titleFontWeightHover: "bold",
  subtitleColor: "600",
  subtitleFontWeight: "normal",
  subtitleColorHover: "600",
  subtitleFontWeightHover: "normal",
  labelColor: "800",
  labelFontWeight: "medium",
  labelColorHover: "800",
  labelFontWeightHover: "medium",
  submitBg: "secondary",
  submitBgHover: "",
  submitTextColor: "btn",
  submitTextFontWeight: "semibold",
  submitTextColorHover: "btn",
  submitTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

function loadLocale(lang) {
  const path = resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function buildBlocks(lang) {
  const locale = loadLocale(lang);
  const urgent = locale.help.urgent;
  const access = locale.forms.access;

  return [
    {
      type: CTA,
      style: CTA_STYLE,
      content: {
        title: urgent.title,
        description: urgent.description,
        buttonLabel: urgent.cta,
        buttonHref: "",
        buttonLinkType: "internal",
        imageUrl: `${MEDIA}/help/ph1.webp`,
        imageAlt: urgent.title,
        links: [],
      },
    },
    {
      type: FORM,
      style: FORM_STYLE,
      content: {
        subtitle: access.subtitle,
        pnrLabel: access.pnr.label,
        pnrHint: access.pnr.hint,
        lastNameLabel: access.lastName.label,
        submitLabel: access.submit,
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

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${PAGE_SLUG}&select=id`,
  });
  if (!Array.isArray(existing)) fail("pages lookup failed", existing);
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Request a Form",
        description: "Find your booking and continue with the selected support request",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) fail("pages insert failed", inserted);
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
  });
  if (!Array.isArray(links)) fail(`page_components lookup failed (${lang})`, links);

  if (links.length > 0) {
    const order = links
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((row) => `${row.position}:${componentTypeOf(row)}`)
      .join(" → ");
    console.log(`kept ${lang} (${links.length} blocks):`, order);
    continue;
  }

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
    if (!comp?.id) fail(`components insert failed (${lang} ${block.type})`, inserted);

    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) fail(`page_components insert failed (${lang} ${block.type})`, link);
    console.log(`seeded ${block.type} block (${lang}) @${position}:`, comp.id);
  }
}

console.log("Done. Open /en/help/contact-us/forms/request-a-form?form=bookingChange");
