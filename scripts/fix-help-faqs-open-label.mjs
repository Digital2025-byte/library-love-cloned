/**
 * Help FAQs English "Open all" was saved as "Close all Questions", so the
 * toggle never changed. Restore the open label. Arabic is already correct.
 *
 *   node scripts/fix-help-faqs-open-label.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

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
const OPEN = "Open all Questions";
const CLOSE = "Close all Questions";

function curl(method, target, { token, body, prefer } = {}) {
  const args = [
    "-sS", "-X", method, target,
    "-H", `apikey: ${key}`,
    "-H", "Content-Type: application/json",
    "-w", "\n%{http_code}",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  let bodyFile;
  if (body !== undefined) {
    bodyFile = resolve(tmpdir(), `help-faqs-patch-${Date.now()}.json`);
    writeFileSync(bodyFile, JSON.stringify(body));
    args.push("--data-binary", `@${bodyFile}`);
  }
  const result = spawnSync("curl.exe", args, { encoding: "utf8" });
  if (bodyFile) {
    try {
      unlinkSync(bodyFile);
    } catch {
      /* temp body already gone */
    }
  }
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `curl exited ${result.status}`);
  const text = result.stdout ?? "";
  const split = text.lastIndexOf("\n");
  const code = Number(text.slice(split + 1).trim());
  const payload = split === -1 ? "" : text.slice(0, split);
  if (code < 200 || code >= 300) throw new Error(`${method} ${code} ${payload.slice(0, 300)}`);
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

const rows = rest("GET", "components?type=eq.help-faqs&select=id,content");
let updated = 0;
for (const row of rows) {
  const content = row.content;
  if (!content || typeof content !== "object") continue;
  const locales = ["en", "ar"].filter((lang) => content[lang] && typeof content[lang] === "object");
  const targets = locales.length ? locales.map((lang) => content[lang]) : [content];
  let changed = false;
  for (const locale of targets) {
    if (locale.openAll === CLOSE && locale.closeAll === CLOSE) {
      locale.openAll = OPEN;
      changed = true;
    }
  }
  if (!changed) continue;
  rest("PATCH", `components?id=eq.${row.id}`, { content });
  updated += 1;
  console.log(`${row.id}: open label restored`);
}
console.log(`done: ${updated} help-faqs block(s) updated`);
