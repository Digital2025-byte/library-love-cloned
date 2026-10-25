/**
 * Rewrite stored CMS hrefs after nesting Our Responsibility under About Us:
 *   /our-responsibility  →  /about-us/our-responsibility
 *
 * Does not touch media asset paths under /our-responsibility/...
 * Also updates site_header / site_footer JSON when present.
 *
 *   node scripts/rewrite-our-responsibility-hrefs.mjs
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

const FROM = "/our-responsibility";
const TO = "/about-us/our-responsibility";

const workDir = mkdtempSync(join(tmpdir(), "rewrite-resp-"));
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
    maxBuffer: 80_000_000,
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

/** Exact path href only — leave /our-responsibility/asset.webp alone. */
function rewriteHrefString(s) {
  if (typeof s !== "string") return s;
  if (s === FROM) return TO;
  if (s.startsWith(`${FROM}?`)) return TO + s.slice(FROM.length);
  if (s.startsWith(`${FROM}#`)) return TO + s.slice(FROM.length);
  if (s === "/travel-experience/our-responsibility") return TO;
  if (s.startsWith("/travel-experience/our-responsibility?")) {
    return TO + s.slice("/travel-experience/our-responsibility".length);
  }
  if (s.startsWith("/travel-experience/our-responsibility#")) {
    return TO + s.slice("/travel-experience/our-responsibility".length);
  }
  return s;
}

function rewriteDeep(value) {
  if (Array.isArray(value)) return value.map(rewriteDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = rewriteDeep(v);
    return out;
  }
  return rewriteHrefString(value);
}

function needsRewrite(value) {
  const raw = JSON.stringify(value);
  return (
    raw.includes(`"${FROM}"`) ||
    raw.includes(`"${FROM}?`) ||
    raw.includes(`"${FROM}#`) ||
    raw.includes('"/travel-experience/our-responsibility"') ||
    raw.includes('"/travel-experience/our-responsibility?') ||
    raw.includes('"/travel-experience/our-responsibility#')
  );
}

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail(`Sign-in failed: ${restError(auth, "no access_token")}`);
const token = auth.access_token;

let componentsUpdated = 0;
const components = curl("GET", "/rest/v1/components", {
  token,
  query: "select=id,type,content,style",
});
if (!Array.isArray(components)) fail(`components lookup failed: ${restError(components, "?")}`);

for (const row of components) {
  const blob = { content: row.content, style: row.style };
  if (!needsRewrite(blob)) continue;
  const next = rewriteDeep(blob);
  const updated = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { content: next.content, style: next.style },
  });
  if (updated?.message) fail(`component update failed (${row.id}): ${restError(updated, "?")}`);
  componentsUpdated += 1;
  console.log("rewrote component", row.id, row.type || "");
}

function patchSiteTable(table) {
  let updated = 0;
  const rows = curl("GET", `/rest/v1/${table}`, {
    token,
    query: "select=lang,data,version",
  });
  if (!Array.isArray(rows)) {
    console.log(`${table}: skip (${restError(rows, "not available")})`);
    return 0;
  }
  for (const row of rows) {
    if (!needsRewrite(row.data)) continue;
    const data = rewriteDeep(row.data);
    const res = curl("PATCH", `/rest/v1/${table}`, {
      token,
      query: `lang=eq.${row.lang}`,
      prefer: "return=minimal",
      body: { data, version: Number(row.version || 1) + 1 },
    });
    if (res?.message) fail(`${table} update failed (${row.lang}): ${restError(res, "?")}`);
    updated += 1;
    console.log(`rewrote ${table}`, row.lang);
  }
  return updated;
}

const headerUpdated = patchSiteTable("site_header");
const footerUpdated = patchSiteTable("site_footer");

rmSync(workDir, { recursive: true, force: true });
console.log("Done.", { componentsUpdated, headerUpdated, footerUpdated, to: TO });
