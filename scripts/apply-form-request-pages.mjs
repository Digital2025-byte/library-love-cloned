/**
 * Seed one published CMS page per support form request:
 *   /help/contact-us/forms/request-<kebab-id>   (CMS slug: request-<kebab-id>)
 *
 * Each page gets breadcrumbs + the same cta-banner + form-access blocks as the
 * legacy hub (`request-a-form`). Also rewrites stored `?form=` hrefs in
 * forms-directory / contact-forms content to the new paths.
 *
 * Idempotent: existing pages keep their blocks; missing pages are created.
 *
 *   node scripts/apply-form-request-pages.mjs
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

const MEDIA = `${url}/storage/v1/object/public/cms-media`;

const FORM_IDS = [
  "bookingChange",
  "transportation",
  "nameCorrection",
  "paymentIssue",
  "unaccompaniedMinor",
  "groupTravel",
  "corporateTravel",
  "wheelchair",
  "oxygenService",
  "refund",
  "ancillaryRefund",
  "lostBaggage",
  "delayedBaggage",
  "claimMiles",
  "feedback",
  "apiIntegration",
  "partnerGsa",
  "cargo",
];

function formIdToRequestSlug(formId) {
  const kebab = String(formId)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return `request-${kebab}`;
}

function formRequestHref(formId) {
  return `/help/contact-us/forms/${formIdToRequestSlug(formId)}`;
}

function rewriteFormHref(value) {
  if (typeof value !== "string") return value;
  const query = value.match(
    /^(.*\/help\/contact-us\/forms\/request-a-form)\?form=([^&#]+)(.*)$/,
  );
  if (query) {
    const id = decodeURIComponent(query[2]);
    if (FORM_IDS.includes(id)) return `${formRequestHref(id)}${query[3] || ""}`;
  }
  return value;
}

function rewriteDeep(node) {
  if (Array.isArray(node)) return node.map(rewriteDeep);
  if (!node || typeof node !== "object") return rewriteFormHref(node);
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = key === "href" || key === "buttonHref" ? rewriteFormHref(value) : rewriteDeep(value);
  }
  return out;
}

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
  return JSON.parse(
    readFileSync(resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`), "utf8"),
  );
}

function buildBlocks(lang, formId, formTitle) {
  const locale = loadLocale(lang);
  const urgent = locale.help.urgent;
  const access = locale.forms.access;
  const home = lang === "ar" ? "الرئيسية" : "Home";
  const help = lang === "ar" ? "المساعدة" : "Help";
  const contact = lang === "ar" ? "اتصل بنا" : "Contact Us";
  const forms = lang === "ar" ? "طلبات النماذج" : "Forms Requests";

  return [
    {
      type: "breadcrumbs",
      style: BREADCRUMB_STYLE,
      content: {
        items: [
          { label: home, href: "/" },
          { label: help, href: "/help" },
          { label: contact, href: "/help/contact-us" },
          { label: forms, href: "/help/contact-us/forms" },
          { label: formTitle, href: "" },
        ],
        separator: "/",
        ariaLabel: "Breadcrumb",
        links: [],
      },
    },
    {
      type: "cta-banner",
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
      type: "form-access",
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

const workDir = mkdtempSync(join(tmpdir(), "form-request-"));
let seq = 0;

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query } = {}) {
  const args = [
    "-sS",
    "-X",
    method,
    `${url}${path}${query ? `?${query}` : ""}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    "Content-Type: application/json; charset=utf-8",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  if (body !== undefined) {
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

for (const type of [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "cta-banner", label: "CTA Banner" },
  { id: "form-access", label: "Form Access" },
]) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: type,
  });
  if (res?.message) fail(`component_types upsert failed: ${restError(res, "?")}`);
}

const enLocale = loadLocale("en");
const arLocale = loadLocale("ar");

for (const formId of FORM_IDS) {
  const slug = formIdToRequestSlug(formId);
  const enTitle = enLocale.forms?.items?.[formId]?.title || formId;
  const arTitle = arLocale.forms?.items?.[formId]?.title || enTitle;
  const label = enTitle;

  let pageId;
  {
    const existing = curl("GET", "/rest/v1/pages", {
      token,
      query: `slug=eq.${slug}&select=id`,
    });
    if (!Array.isArray(existing)) fail(`pages lookup failed (${slug})`);
    if (existing[0]?.id) {
      pageId = existing[0].id;
      const patched = curl("PATCH", `/rest/v1/pages?id=eq.${pageId}`, {
        token,
        prefer: "return=minimal",
        body: {
          label,
          description: `Form request — ${formId}`,
          status: "published",
        },
      });
      if (patched?.message) fail(`pages update failed (${slug}): ${restError(patched, "?")}`);
      console.log("page exists:", slug, pageId);
    } else {
      const inserted = curl("POST", "/rest/v1/pages", {
        token,
        prefer: "return=representation",
        body: {
          slug,
          label,
          description: `Form request — ${formId}`,
          status: "published",
        },
      });
      const row = Array.isArray(inserted) ? inserted[0] : inserted;
      if (!row?.id) fail(`pages insert failed (${slug}): ${restError(inserted, "?")}`);
      pageId = row.id;
      console.log("page created:", slug, pageId);
    }
  }

  for (const lang of ["en", "ar"]) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id`,
    });
    if (!Array.isArray(links)) fail(`page_components lookup failed (${slug} ${lang})`);
    if (links.length > 0) {
      console.log(`kept ${slug} (${lang}): ${links.length} block(s)`);
      continue;
    }

    const formTitle = lang === "ar" ? arTitle : enTitle;
    const blocks = buildBlocks(lang, formId, formTitle);
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
        fail(`components insert failed (${slug} ${lang} ${block.type})`);
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
      if (link?.message) fail(`page_components insert failed (${slug} ${lang})`);
      console.log(`seeded ${slug} ${block.type} (${lang})`);
    }
  }
}

// Rewrite legacy ?form= hrefs inside forms-directory / contact-forms / cta blocks.
{
  const comps = curl("GET", "/rest/v1/components", {
    token,
    query: `type=in.(forms-directory,contact-forms,cta-banner)&select=id,type,content`,
  });
  if (!Array.isArray(comps)) fail(`components scan failed: ${restError(comps, "?")}`);
  let rewritten = 0;
  for (const comp of comps) {
    const before = JSON.stringify(comp.content || {});
    const next = rewriteDeep(comp.content || {});
    const after = JSON.stringify(next);
    if (before === after) continue;
    const patched = curl("PATCH", `/rest/v1/components?id=eq.${comp.id}`, {
      token,
      prefer: "return=minimal",
      body: { content: next },
    });
    if (patched?.message) fail(`href rewrite failed (${comp.id}): ${restError(patched, "?")}`);
    rewritten += 1;
    console.log("rewrote hrefs in", comp.type, comp.id);
  }
  console.log(`href rewrite done (${rewritten} component(s))`);
}

rmSync(workDir, { recursive: true, force: true });
console.log("Done. Example: /en/help/contact-us/forms/request-name-correction");
