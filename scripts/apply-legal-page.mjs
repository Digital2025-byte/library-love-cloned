/**
 * One-off admin task for the Legal hub dynamic page:
 *   1. Ensure the legal-hub type exists.
 *   2. Ensure the "legal" page row exists.
 *   3. Seed the legal-hub block per language (EN + AR), if that language has none.
 *
 * Idempotent: re-running upserts the type/page and only seeds a language's
 * blocks when that language has none.
 *
 *   node scripts/apply-legal-page.mjs
 *
 * NOTE: behind a TLS-inspecting proxy the Supabase JS client fails with
 * "fetch failed" — use the curl auth+REST recipe in the cms2 docs instead.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "legal";
const HUB_TYPE = "legal-hub";

const ITEMS = [
  {
    icon: "shield",
    href: "/legal/privacy-policy",
    title: {
      en: "Privacy Policy",
      ar: "سياسة الخصوصية",
    },
    description: {
      en: "Learn how we collect and protect your personal information.",
      ar: "تعرّف على كيفية جمعنا لمعلوماتك الشخصية وحمايتها.",
    },
    cta: {
      en: "View privacy policy",
      ar: "عرض سياسة الخصوصية",
    },
  },
  {
    icon: "cookie",
    href: "/legal/cookies",
    title: {
      en: "Cookies Policy",
      ar: "سياسة ملفات تعريف الارتباط",
    },
    description: {
      en: "Understand how we use cookies to enhance your experience.",
      ar: "تعرّف على كيفية استخدامنا لملفات تعريف الارتباط لتحسين تجربتك.",
    },
    cta: {
      en: "View cookies policy",
      ar: "عرض سياسة ملفات تعريف الارتباط",
    },
  },
  {
    icon: "airplane-tilt",
    href: "/legal/booking-terms-and-conditions",
    title: {
      en: "Booking Terms and Conditions",
      ar: "شروط وأحكام الحجز",
    },
    description: {
      en: "Review the terms for your ticket, baggage, check-in, changes, and refunds.",
      ar: "اطّلع على شروط تذكرتك والأمتعة وتسجيل الوصول والتعديلات والاسترداد.",
    },
    cta: {
      en: "View booking terms",
      ar: "عرض شروط الحجز",
    },
  },
  {
    icon: "scroll",
    href: "/legal/terms-and-conditions",
    title: {
      en: "Website Terms and Conditions",
      ar: "شروط وأحكام الموقع الإلكتروني",
    },
    description: {
      en: "Review the terms for using Fly Cham's services and website.",
      ar: "اطّلع على شروط استخدام خدمات فلاي شام وموقعها الإلكتروني.",
    },
    cta: {
      en: "View website terms",
      ar: "عرض شروط الموقع",
    },
  },
];

function buildHubContent(lang) {
  return {
    title: lang === "ar" ? "المعلومات القانونية" : "Legal Information",
    subtitle:
      lang === "ar"
        ? "اطّلع على الشروط والسياسات والمعلومات التي توضّح حقوقك ومسؤولياتك عند الحجز والسفر واستخدام موقع فلاي شام وخدماتها"
        : "Find the terms, policies, and information that explain your rights and responsibilities when booking, travelling, and using Fly Cham's website and services",
    items: ITEMS.map((item) => ({
      icon: item.icon,
      href: item.href,
      title: item.title[lang],
      description: item.description[lang],
      cta: item.cta[lang],
    })),
    help: {
      title:
        lang === "ar"
          ? "هل تحتاج إلى مساعدة في إيجاد إجابة؟"
          : "Need Help Finding an Answer?",
      description:
        lang === "ar"
          ? "اعثر على معلومات الاتصال والأسئلة الشائعة وخيارات الدعم التي تحتاجها في مركز مساعدة فلاي شام."
          : "Find the contact information, FAQs, and support options you need in the Fly Cham Help Centre.",
      cta: lang === "ar" ? "زيارة مركز المساعدة" : "Visit Help Center",
      href: "/help",
      imageUrl: "",
      imageAlt:
        lang === "ar"
          ? "موظف خدمة عملاء في فلاي شام يرتدي سماعة رأس"
          : "A Fly Cham customer service agent wearing a headset",
      objectPosition: "70% center",
    },
  };
}

const BLOCKS = [
  { type: HUB_TYPE, style: {}, content: buildHubContent },
];

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

  let bodyFile;
  if (body !== undefined) {
    bodyFile = join(
      tmpdir(),
      `flycham-curl-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    writeFileSync(bodyFile, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${bodyFile}`);
  }

  try {
    const stdout = execFileSync("curl.exe", args, {
      encoding: "utf8",
      maxBuffer: 20_000_000,
    });
    const trimmed = stdout.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
    }
  } finally {
    if (bodyFile) {
      try {
        unlinkSync(bodyFile);
      } catch {
        // ignore temp cleanup
      }
    }
  }
}

function componentTypeOf(link) {
  const row = link?.components;
  const component = Array.isArray(row) ? row[0] : row;
  return component?.type || null;
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

const role = curl("POST", "/rest/v1/rpc/ensure_first_admin", { token, body: {} });
if (role?.message) console.warn("ensure_first_admin warning:", role.message);

{
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id: HUB_TYPE, label: "Legal Hub" },
  });
  if (res?.message) {
    console.error("component_types upsert failed:", restError(res, "unknown error"));
    process.exit(1);
  }
  console.log("component_types ok:", HUB_TYPE);
}

let pageId;
{
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${PAGE_SLUG}&select=id`,
  });
  if (!Array.isArray(existing)) {
    console.error("pages lookup failed:", restError(existing, "unknown error"));
    process.exit(1);
  }
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: PAGE_SLUG,
        label: "Legal Information",
        description: "Legal hub with directory cards and a help banner",
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) {
      console.error("pages insert failed:", restError(inserted, "unknown error"));
      process.exit(1);
    }
    pageId = row.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,components(type)&order=position.asc`,
  });
  if (!Array.isArray(links)) {
    console.error(
      `page_components lookup failed (${lang}):`,
      restError(links, "unknown error")
    );
    process.exit(1);
  }

  const existingTypes = new Set(links.map((row) => componentTypeOf(row)).filter(Boolean));
  if (existingTypes.size === BLOCKS.length) {
    console.log(`page already has ${links.length} ${lang} block(s) — skipping seed.`);
    continue;
  }
  if (links.length) {
    console.log(
      `page has ${links.length} ${lang} block(s); seeding missing types.`
    );
  }

  for (let position = 0; position < BLOCKS.length; position += 1) {
    const block = BLOCKS[position];
    if (existingTypes.has(block.type)) {
      console.log(`already present ${block.type} (${lang}) — skip.`);
      continue;
    }
    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: {
        type: block.type,
        position,
        style: { [lang]: block.style },
        content: { [lang]: block.content(lang) },
      },
    });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) {
      console.error(
        `components insert failed (${lang} ${block.type}):`,
        restError(inserted, "unknown error")
      );
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: {
        page_id: pageId,
        component_id: comp.id,
        lang,
        position,
      },
    });
    if (link?.message) {
      console.error(
        `page_components insert failed (${lang} ${block.type}):`,
        restError(link, "unknown error")
      );
      process.exit(1);
    }
    console.log(`seeded ${block.type} block (${lang}):`, comp.id);
  }

  const verify = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=position,components(type)&order=position.asc`,
  });
  const order = Array.isArray(verify)
    ? verify.map((row) => `${row.position}:${componentTypeOf(row)}`).join(" → ")
    : "(lookup failed)";
  console.log(`order (${lang}):`, order);
}

console.log("Done.");
