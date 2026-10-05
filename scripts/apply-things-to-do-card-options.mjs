/**
 * Set the new DestinationThingsToDo card options on EVERY existing
 * `destination-things-to-do` component (all pages, draft + published, EN + AR):
 * cards show title + "Discover more" button — description hidden, card button on.
 * Also sets the card-button label ("Discover more" / "اكتشف المزيد").
 *
 *   NODE_EXTRA_CA_CERTS=... node scripts/apply-things-to-do-card-options.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const BODY_FILE = join(tmpdir(), "apply-things-to-do-card-options.json");

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

const TYPE = "destination-things-to-do";
const PATCH = { hideCardDescription: true, showCardButton: true };
// Card button label, applied to every instance.
const LEARN_MORE = { en: "Discover more", ar: "اكتشف المزيد" };

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
  // Send the body from a UTF-8 file: inline args mangle Arabic on Windows.
  if (body !== undefined) {
    writeFileSync(BODY_FILE, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${BODY_FILE}`);
  }
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

function mergeStyle(style) {
  const next = style && typeof style === "object" ? { ...style } : {};
  // Legacy flat style (no en/ar keys).
  if (Object.keys(next).length && !next.en && !next.ar) {
    return { ...next, ...PATCH };
  }
  for (const lang of ["en", "ar"]) {
    next[lang] = {
      ...(next[lang] && typeof next[lang] === "object" ? next[lang] : {}),
      ...PATCH,
    };
  }
  return next;
}

function mergeContent(content) {
  const next = content && typeof content === "object" ? { ...content } : {};
  for (const lang of Object.keys(LEARN_MORE)) {
    if (next[lang] && typeof next[lang] === "object") {
      next[lang] = { ...next[lang], learnMore: LEARN_MORE[lang] };
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

const components = curl("GET", "/rest/v1/components", {
  token,
  query: `type=eq.${TYPE}&select=id,style,content`,
});
if (!Array.isArray(components)) {
  console.error("components lookup failed:", restError(components, "unknown"));
  process.exit(1);
}
console.log(`Found ${components.length} ${TYPE} component(s).`);

for (const row of components) {
  const patched = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { style: mergeStyle(row.style), content: mergeContent(row.content) },
  });
  if (patched?.message) {
    console.error(`patch failed (${row.id}):`, restError(patched, "unknown"));
    process.exit(1);
  }
  console.log("patched:", row.id);
}

console.log("Done.");
