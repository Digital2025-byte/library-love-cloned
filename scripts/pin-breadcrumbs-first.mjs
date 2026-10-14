/**
 * Move every breadcrumbs block to position 0 on its page and language.
 * Other blocks keep their relative order and are renumbered 1..n.
 * Idempotent: a language whose breadcrumbs is already first is skipped.
 *
 *   node scripts/pin-breadcrumbs-first.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  const eq = t.indexOf("=");
  if (!t || t.startsWith("#") || eq === -1) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!process.env[k]) process.env[k] = v;
}

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function curl(method, target, { token, body, prefer } = {}) {
  const args = [
    "-sS",
    "-X",
    method,
    target,
    "-H",
    `apikey: ${key}`,
    "-H",
    "Content-Type: application/json",
    "-w",
    "\n%{http_code}",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  if (body !== undefined) args.push("--data-binary", JSON.stringify(body));
  const result = spawnSync("curl.exe", args, { encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `curl exited ${result.status}`);
  }
  const text = result.stdout ?? "";
  const split = text.lastIndexOf("\n");
  const code = Number(text.slice(split + 1).trim());
  const payload = split === -1 ? "" : text.slice(0, split);
  if (code < 200 || code >= 300) {
    throw new Error(`${method} ${code} ${payload.slice(0, 300)}`);
  }
  return payload ? JSON.parse(payload) : null;
}

const auth = curl("POST", `${url}/auth/v1/token?grant_type=password`, {
  body: { email: "admin@flycham.local", password: "FlyChamAdmin!2026" },
});
if (!auth?.access_token) throw new Error("Sign-in failed");

function rest(method, path, body) {
  return curl(method, `${url}/rest/v1/${path}`, {
    token: auth.access_token,
    body,
    prefer: body === undefined ? undefined : "return=minimal",
  });
}

function componentType(link) {
  const component = link.components;
  if (Array.isArray(component)) return component[0]?.type || "";
  return component?.type || "";
}

const pages = await rest(
  "GET",
  "pages?select=slug,page_components(id,position,lang,components(type))&order=slug.asc"
);

let changed = 0;
let already = 0;
let missing = 0;

for (const page of pages) {
  const links = Array.isArray(page.page_components) ? page.page_components : [];
  const byLang = new Map();
  for (const link of links) {
    const lang = link.lang || "en";
    if (!byLang.has(lang)) byLang.set(lang, []);
    byLang.get(lang).push(link);
  }
  if (byLang.size === 0) {
    missing += 1;
    continue;
  }

  for (const [lang, group] of byLang) {
    const sorted = [...group].sort(
      (a, b) => a.position - b.position || String(a.id).localeCompare(String(b.id))
    );
    const crumbs = [];
    const others = [];
    let seenRest = false;
    let needsPin = false;
    for (const link of sorted) {
      if (componentType(link) === "breadcrumbs") {
        crumbs.push(link);
        if (seenRest) needsPin = true;
      } else {
        others.push(link);
        seenRest = true;
      }
    }
    if (crumbs.length === 0) {
      missing += 1;
      continue;
    }
    if (!needsPin) {
      already += 1;
      continue;
    }
    const next = [...crumbs, ...others];
    const updates = next
      .map((link, position) => ({ link, position }))
      .filter(({ link, position }) => link.position !== position);
    await Promise.all(
      updates.map(({ link, position }) =>
        rest("PATCH", `page_components?id=eq.${link.id}`, { position })
      )
    );
    changed += 1;
    console.log(
      `${page.slug} [${lang}]: breadcrumbs ${sorted.findIndex((link) => componentType(link) === "breadcrumbs")} -> 0 (${updates.length} positions)`
    );
  }
}

console.log(
  `done: ${changed} language(s) moved, ${already} already first, ${missing} without breadcrumbs`
);
