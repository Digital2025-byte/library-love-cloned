/**
 * Patch flights-to-damascus destination-narratives + destination-things-to-do
 * styles to match new_fly_cham (no section fill; narratives sit on page bg-100).
 *
 *   node scripts/apply-flights-to-damascus-sheet.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "flights-to-damascus";
const TARGET_TYPES = new Set([
  "destination-narratives",
  "destination-things-to-do",
]);

const NARRATIVES_STYLE = {
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "none",
};

const THINGS_STYLE = {
  showSectionBg: false,
  sectionBg: "100",
};

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
  const stdout = execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 10_000_000,
  });
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
  }
}

function mergeSheetStyle(style, type) {
  const patch =
    type === "destination-narratives" ? NARRATIVES_STYLE : THINGS_STYLE;
  const next = style && typeof style === "object" ? { ...style } : {};
  for (const lang of ["en", "ar"]) {
    if (next[lang] && typeof next[lang] === "object") {
      next[lang] = { ...next[lang], ...patch };
    }
  }
  // Legacy flat style (no en/ar keys).
  if (Object.keys(next).length && !next.en && !next.ar) {
    Object.assign(next, patch);
  }
  // Ensure both locales exist when style was empty / partial.
  for (const lang of ["en", "ar"]) {
    if (!next[lang] || typeof next[lang] !== "object") {
      next[lang] = { ...patch };
    }
  }
  return next;
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

const pages = curl("GET", "/rest/v1/pages", {
  token,
  query: `slug=eq.${PAGE_SLUG}&select=id`,
});
if (!Array.isArray(pages) || !pages[0]?.id) {
  console.error("page lookup failed:", restError(pages, "not found"));
  process.exit(1);
}
const pageId = pages[0].id;
console.log("page:", pageId);

const links = curl("GET", "/rest/v1/page_components", {
  token,
  query: `page_id=eq.${pageId}&select=component_id`,
});
if (!Array.isArray(links)) {
  console.error("page_components lookup failed:", restError(links, "unknown"));
  process.exit(1);
}

const componentIds = [...new Set(links.map((row) => row.component_id).filter(Boolean))];
if (!componentIds.length) {
  console.log("No components linked to this page.");
  process.exit(0);
}

const idFilter = componentIds.map((id) => `"${id}"`).join(",");
const components = curl("GET", "/rest/v1/components", {
  token,
  query: `id=in.(${idFilter})&select=id,type,style`,
});
if (!Array.isArray(components)) {
  console.error("components lookup failed:", restError(components, "unknown"));
  process.exit(1);
}

const targets = components.filter((row) => TARGET_TYPES.has(row.type));
console.log(`Found ${targets.length} sheet block(s) to patch.`);

for (const row of targets) {
  const style = mergeSheetStyle(row.style, row.type);
  const patched = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { style },
  });
  if (patched?.message) {
    console.error(`patch failed (${row.id}):`, restError(patched, "unknown"));
    process.exit(1);
  }
  console.log("patched:", row.type, row.id);
}

console.log("Done.");
