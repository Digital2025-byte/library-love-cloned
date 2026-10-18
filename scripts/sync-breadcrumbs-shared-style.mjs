/**
 * One-off: ensure every breadcrumbs component shares one style, and (when the
 * column exists) write it to component_types.shared_style.
 *
 * Prefer an existing breadcrumbs style from the DB; fall back to CMS defaults.
 *
 *   node scripts/sync-breadcrumbs-shared-style.mjs [--dry-run]
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
    let v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

const DEFAULT_STYLE = {
  sectionPadding: "none",
  showSectionBg: false,
  sectionBg: "100",
  crumbColor: "600",
  crumbFontWeight: "medium",
  crumbColorHover: "primary-1",
  crumbFontWeightHover: "medium",
  focusColor: "primary-1",
  focusFontWeight: "semibold",
  focusColorHover: "primary-1",
  focusFontWeightHover: "semibold",
  currentColor: "primary-1",
  currentFontWeight: "semibold",
  currentColorHover: "primary-1",
  currentFontWeightHover: "semibold",
  separatorColor: "600",
  crumbUnderline: false,
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

const work = mkdtempSync(join(tmpdir(), "sync-crumbs-"));
let seq = 0;

function curl(method, path, { body, token, prefer, query } = {}) {
  const args = [
    "-sS", "-X", method,
    `${url}${path}${query ? `?${query}` : ""}`,
    "-H", `apikey: ${key}`,
    "-H", "Content-Type: application/json; charset=utf-8",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  if (body !== undefined) {
    const f = join(work, `b-${++seq}.json`);
    writeFileSync(f, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${f}`);
  }
  const out = execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 40_000_000,
  }).trim();
  if (!out) return null;
  try {
    return JSON.parse(out);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${out.slice(0, 400)}`);
  }
}

function isLangMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => k === "en" || k === "ar");
}

function normalizeShared(style) {
  if (!style || typeof style !== "object") {
    return { en: { ...DEFAULT_STYLE }, ar: { ...DEFAULT_STYLE } };
  }
  if (isLangMap(style)) {
    return {
      en: { ...DEFAULT_STYLE, ...(style.en || {}) },
      ar: { ...DEFAULT_STYLE, ...(style.ar || style.en || {}) },
    };
  }
  const flat = { ...DEFAULT_STYLE, ...style };
  return { en: flat, ar: { ...flat } };
}

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email: "admin@flycham.local", password: "FlyChamAdmin!2026" },
});
if (!auth?.access_token) {
  console.error("Sign-in failed", auth);
  process.exit(1);
}
const token = auth.access_token;

const rows = curl("GET", "/rest/v1/components", {
  token,
  query: "type=eq.breadcrumbs&select=id,style&limit=50",
});
if (!Array.isArray(rows)) {
  console.error("list failed", rows);
  process.exit(1);
}
console.log(`Found ${rows.length} breadcrumbs component(s)`);

const source = rows.find((r) => r.style && Object.keys(r.style).length)?.style;
const shared = normalizeShared(source || null);
console.log("Canonical style source:", source ? "existing component" : "defaults");

if (DRY_RUN) {
  console.log("would write shared_style + fan-out to", rows.length, "rows");
  rmSync(work, { recursive: true, force: true });
  process.exit(0);
}

const typePatch = curl("PATCH", "/rest/v1/component_types?id=eq.breadcrumbs", {
  token,
  prefer: "return=representation",
  body: { shared_style: shared },
});
if (typePatch?.message || typePatch?.code) {
  console.error(
    "component_types.shared_style update failed (apply migration 20261018160000 first):",
    typePatch,
  );
} else {
  console.log("component_types.shared_style updated");
}

let updated = 0;
for (const row of rows) {
  const res = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { style: shared },
  });
  if (res?.message) {
    console.error("fan-out failed", row.id, res);
    process.exit(1);
  }
  updated += 1;
}
console.log(`Fan-out done: ${updated} component(s)`);
rmSync(work, { recursive: true, force: true });
