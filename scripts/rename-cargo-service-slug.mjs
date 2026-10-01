/**
 * Rename the CMS page slug cargo-service → cargo, and rewrite stored
 * hrefs that point at /cargo-service. Media folder names are left as-is.
 *
 *   node scripts/rename-cargo-service-slug.mjs
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

const workDir = mkdtempSync(join(tmpdir(), "rename-cargo-"));
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
    maxBuffer: 40_000_000,
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

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail(`Sign-in failed: ${restError(auth, "no access_token")}`);
const token = auth.access_token;

const existingCargo = curl("GET", "/rest/v1/pages", {
  token,
  query: "slug=eq.cargo&select=id,slug",
});
if (!Array.isArray(existingCargo)) fail(`pages lookup failed: ${restError(existingCargo, "?")}`);
if (existingCargo[0]?.id) {
  console.log("slug already cargo:", existingCargo[0].id);
} else {
  const patched = curl("PATCH", "/rest/v1/pages?slug=eq.cargo-service", {
    token,
    prefer: "return=representation",
    body: { slug: "cargo" },
  });
  const row = Array.isArray(patched) ? patched[0] : patched;
  if (!row?.id) fail(`slug update failed: ${restError(patched, "no row")}`);
  console.log("renamed page:", row.id, row.slug);
}

const components = curl("GET", "/rest/v1/components", {
  token,
  query: "select=id,content,style",
});
if (!Array.isArray(components)) fail(`components lookup failed: ${restError(components, "?")}`);

let rewritten = 0;
for (const row of components) {
  const raw = JSON.stringify({ content: row.content, style: row.style });
  if (!raw.includes('"/cargo-service"') && !raw.includes('"/cargo-service/')) continue;
  const next = raw
    .replaceAll('"/cargo-service"', '"/cargo"')
    .replaceAll('"/cargo-service/', '"/cargo/');
  if (next === raw) continue;
  const parsed = JSON.parse(next);
  const updated = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { content: parsed.content, style: parsed.style },
  });
  if (updated?.message) fail(`component update failed (${row.id}): ${restError(updated, "?")}`);
  rewritten += 1;
  console.log("rewrote links in component", row.id);
}

rmSync(workDir, { recursive: true, force: true });
console.log("Done. components updated:", rewritten);
