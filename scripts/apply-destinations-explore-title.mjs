/**
 * Patch existing destinations-explore components with the section title.
 *
 *   node scripts/apply-destinations-explore-title.mjs
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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const TITLES = {
  en: "Explore Fly Cham Destinations",
  ar: "استكشف وجهات فلاي شام",
};

const TITLE_STYLE = {
  showTitle: true,
  titleColor: "800",
  titleFontWeight: "semibold",
  titleColorHover: "800",
  titleFontWeightHover: "semibold",
  subtitleColor: "700",
  subtitleFontWeight: "normal",
  subtitleColorHover: "700",
  subtitleFontWeightHover: "normal",
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

const rows = curl("GET", "/rest/v1/components", {
  token,
  query: "type=eq.destinations-explore&select=id,content,style",
});
if (!Array.isArray(rows)) {
  console.error("components lookup failed:", restError(rows, "unknown error"));
  process.exit(1);
}

console.log(`Found ${rows.length} destinations-explore component(s).`);

for (const row of rows) {
  const content = row.content && typeof row.content === "object" ? { ...row.content } : {};
  const style = row.style && typeof row.style === "object" ? { ...row.style } : {};

  for (const lang of ["en", "ar"]) {
    if (content[lang] && typeof content[lang] === "object") {
      content[lang] = { ...content[lang], title: TITLES[lang] };
    }
    if (style[lang] && typeof style[lang] === "object") {
      style[lang] = { ...style[lang], ...TITLE_STYLE };
    } else if (Object.keys(style).length && !style.en && !style.ar) {
      // Legacy flat style — merge once.
      Object.assign(style, TITLE_STYLE);
    }
  }

  // Also handle flat (non language-scoped) content shapes.
  if (content.subtitle && !content.en && !content.ar && !content.title) {
    content.title = TITLES.en;
  }

  const patched = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { content, style },
  });
  if (patched?.message) {
    console.error(`patch failed (${row.id}):`, restError(patched, "unknown error"));
    process.exit(1);
  }
  console.log("patched:", row.id);
}

console.log("Done.");
