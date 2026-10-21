/**
 * Create empty published CMS pages (no blocks) in English and Arabic.
 * Blocks are stored per language, so a page with none is empty in both.
 * Existing pages are left untouched (never edited, blocks never cleared).
 *
 *   node scripts/apply-empty-pages.mjs [--dry-run]
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
const dryRun = process.argv.includes("--dry-run");

const PAGES = [
  {
    slug: "flight-status",
    label: "Flight status",
    description: "Empty page",
  },
  {
    slug: "online-check-in",
    label: "Online check-in",
    description: "Empty page",
  },
  {
    slug: "cargo-brochure",
    label: "Cargo Brochure",
    description: "Empty page",
  },
  {
    slug: "accessibility-statement",
    label: "Accessibility statement",
    description: "Empty page",
  },
  // Destination pages under /our-destinations (same parent marker the admin's
  // "Add new page" dialog writes). Jeddah was created in the admin.
  {
    slug: "flights-to-jeddah",
    label: "Flights to Jeddah",
    description: "[[parent:our-destinations]]",
  },
  {
    slug: "flights-to-medina",
    label: "Flights to Medina",
    description: "[[parent:our-destinations]]",
  },
];

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

for (const page of PAGES) {
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${page.slug}&select=id,slug,label`,
  });
  if (!Array.isArray(existing)) {
    console.error("pages lookup failed:", restError(existing, "unknown error"));
    process.exit(1);
  }
  if (existing[0]?.id) {
    console.log("page exists:", page.slug, existing[0].id);
    continue;
  }
  if (dryRun) {
    console.log("[dry-run] would create:", page.slug, JSON.stringify(page.description));
    continue;
  }
  const inserted = curl("POST", "/rest/v1/pages", {
    token,
    prefer: "return=representation",
    body: {
      slug: page.slug,
      label: page.label,
      description: page.description,
      status: "published",
    },
  });
  const row = Array.isArray(inserted) ? inserted[0] : inserted;
  if (!row?.id) {
    console.error("pages insert failed:", page.slug, restError(inserted, "unknown error"));
    process.exit(1);
  }
  console.log("page created:", page.slug, row.id);
}

console.log("Done.");
