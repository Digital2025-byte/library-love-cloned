/**
 * Register the "about-values" component type so create-component succeeds
 * (components.type FK → component_types.id).
 *
 * Usage (from the cms/ directory):
 *   node scripts/apply-about-values-type.mjs
 *
 * Uses curl.exe + a tempfile body so it works behind a TLS-inspecting proxy.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";
const TYPE_ID = "about-values";

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

  let bodyFile;
  if (body !== undefined) {
    bodyFile = join(
      tmpdir(),
      `flycham-curl-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    writeFileSync(bodyFile, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${bodyFile}`);
  }

  try {
    const stdout = execFileSync("curl.exe", args, {
      encoding: "utf8",
      maxBuffer: 20_000_000,
    });
    const trimmed = stdout.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
    }
  } finally {
    if (bodyFile) {
      try {
        unlinkSync(bodyFile);
      } catch {
        // ignore temp cleanup
      }
    }
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

const role = curl("POST", "/rest/v1/rpc/ensure_first_admin", { token, body: {} });
if (role?.message) console.warn("ensure_first_admin warning:", role.message);

{
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id: TYPE_ID, label: "About Values" },
  });
  if (res?.message) {
    console.error("component_types upsert failed:", restError(res, "unknown error"));
    process.exit(1);
  }
  console.log("component_types ok:", TYPE_ID);
}

const rows = curl("GET", "/rest/v1/component_types", {
  token,
  query: `id=eq.${TYPE_ID}&select=id,label`,
});
console.log("Done. component_types row:", Array.isArray(rows) ? rows[0] : rows);
