/**
 * Upload login-dropdown WebP assets to cms-media/layout/.
 *   node scripts/upload-login-panel-assets.mjs
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

const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL).replace(
  /\/$/,
  "",
);
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const ASSETS = resolve(
  process.cwd(),
  "../new_fly_cham/tmp-login-assets",
);
const UPLOADS = [
  { src: "panel-bg.webp", dest: "login-panel-bg.webp" },
  { src: "cham-miles-logo.webp", dest: "login-cham-miles-logo.webp" },
];

function curl(method, path, { body, token, query, file, contentType, headers } = {}) {
  const qs = query ? `?${query}` : "";
  const args = [
    "-sS",
    "-X",
    method,
    `${url}${path}${qs}`,
    "-H",
    `apikey: ${key}`,
    "-H",
    `Content-Type: ${contentType || "application/json"}`,
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  for (const header of headers || []) args.push("-H", header);
  if (file) args.push("--data-binary", `@${file}`);
  else if (body !== undefined) args.push("--data-binary", JSON.stringify(body));
  const stdout = execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 20_000_000,
  });
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return { raw: trimmed };
  }
}

const auth = curl("POST", "/auth/v1/token", {
  query: "grant_type=password",
  body: { email, password },
});
if (!auth?.access_token) {
  console.error("Sign-in failed:", auth);
  process.exit(1);
}
const token = auth.access_token;

for (const { src, dest } of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/layout/${dest}`, {
    token,
    file: resolve(ASSETS, src),
    contentType: "image/webp",
    headers: ["x-upsert: true", "Cache-Control: max-age=3600"],
  });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) {
    console.error(`upload failed (${dest}):`, res);
    process.exit(1);
  }
  console.log(
    "uploaded:",
    `https://${url.replace(/^https?:\/\//, "")}/storage/v1/object/public/cms-media/layout/${dest}`,
  );
  console.log("  ->", res?.Key || res?.Id || "ok");
}

console.log("done");
