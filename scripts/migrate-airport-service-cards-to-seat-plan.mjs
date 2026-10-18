/**
 * Convert every `airport-service-cards` component to `seat-plan`, remapping
 * content + style so the Seat Plan UI keeps the same copy and look (including
 * centered headers from Airport Service Cards). Then delete the obsolete
 * component type.
 *
 *   node scripts/migrate-airport-service-cards-to-seat-plan.mjs [--dry-run]
 *
 * Run from the cms/ directory (needs cms/.env with SUPABASE_* keys).
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
const DRY_RUN = process.argv.includes("--dry-run");

const OLD_TYPE = "airport-service-cards";
const NEW_TYPE = "seat-plan";
const LANG_KEYS = new Set(["en", "ar"]);

const workDir = mkdtempSync(join(tmpdir(), "migrate-airport-seat-"));
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

function isLanguageMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => LANG_KEYS.has(k));
}

/** Flat airport editor blob → seat-plan editor blob. */
function mapContentBlob(c) {
  if (!c || typeof c !== "object" || Array.isArray(c)) return c;
  const items = Array.isArray(c.items) ? c.items : [];
  const learnMore =
    c.learnMore ||
    items.map((it) => it?.cta).find((v) => String(v || "").trim()) ||
    "";
  return {
    title: c.title || "",
    description: c.subtitle ?? c.description ?? "",
    learnMore,
    items: items.map((it) => ({
      id: it?.id || "",
      imageUrl: it?.imageUrl || "",
      imageAlt: it?.imageAlt || "",
      title: it?.title || "",
      description: it?.description || "",
      href: it?.href || "",
    })),
    links: Array.isArray(c.links) ? c.links : [],
  };
}

function mapContent(content) {
  if (!content || typeof content !== "object") return content;
  if (Array.isArray(content.translations)) {
    return {
      ...content,
      translations: content.translations.map((t) => ({
        ...t,
        content: mapContentBlob(t?.content),
      })),
    };
  }
  if (isLanguageMap(content)) {
    const out = {};
    for (const [lang, blob] of Object.entries(content)) {
      out[lang] = mapContentBlob(blob);
    }
    return out;
  }
  return mapContentBlob(content);
}

/** Flat airport style → seat-plan style (preserve headerAlign). */
function mapStyleBlob(s) {
  if (!s || typeof s !== "object" || Array.isArray(s)) return s;
  const out = { ...s };

  if (out.showSubtitle !== undefined) {
    out.showDescription = out.showSubtitle;
    delete out.showSubtitle;
  }
  delete out.showTitle;

  const rename = [
    ["subtitleColor", "descriptionColor"],
    ["subtitleFontWeight", "descriptionFontWeight"],
    ["subtitleColorHover", "descriptionColorHover"],
    ["subtitleFontWeightHover", "descriptionFontWeightHover"],
    ["learnMoreColor", "buttonText"],
    ["learnMoreFontWeight", "buttonTextFontWeight"],
    ["learnMoreColorHover", "buttonTextHover"],
    ["learnMoreFontWeightHover", "buttonTextFontWeightHover"],
  ];
  for (const [from, to] of rename) {
    if (out[from] !== undefined) {
      if (out[to] === undefined) out[to] = out[from];
      delete out[from];
    }
  }

  if (out.linkAlign !== undefined) {
    if (out.learnMoreAlign === undefined) {
      out.learnMoreAlign = out.linkAlign === "end" ? "end" : "auto";
    }
    delete out.linkAlign;
  }

  if (out.cardRadius === "xl") out.cardRadius = "full";

  // Airport cards were centered by default; keep that when migrating.
  if (out.headerAlign === undefined) out.headerAlign = "center";

  delete out.imageHeight;
  delete out.showCardShadow;
  delete out.showLink;
  delete out.showLinkIcon;

  return out;
}

function mapStyle(style) {
  if (!style || typeof style !== "object") return style;
  if (isLanguageMap(style)) {
    const out = {};
    for (const [lang, blob] of Object.entries(style)) {
      out[lang] = mapStyleBlob(blob);
    }
    return out;
  }
  return mapStyleBlob(style);
}

if (!url || !key) fail("SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing in cms/.env");

console.log("Target:", url, DRY_RUN ? "(dry-run)" : "");

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail(`Sign-in failed: ${restError(auth, "no access_token")}`);
const token = auth.access_token;
console.log("Signed in as", email);

{
  const ensure = DRY_RUN
    ? null
    : curl("POST", "/rest/v1/component_types", {
        token,
        query: "on_conflict=id",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: { id: NEW_TYPE, label: "Seat Plan" },
      });
  if (ensure?.message) fail(`ensure ${NEW_TYPE}: ${restError(ensure, "?")}`);
  console.log(DRY_RUN ? `would ensure component_types ${NEW_TYPE}` : `component_types ok: ${NEW_TYPE}`);
}

const rows = curl("GET", "/rest/v1/components", {
  token,
  query: `type=eq.${OLD_TYPE}&select=id,type,content,style`,
});
if (!Array.isArray(rows)) fail(`list ${OLD_TYPE}: ${restError(rows, "?")}`);
console.log(`Found ${rows.length} ${OLD_TYPE} component(s)`);

let updated = 0;
for (const row of rows) {
  const nextContent = mapContent(row.content);
  const nextStyle = mapStyle(row.style);
  if (DRY_RUN) {
    console.log(`  would migrate ${row.id}`);
    updated += 1;
    continue;
  }
  const patched = curl("PATCH", `/rest/v1/components?id=eq.${row.id}`, {
    token,
    prefer: "return=minimal",
    body: { type: NEW_TYPE, content: nextContent, style: nextStyle },
  });
  if (patched?.message) fail(`patch ${row.id}: ${restError(patched, "?")}`);
  console.log(`  migrated ${row.id}`);
  updated += 1;
}

const remaining = curl("GET", "/rest/v1/components", {
  token,
  query: `type=eq.${OLD_TYPE}&select=id`,
});
if (!Array.isArray(remaining)) fail(`recheck ${OLD_TYPE}: ${restError(remaining, "?")}`);

if (remaining.length) {
  console.warn(`Still ${remaining.length} ${OLD_TYPE} row(s); not deleting type.`);
} else if (DRY_RUN) {
  console.log(`would delete component_types ${OLD_TYPE}`);
} else {
  const deleted = curl("DELETE", `/rest/v1/component_types?id=eq.${OLD_TYPE}`, {
    token,
    prefer: "return=minimal",
  });
  if (deleted?.message) fail(`delete type: ${restError(deleted, "?")}`);
  console.log(`component_types removed: ${OLD_TYPE}`);
}

rmSync(workDir, { recursive: true, force: true });
console.log(DRY_RUN ? `Dry run — would update ${updated} component(s).` : `Done. Updated ${updated} component(s).`);
