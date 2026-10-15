/**
 * Seed Search in Site (slug search-in-site) from existing blocks only:
 *   0 breadcrumbs
 *   1 page-hero (title, no image)
 *   2 search-console
 *   3 legal-more-info
 *
 * Idempotent: skips a language that already has blocks.
 *
 *   node scripts/apply-search-in-site-page.mjs
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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";
const PAGE_SLUG = "search-in-site";

const COPY = {
  en: {
    home: "Home",
    title: "Search In Site",
    placeholder: "Search",
    submit: "Search",
    helpTitle: "Do you need any help?",
    faqsTitle: "FAQs",
    faqsDescription:
      "Explore answers to the most common questions and find the information you need, all in one place.",
    contactTitle: "Contact us",
    contactDescription:
      "Have a question or need a hand? Get in touch with our team—we're here to help you find the answers and support you need.",
  },
  ar: {
    home: "الرئيسية",
    title: "البحث في الموقع",
    placeholder: "ابحث",
    submit: "بحث",
    helpTitle: "هل تحتاج إلى مساعدة؟",
    faqsTitle: "الأسئلة الشائعة",
    faqsDescription:
      "اطّلع على إجابات الأسئلة الأكثر شيوعاً واعثر على المعلومات التي تحتاجها في مكان واحد.",
    contactTitle: "اتصل بنا",
    contactDescription:
      "لديك سؤال أو تحتاج إلى مساعدة؟ تواصل مع فريقنا، نحن هنا لمساعدتك في العثور على الإجابات والدعم الذي تحتاجه.",
  },
};

function blocksFor(lang) {
  const copy = COPY[lang];
  return [
    {
      type: "breadcrumbs",
      style: { sectionPadding: "none", showSectionBg: false, separatorColor: "600" },
      content: {
        items: [
          { label: copy.home, href: "/" },
          { label: copy.title, href: "" },
        ],
        separator: "/",
        ariaLabel: "Breadcrumb",
      },
    },
    {
      type: "page-hero",
      style: {
        showTitle: true,
        showSubtitle: false,
        showImage: false,
        showMask: false,
        showSectionBg: false,
        titleColor: "primary-1",
        titleFontWeight: "bold",
      },
      content: { title: copy.title, subtitle: "", imageUrl: "", imageAlt: "" },
    },
    {
      type: "search-console",
      style: {
        showLabel: false,
        showSubmit: true,
        showPopular: false,
        showSearchIcon: true,
        showChips: false,
        showSectionBg: false,
        sectionPadding: "none",
        panelRadius: "xl",
        panelPadding: "compact",
        gradientFrom: "primary-1",
        gradientTo: "primary-1",
        inputBg: "background",
        inputTextColor: "700",
        submitBg: "secondary",
        submitTextColor: "700",
        submitFontWeight: "semibold",
      },
      content: {
        label: "",
        placeholder: copy.placeholder,
        submitLabel: copy.submit,
        popularLabel: "",
        popularItems: [],
      },
    },
    {
      type: "legal-more-info",
      style: {
        showSectionBg: false,
        titleColor: "700",
        titleFontWeight: "semibold",
        cardTitleColor: "700",
        cardTitleFontWeight: "semibold",
        cardDescriptionColor: "700",
        cardDescriptionFontWeight: "normal",
      },
      content: {
        title: copy.helpTitle,
        cards: [
          {
            id: "faqs",
            icon: "question",
            title: copy.faqsTitle,
            description: copy.faqsDescription,
            href: "/help/faqs",
          },
          {
            id: "contact",
            icon: "phone",
            title: copy.contactTitle,
            description: copy.contactDescription,
            href: "/help/contact-us",
          },
        ],
      },
    },
  ];
}

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
console.log("Signed in as", email);

for (const row of [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-hero", label: "Page Hero" },
  { id: "search-console", label: "Search Console" },
  { id: "legal-more-info", label: "Legal More Info" },
]) {
  const res = curl("POST", "/rest/v1/component_types", {
    token,
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: row,
  });
  if (res?.message) {
    console.error("component_types upsert failed:", restError(res, "unknown error"));
    process.exit(1);
  }
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
        label: "Search in Site",
        description: "Site search with help cards",
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
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }
  if (links.length) {
    console.log(`page already has ${links.length} ${lang} block(s) — skipping.`);
    continue;
  }

  const blocks = blocksFor(lang);
  for (let position = 0; position < blocks.length; position += 1) {
    const block = blocks[position];
    const inserted = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: {
        type: block.type,
        position,
        style: { [lang]: block.style },
        content: { [lang]: block.content },
      },
    });
    const comp = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!comp?.id) {
      console.error(`components insert failed (${lang} ${block.type}):`, restError(inserted, "unknown error"));
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, lang, position },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang} ${block.type}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${block.type} (${lang}):`, comp.id);
  }
}

console.log("Done.");
