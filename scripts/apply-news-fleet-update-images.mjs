/**
 * One-off admin task: point the news-fleet-update page's image fields
 * (/media-center/news/fleetUpdate) at the cms-media bucket.
 *
 * The page was seeded with empty image URLs and relied on bundled fallbacks in
 * new_fly_cham; those were removed (images now come only from the CMS). This
 * fills the same photos — already in the bucket as webp — into EN + AR:
 *   news-detail-header      imageUrl    media-center/news-grid-3.webp
 *   news-detail-gallery     items[]     news-grid-3, news-grid-2, latest-news
 *   news-detail-figure      imageUrl    our-destenations/damascus.webp
 *   media-newsletter-signup patternUrl  recent-news/pattern.webp
 * Only EMPTY fields are filled; anything an editor already set is kept.
 *
 *   node scripts/apply-news-fleet-update-images.mjs
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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "news-fleet-update";
const MEDIA = `${String(url).replace(/\/$/, "")}/storage/v1/object/public/cms-media`;

const GALLERY = [
  `${MEDIA}/media-center/news-grid-3.webp`,
  `${MEDIA}/media-center/news-grid-2.webp`,
  `${MEDIA}/media-center/latest-news.webp`,
];

/** Per block type: fill the empty image fields of one language's content. */
const FILLERS = {
  "news-detail-header": (c) => ({
    ...c,
    imageUrl: c.imageUrl || `${MEDIA}/media-center/news-grid-3.webp`,
  }),
  "news-detail-gallery": (c) => {
    const items = Array.isArray(c.items) && c.items.length
      ? c.items
      : GALLERY.map((_, i) => ({ id: `gallery-${i + 1}`, imageUrl: "" }));
    return {
      ...c,
      items: items.map((item, i) => ({
        ...item,
        imageUrl: item.imageUrl || GALLERY[i % GALLERY.length],
      })),
    };
  },
  "news-detail-figure": (c) => ({
    ...c,
    imageUrl: c.imageUrl || `${MEDIA}/our-destenations/damascus.webp`,
  }),
  "media-newsletter-signup": (c) => ({
    ...c,
    patternUrl: c.patternUrl || `${MEDIA}/recent-news/pattern.webp`,
  }),
};

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

// JSON body goes through a UTF-8 temp file: `curl -d <arg>` on Windows
// mangles Arabic into "????".
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
  let dir;
  if (body !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "cms-seed-"));
    const file = join(dir, "body.json");
    writeFileSync(file, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${file}`);
  }
  let stdout;
  try {
    stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
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

function fail(label, res) {
  console.error(`${label}:`, restError(res, "unknown error"));
  process.exit(1);
}

console.log("Target project:", url);

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) fail("Sign-in failed", auth);
const token = auth.access_token;
console.log("Signed in as", email);

const pages = curl("GET", "/rest/v1/pages", { token, query: `slug=eq.${PAGE_SLUG}&select=id` });
if (!Array.isArray(pages) || !pages[0]?.id) fail(`page ${PAGE_SLUG} not found`, pages);
const pageId = pages[0].id;

const links = curl("GET", "/rest/v1/page_components", {
  token,
  query: `page_id=eq.${pageId}&select=lang,components(id,type,content)`,
});
if (!Array.isArray(links)) fail("page_components lookup failed", links);

// One component row can be linked in both languages — keep the latest content
// per id so the second language's write doesn't drop the first one's.
const latest = new Map();

for (const link of links) {
  const comp = Array.isArray(link.components) ? link.components[0] : link.components;
  const fill = comp && FILLERS[comp.type];
  if (!fill) continue;
  if (latest.has(comp.id)) comp.content = latest.get(comp.id);
  const lang = link.lang;
  const current = comp.content?.[lang] || {};
  const next = fill(current);
  if (JSON.stringify(next) === JSON.stringify(current)) {
    console.log(`unchanged ${comp.type} (${lang})`);
    continue;
  }
  const content = { ...comp.content, [lang]: next };
  const res = curl("PATCH", "/rest/v1/components", {
    token,
    query: `id=eq.${comp.id}`,
    prefer: "return=minimal",
    body: { content },
  });
  if (res?.message) fail(`update failed (${comp.type} ${lang})`, res);
  latest.set(comp.id, content);
  console.log(`filled ${comp.type} (${lang}):`, comp.id);
}

console.log("Done. Open /en/media-center/news/fleetUpdate");
