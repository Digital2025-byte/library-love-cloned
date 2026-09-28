/**
 * One-off admin task: make the 404 page a dynamic CMS page.
 *   1. Register the "not-found-hero" component type.
 *   2. Upload the cloud photo to cms-media/not-found/clouds.webp (from
 *      new_fly_cham's images-webp mirror; skipped if already there).
 *   3. Ensure the "not-found" page row exists (published).
 *   4. Seed ONE not-found-hero block per language (EN + AR) when that language
 *      has no blocks yet — text from new_fly_cham's `notFound.*` locale strings,
 *      style = the original static page's look.
 *
 * Idempotent. Request bodies go through `curl --data-binary @file` (plain `-d`
 * mangles Arabic on Windows).
 *
 *   node scripts/apply-not-found-page.mjs
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

const PAGE_SLUG = "not-found";
const TYPE = "not-found-hero";
const LANGS = ["en", "ar"];
const IMAGE_PATH = "not-found/clouds.webp";
const IMAGE_FILE = resolve(process.cwd(), "../new_fly_cham/src/assets/images-webp/not-found/clouds.webp");
const IMAGE_URL = `${url}/storage/v1/object/public/cms-media/${IMAGE_PATH}`;

// The original static 404 look (matches DEFAULT_NOT_FOUND_HERO_STYLE in cms2).
const STYLE = {
  height: "screen",
  overlayColor: "secondary-2",
  overlayOpacity: "40",
  showEyebrow: true,
  showDescription: true,
  showButton: true,
  eyebrowColor: "50",
  eyebrowFontWeight: "medium",
  eyebrowColorHover: "50",
  eyebrowFontWeightHover: "medium",
  titleColor: "50",
  titleFontWeight: "bold",
  titleColorHover: "50",
  titleFontWeightHover: "bold",
  descriptionColor: "50",
  descriptionFontWeight: "normal",
  descriptionColorHover: "50",
  descriptionFontWeightHover: "normal",
  buttonBg: "secondary",
  buttonBgHover: "secondary-800",
  buttonText: "btn",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "btn",
  buttonTextFontWeightHover: "semibold",
};

function buildContent(lang) {
  const locale = JSON.parse(
    readFileSync(resolve(process.cwd(), `../new_fly_cham/src/i18n/locales/${lang}.json`), "utf8"),
  );
  const t = locale.notFound;
  if (!t) throw new Error(`Missing notFound strings in ${lang}.json`);
  return {
    eyebrow: t.eyebrow,
    title: t.title,
    description: t.description,
    ctaLabel: t.cta,
    ctaHref: "/",
    imageUrl: IMAGE_URL,
    imageAlt: t.imageAlt,
  };
}

// ---------------------------------------------------------------- HTTP

const workDir = mkdtempSync(join(tmpdir(), "not-found-page-"));
let seq = 0;

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query, file, contentType } = {}) {
  const args = ["-sS", "-X", method, `${url}${path}${query ? `?${query}` : ""}`,
    "-H", `apikey: ${key}`,
    "-H", `Content-Type: ${contentType || "application/json; charset=utf-8"}`];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  if (file) args.push("--data-binary", `@${file}`);
  else if (body !== undefined) {
    const tmp = join(workDir, `body-${(seq += 1)}.json`);
    writeFileSync(tmp, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${tmp}`);
  }
  const trimmed = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 }).trim();
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
    body: { id: TYPE, label: "Not Found Hero" },
  });
  if (res?.message) fail(`component_types upsert failed: ${restError(res, "?")}`);
  console.log("component_types ok:", TYPE);
}

{
  const head = execFileSync("curl.exe", ["-s", "-o", "NUL", "-w", "%{http_code}", IMAGE_URL], {
    encoding: "utf8",
  }).trim();
  if (head === "200") {
    console.log("image exists:", IMAGE_PATH);
  } else {
    const res = curl("POST", `/storage/v1/object/cms-media/${IMAGE_PATH}`, {
      token,
      file: IMAGE_FILE,
      contentType: "image/webp",
    });
    if (!res?.Key && !res?.key && !res?.Id) fail(`image upload failed: ${restError(res, JSON.stringify(res))}`);
    console.log("image uploaded:", IMAGE_PATH);
  }
}

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
  if (!Array.isArray(existing)) fail(`pages lookup failed: ${restError(existing, "?")}`);
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Not Found (404)",
        description: "Shown for every page that does not exist",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) fail(`pages insert failed: ${restError(inserted, "?")}`);
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

for (const lang of LANGS) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id`,
  });
  if (!Array.isArray(links)) fail(`page_components lookup failed: ${restError(links, "?")}`);
  if (links.length) {
    console.log(`${lang}: already has ${links.length} block(s) — skipped`);
    continue;
  }
  const inserted = curl("POST", "/rest/v1/components", {
    token,
    prefer: "return=representation",
    body: { type: TYPE, position: 0, style: { [lang]: STYLE }, content: { [lang]: buildContent(lang) } },
  });
  const comp = Array.isArray(inserted) ? inserted[0] : inserted;
  if (!comp?.id) fail(`components insert failed (${lang}): ${restError(inserted, "?")}`);
  const link = curl("POST", "/rest/v1/page_components", {
    token,
    prefer: "return=minimal",
    body: { page_id: pageId, component_id: comp.id, position: 0, lang },
  });
  if (link?.message) fail(`page_components insert failed (${lang}): ${restError(link, "?")}`);
  console.log(`${lang}: seeded ${TYPE}`);
}

rmSync(workDir, { recursive: true, force: true });
console.log("Done.");
