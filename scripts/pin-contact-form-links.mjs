/**
 * Point Contact Forms cards at the request-a-form page for the matched form.
 * Placeholder links (`#`, empty, or the forms index) are replaced. A custom
 * link is kept. Idempotent.
 *
 *   node scripts/pin-contact-form-links.mjs
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
  if (result.status !== 0) throw new Error(result.stderr || `curl exited ${result.status}`);
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

const SUPPORT_FORM_IDS = [
  "bookingChange", "transportation", "nameCorrection", "paymentIssue",
  "unaccompaniedMinor", "groupTravel", "corporateTravel", "wheelchair",
  "oxygenService", "refund", "ancillaryRefund", "lostBaggage", "delayedBaggage",
  "claimMiles", "feedback", "apiIntegration", "partnerGsa", "cargo",
];

function formIdToRequestSlug(formId) {
  const kebab = String(formId)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return `request-${kebab}`;
}
const FORM_ALIASES = {
  payment: "paymentIssue",
  baggage: "delayedBaggage",
  assistance: "wheelchair",
  specialassistance: "wheelchair",
};
const TITLE_TO_FORM = {
  paymentissue: "paymentIssue",
  مشكلةفوالدفع: "paymentIssue",
  refundrequest: "refund",
  refund: "refund",
  طلباسترداد: "refund",
  delayedbaggage: "delayedBaggage",
  أمتعةمتأخرة: "delayedBaggage",
  specialassistance: "wheelchair",
  wheelchair: "wheelchair",
  مساعدةخاصة: "wheelchair",
};
const GENERIC = new Set(["", "#", "/help/contact-us/forms", "/help/contact-us/forms/"]);

function foldKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, "");
}

function matchId(form) {
  for (const raw of [form?.id, form?.icon]) {
    const key = foldKey(raw);
    if (!key) continue;
    if (FORM_ALIASES[key]) return FORM_ALIASES[key];
    const exact = SUPPORT_FORM_IDS.find((id) => foldKey(id) === key);
    if (exact) return exact;
  }
  return TITLE_TO_FORM[foldKey(form?.title)] || null;
}

function requestHref(formId) {
  return `/help/contact-us/forms/${formIdToRequestSlug(formId)}`;
}

function resolveHref(form) {
  const href = String(form?.href || "").trim();
  if (href.includes("request-a-form") || /\/forms\/request-/.test(href)) {
    const prefixed = href.match(/\/forms\/(request-[^/?#]+)/);
    if (prefixed && prefixed[1] !== "request-a-form") {
      return `/help/contact-us/forms/${prefixed[1]}`.split("?")[0];
    }
    const query = href.match(/[?&]form=([^&#]+)/);
    if (query) return requestHref(decodeURIComponent(query[1]));
    const matched = matchId(form);
    return matched ? requestHref(matched) : href;
  }
  const detail = href.match(/^\/help\/contact-us\/forms\/([^/?#]+)\/?$/);
  if (detail) {
    const id = matchId({ id: detail[1] }) || decodeURIComponent(detail[1]);
    return requestHref(id);
  }
  const matched = matchId(form);
  if (matched && GENERIC.has(href)) return requestHref(matched);
  return href;
}

function patchForms(forms) {
  if (!Array.isArray(forms)) return { forms, changed: false };
  let changed = false;
  const next = forms.map((form) => {
    if (!form || typeof form !== "object") return form;
    const href = resolveHref(form);
    if (!href || href === String(form.href || "").trim()) return form;
    changed = true;
    return { ...form, href };
  });
  return { forms: next, changed };
}

function patchNode(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    return { node, changed: false };
  }
  let changed = false;
  const next = { ...node };
  if (Array.isArray(node.forms)) {
    const patched = patchForms(node.forms);
    if (patched.changed) {
      next.forms = patched.forms;
      changed = true;
    }
  }
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (!child || typeof child !== "object" || Array.isArray(child)) continue;
    if (!Array.isArray(child.forms)) continue;
    const patched = patchForms(child.forms);
    if (patched.changed) {
      next[key] = { ...child, forms: patched.forms };
      changed = true;
    }
  }
  if (Array.isArray(node.translations)) {
    const translations = node.translations.map((item) => {
      if (!item?.content) return item;
      const patched = patchNode(item.content);
      if (!patched.changed) return item;
      changed = true;
      return { ...item, content: patched.node };
    });
    next.translations = translations;
  }
  return { node: next, changed };
}

const rows = rest("GET", "components?type=eq.contact-forms&select=id,content");
let updated = 0;
for (const row of rows) {
  const patched = patchNode(row.content || {});
  if (!patched.changed) continue;
  rest("PATCH", `components?id=eq.${row.id}`, { content: patched.node });
  updated += 1;
  const langs = ["en", "ar"].filter((lang) => patched.node?.[lang]?.forms);
  const sample = (langs[0] && patched.node[langs[0]].forms) || patched.node.forms || [];
  console.log(
    `${row.id}: ${sample.map((form) => `${form.icon || form.title} -> ${form.href}`).join(" | ")}`
  );
}
console.log(`done: ${updated} contact-forms block(s) updated, ${rows.length - updated} already linked`);
