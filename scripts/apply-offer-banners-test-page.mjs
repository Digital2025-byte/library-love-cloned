/**
 * One-off admin task for the seven offer banner blocks:
 *   1. Register the component types (same as migration
 *      20261004160000_add_offer_banner_component_types.sql).
 *   2. Append one block of each type to the "test-page" page (EN), after the
 *      blocks already there. Types already on the page are skipped, so the
 *      script is safe to re-run.
 *
 * Copy + photos come from cms2's OfferBanner/utils/variants.js; the default
 * style from new_fly_cham's offerBannerStyle.js (same values as cms2).
 *
 *   node scripts/apply-offer-banners-test-page.mjs
 *   node scripts/apply-offer-banners-test-page.mjs --lang=ar   # seed AR too
 *   node scripts/apply-offer-banners-test-page.mjs --repair    # re-write seeded
 *     style/content onto the offer blocks already on the page
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

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

const PAGE_SLUG = "test-page";
const langArg = process.argv.find((arg) => arg.startsWith("--lang="));
const LANGS = langArg ? langArg.slice(7).split(",") : ["en"];

const { OFFER_BANNER_VARIANTS, OFFER_BANNER_IDS } = await import(
  pathToFileURL(
    resolve(process.cwd(), "../flychamadmin/src/cms2/cmsComponents/OfferBanner/utils/variants.js")
  ).href
);
const { resolveOfferStyle } = await import(
  pathToFileURL(
    resolve(process.cwd(), "../new_fly_cham/src/shared/components/offerBanner/offerBannerStyle.js")
  ).href
);

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

function buildBlock(id, lang) {
  const variant = OFFER_BANNER_VARIANTS[id];
  return {
    type: id,
    style: { ...resolveOfferStyle(id, {}), ...BACKLINKS },
    content: {
      ...(variant.content[lang] || variant.content.en),
      imageUrl: variant.image,
      ctaIcon: "ArrowRight",
      links: [],
    },
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
  // Send bodies from a UTF-8 file: a CLI arg goes through the Windows ANSI
  // codepage and turns Arabic into "????".
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

for (const id of OFFER_BANNER_IDS) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id, label: OFFER_BANNER_VARIANTS[id].label },
  });
  if (res?.message) {
    console.error("component_types upsert failed:", restError(res, "unknown error"));
    process.exit(1);
  }
  console.log("component_types ok:", id);
}

const pages = curl("GET", "/rest/v1/pages", {
  token,
  query: `slug=eq.${PAGE_SLUG}&select=id`,
});
const pageId = Array.isArray(pages) ? pages[0]?.id : null;
if (!pageId) {
  console.error(`page "${PAGE_SLUG}" not found:`, restError(pages, "no rows"));
  process.exit(1);
}
console.log("page:", PAGE_SLUG, pageId);

for (const lang of LANGS) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=position,component_id,components(type)`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }
  const present = new Set(
    links.map((row) => (Array.isArray(row.components) ? row.components[0] : row.components)?.type)
  );
  let position = links.reduce((max, row) => Math.max(max, (row.position ?? -1) + 1), 0);

  if (process.argv.includes("--repair")) {
    for (const row of links) {
      const type = (Array.isArray(row.components) ? row.components[0] : row.components)?.type;
      if (!OFFER_BANNER_IDS.includes(type)) continue;
      const block = buildBlock(type, lang);
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${row.component_id}`,
        prefer: "return=minimal",
        body: { style: { [lang]: block.style }, content: { [lang]: block.content } },
      });
      if (res?.message) {
        console.error(`repair failed (${lang} ${type}):`, restError(res, "unknown error"));
        process.exit(1);
      }
      console.log(`repaired ${type} (${lang}) @${row.position}`);
    }
    continue;
  }

  for (const id of OFFER_BANNER_IDS) {
    if (present.has(id)) {
      console.log(`kept ${id} (${lang}) — already on the page`);
      continue;
    }
    const block = buildBlock(id, lang);
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
      console.error(`components insert failed (${lang} ${id}):`, restError(inserted, "unknown error"));
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang} ${id}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${id} (${lang}) @${position}:`, comp.id);
    position += 1;
  }
}

console.log(`Done. Open /en/${PAGE_SLUG}`);
