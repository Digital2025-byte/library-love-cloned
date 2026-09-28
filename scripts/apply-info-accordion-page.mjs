/**
 * Append "info-accordion" as the last block on the seat-selection page.
 *
 *   1. Register the "info-accordion" component type.
 *   2. Ensure the "seat-selection" page row exists.
 *   3. Per language (EN + AR): if an info-accordion is already linked, skip;
 *      otherwise insert at max(position)+1 (end of the page).
 *
 * Usage (from the cms/ directory):
 *   node scripts/apply-info-accordion-page.mjs
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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "seat-selection";
const TYPE_ID = "info-accordion";

const STYLE = {
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  cardBg: "50",
  cardRadius: "sm",
  dividerColor: "200",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  bodyColor: "600",
  bodyFontWeight: "normal",
  bodyColorHover: "600",
  bodyFontWeightHover: "normal",
  iconColor: "700",
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-800",
  linkFontWeight: "medium",
  linkUnderline: true,
  linkItalic: false,
};

const TEXT = {
  en: {
    items: [
      {
        id: "terms",
        title: "Terms and Conditions",
        body: "Fly Cham’s crew will meet children using this service at the airport check-in desk, escort them to the gate, and ensure their safe boarding. Upon arrival, the person meeting the child must have an ID card to prove their identity. This ID card must match the person named on the original booking form. No one else can represent the person named, even if they have the original person's ID card with them as proof.",
        defaultOpen: true,
      },
      {
        id: "more",
        title: "More Information",
        body: "Fly Cham does not offer unaccompanied minors on connecting flights",
        defaultOpen: true,
      },
    ],
    links: [],
  },
  ar: {
    items: [
      {
        id: "terms",
        title: "الشروط والأحكام",
        body: "يلتقي طاقم فلاي شام بالأطفال المستخدمين لهذه الخدمة عند مكتب تسجيل الوصول في المطار، ويرافقهم إلى البوابة، ويضمن صعودهم بأمان. عند الوصول، يجب أن يحمل الشخص المستقبِل للطفل بطاقة هوية تثبت هويته. يجب أن تطابق هذه البطاقة الشخص المذكور في نموذج الحجز الأصلي. لا يمكن لأي شخص آخر تمثيل الشخص المذكور، حتى لو كان يحمل بطاقة هويته كإثبات.",
        defaultOpen: true,
      },
      {
        id: "more",
        title: "مزيد من المعلومات",
        body: "لا تقدّم فلاي شام خدمة القاصر غير المصحوب على الرحلات المتصلة",
        defaultOpen: true,
      },
    ],
    links: [],
  },
};

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.msg || fallback;
}

function curl(method, path, { token, query, body, prefer } = {}) {
  const qs = query ? `?${query}` : "";
  const endpoint = `${url.replace(/\/$/, "")}${path}${qs}`;
  const args = [
    "-sS",
    "-X",
    method,
    endpoint,
    "-H",
    `apikey: ${key}`,
    "-H",
    "Content-Type: application/json",
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  if (body !== undefined) args.push("--data-binary", JSON.stringify(body));
  const raw = execFileSync("curl", args, { encoding: "utf8" });
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function componentTypeOf(row) {
  const nested = row?.components;
  if (Array.isArray(nested)) return nested[0]?.type || "";
  return nested?.type || "";
}

if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY in cms/.env");
  process.exit(1);
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

{
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    prefer: "resolution=merge-duplicates,return=minimal",
    body: { id: TYPE_ID, label: "Info Accordion" },
  });
  if (res?.message) {
    console.error("component_types upsert failed:", restError(res, "unknown error"));
    process.exit(1);
  }
  console.log("component_types ok:", TYPE_ID);
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
        label: "Seat Selection",
        description: "Choose your seat and plan your trip",
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
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
  });
  if (!Array.isArray(links)) {
    console.error(
      `page_components lookup failed (${lang}):`,
      restError(links, "unknown error")
    );
    process.exit(1);
  }

  const already = links.some((row) => componentTypeOf(row) === TYPE_ID);
  if (already) {
    console.log(`kept ${lang}: info-accordion already present`);
    continue;
  }

  const maxPos = links.reduce(
    (max, row) => Math.max(max, Number(row.position) || 0),
    -1
  );
  const position = maxPos + 1;

  const inserted = curl("POST", "/rest/v1/components", {
    token,
    prefer: "return=representation",
    body: {
      type: TYPE_ID,
      position,
      style: { [lang]: STYLE },
      content: { [lang]: TEXT[lang] },
    },
  });
  const comp = Array.isArray(inserted) ? inserted[0] : inserted;
  if (!comp?.id) {
    console.error(
      `components insert failed (${lang}):`,
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
      position,
      lang,
    },
  });
  if (link?.message) {
    console.error(
      `page_components link failed (${lang}):`,
      restError(link, "unknown error")
    );
    process.exit(1);
  }

  console.log(`appended info-accordion (${lang}) at position ${position}:`, comp.id);
}

console.log("Done.");
