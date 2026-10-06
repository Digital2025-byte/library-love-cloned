/**
 * Seed the Site Map page (slug site-map) in EN + AR.
 * Idempotent: skips a language that already has blocks.
 *
 *   node scripts/apply-site-map-page.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSiteMapContent } from "../../flychamadmin/src/cms2/cmsComponents/SiteMap/utils/content.js";
import { DEFAULT_SITE_MAP_STYLE } from "../../flychamadmin/src/cms2/cmsComponents/SiteMap/utils/style.js";

function loadEnv() {
  const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";
const PAGE_SLUG = "site-map";
const TYPE = "site-map";

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

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
  if (body !== undefined) args.push("-d", JSON.stringify(body));
  const stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
  }
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
console.log("Signed in as", email);

const typeRes = curl("POST", "/rest/v1/component_types", {
  token,
  query: "on_conflict=id",
  prefer: "resolution=merge-duplicates,return=minimal",
  body: { id: TYPE, label: "Site Map" },
});
if (typeRes?.message) {
  console.error("component_types upsert failed:", restError(typeRes, "unknown error"));
  process.exit(1);
}
console.log("component_types ok:", TYPE);

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${PAGE_SLUG}&select=id`,
  });
  if (!Array.isArray(existing)) {
    console.error("pages lookup failed:", restError(existing, "unknown error"));
    process.exit(1);
  }
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Site Map",
        description: "Directory of Fly Cham pages",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) {
      console.error("pages insert failed:", restError(inserted, "unknown error"));
      process.exit(1);
    }
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }
  if (links.length) {
    console.log(`page already has ${links.length} ${lang} block(s) — skipping.`);
    continue;
  }

  const inserted = curl("POST", "/rest/v1/components", {
    token,
    prefer: "return=representation",
    body: {
      type: TYPE,
      position: 0,
      style: { [lang]: DEFAULT_SITE_MAP_STYLE },
      content: { [lang]: buildSiteMapContent(lang) },
    },
  });
  const comp = Array.isArray(inserted) ? inserted[0] : inserted;
  if (!comp?.id) {
    console.error(`components insert failed (${lang}):`, restError(inserted, "unknown error"));
    process.exit(1);
  }
  const link = curl("POST", "/rest/v1/page_components", {
    token,
    prefer: "return=minimal",
    body: { page_id: pageId, component_id: comp.id, position: 0, lang },
  });
  if (link?.message) {
    console.error(`page_components insert failed (${lang}):`, restError(link, "unknown error"));
    process.exit(1);
  }
  console.log(`seeded site-map block (${lang}):`, comp.id);
}

console.log("Done.");
