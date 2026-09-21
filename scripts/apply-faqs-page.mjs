/**
 * One-off admin task for the FAQs dynamic page:
 *   1. Ensure page-hero, search-console, help-faqs, get-help, and
 *      live-chat-banner types exist.
 *   2. Ensure the "faqs" page row exists.
 *   3. Seed blocks per language (EN + AR), if that language has none:
 *        0 page-hero
 *        1 search-console
 *        2 help-faqs (nested explorer)
 *        3 get-help
 *        4 live-chat-banner
 *
 * Idempotent: re-running upserts the types/page and only seeds a language's
 * blocks when that language has none.
 *
 *   node scripts/apply-faqs-page.mjs
 *
 * NOTE: behind a TLS-inspecting proxy the Supabase JS client fails with
 * "fetch failed" — use the curl auth+REST recipe in the cms2 docs instead.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { faqCategories as FAQ_SOURCE } from "../../new_fly_cham/src/pages/faqs/utils/faqData.js";

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

const PAGE_SLUG = "faqs";
const HERO_TYPE = "page-hero";
const SEARCH_TYPE = "search-console";
const EXPLORER_TYPE = "help-faqs";
const HELP_TYPE = "get-help";
const CHAT_TYPE = "live-chat-banner";

const EXTRA_BY_ID = {
  "booking-classesAndFareTypes-3": "fareComparison",
  "modifications-flightChange-2": "flightChangeFees",
  "cancellationsAndRefunds-flightRefund-1": "economyRefundFees",
  "baggage-checkedBaggage-1": "economyCheckedBaggage",
};

const PAYMENT_TOPIC_ID = "beforeTravel-paymentMethods";

const PAYMENT_TABS = [
  { id: "channels", title: { en: "Channels", ar: "القنوات" } },
  { id: "stripe", title: { en: "Stripe", ar: "سترايب" } },
  { id: "cards", title: { en: "Credit and Debit Cards", ar: "بطاقات الائتمان والخصم" } },
  { id: "paymera", title: { en: "Paymera", ar: "بيميرا" } },
  { id: "tabby", title: { en: "Tabby", ar: "تابي" } },
  { id: "tamara", title: { en: "Tamara", ar: "تمارا" } },
];

const BRANCH_TO_TAB = {
  "Payment Methods": "channels",
  Channels: "channels",
  Stripe: "stripe",
  "Credit and Debit Cards": "cards",
  "Cham Pay": "paymera",
  Paymera: "paymera",
  Tabby: "tabby",
  Tamara: "tamara",
};

function loc(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || "";
}

function buildCategories(lang) {
  return FAQ_SOURCE.map((category) => ({
    id: category.id,
    title: loc(category.title, lang),
    icon: category.id,
    topics: (category.topics || []).map((topic) => {
      const questions = (topic.questions || []).map((question) => {
        const methodTab =
          topic.id === PAYMENT_TOPIC_ID
            ? BRANCH_TO_TAB[loc(question.branch, "en")] || "channels"
            : "";
        return {
          id: question.id,
          question: loc(question.question, lang),
          answer: loc(question.answer, lang),
          branch: loc(question.branch, lang),
          extra: EXTRA_BY_ID[question.id] || "",
          methodTab,
        };
      });

      const usedTabs = new Set(questions.map((question) => question.methodTab).filter(Boolean));
      const methodTabs =
        topic.id === PAYMENT_TOPIC_ID
          ? PAYMENT_TABS.filter(
              (tab) => tab.id === "channels" || usedTabs.has(tab.id)
            ).map((tab) => ({
              id: tab.id,
              title: loc(tab.title, lang),
            }))
          : [];

      return {
        id: topic.id,
        title: loc(topic.title, lang),
        methodTabs,
        questions,
      };
    }),
  }));
}

const TEXT = {
  en: {
    hero: {
      title: "Frequently Asked Questions",
      subtitle: "Find quick answers to the most common questions",
    },
    search: {
      label: "Ask Your Question",
      placeholder: "Search for a topic or question...",
      popularLabel: "Popular search",
      popularItems: [
        { label: "Baggage" },
        { label: "Booking online" },
        { label: "Check-in" },
        { label: "Flight Status" },
      ],
    },
    explorer: {
      navLabel: "FAQ topics",
      changeTopic: "Change topic",
      openAll: "Open all Questions",
      closeAll: "Close all Questions",
      empty: "Questions for this topic will appear here.",
    },
    help: {
      title: "Get Help",
      subtitle: "You can get support and assistance wherever you are.",
      items: [
        {
          icon: "headset",
          title: "Customer Care",
          description:
            "Contact our Customer Care team for urgent assistance with bookings, flight status, and cancellations.",
          href: "/help/contact-us",
        },
        {
          icon: "clipboard",
          title: "Forms and Requests",
          description:
            "Submit a request, service request, complaint, or feedback.",
          href: "/help/contact-us/forms",
        },
      ],
    },
    chat: {
      title: "Start Live Chat",
      description:
        "Chat with our Customer Service team and get immediate support for your questions and inquiries.",
      buttonLabel: "Chat now",
    },
  },
  ar: {
    hero: {
      title: "الأسئلة الشائعة",
      subtitle: "اعثر على إجابات سريعة لأكثر الأسئلة شيوعاً",
    },
    search: {
      label: "اطرح سؤالك",
      placeholder: "ابحث عن موضوع أو سؤال...",
      popularLabel: "عمليات البحث الشائعة",
      popularItems: [
        { label: "الأمتعة" },
        { label: "الحجز عبر الإنترنت" },
        { label: "تسجيل الوصول" },
        { label: "حالة الرحلة" },
      ],
    },
    explorer: {
      navLabel: "مواضيع الأسئلة الشائعة",
      changeTopic: "تغيير الموضوع",
      openAll: "فتح جميع الأسئلة",
      closeAll: "إغلاق جميع الأسئلة",
      empty: "ستظهر أسئلة هذا الموضوع هنا.",
    },
    help: {
      title: "احصل على المساعدة",
      subtitle: "يمكنك الحصول على الدعم والمساعدة في أي وقت.",
      items: [
        {
          icon: "headset",
          title: "خدمة الزبائن",
          description:
            "تواصل مع فريق خدمة الزبائن للحصول على مساعدة فورية بخصوص الحجوزات، وحالة الرحلات، والإلغاءات.",
          href: "/help/contact-us",
        },
        {
          icon: "clipboard",
          title: "النماذج والطلبات",
          description:
            "يمكنك تقديم طلب استرداد، أو طلب خدمة، أو ملاحظة أو مشاركة رأيك في خدماتنا.",
          href: "/help/contact-us/forms",
        },
      ],
    },
    chat: {
      title: "ابدأ الدردشة",
      description:
        "تحدّث مباشرةً مع فريق خدمة زبائن فلاي شام واحصل على الدعم الفوري لأسئلتك واستفساراتك.",
      buttonLabel: "تحدث الآن",
    },
  },
};

function buildHeroContent(lang) {
  const t = TEXT[lang].hero;
  return {
    title: t.title,
    subtitle: t.subtitle,
    imageUrl: "",
    imageAlt: "",
    imageMask: "",
    links: [],
  };
}

function buildSearchContent(lang) {
  const t = TEXT[lang].search;
  return {
    label: t.label,
    placeholder: t.placeholder,
    submitLabel: "",
    popularLabel: t.popularLabel,
    popularItems: t.popularItems,
    types: ["faq"],
    links: [],
  };
}

function buildExplorerContent(lang) {
  const t = TEXT[lang].explorer;
  return {
    navLabel: t.navLabel,
    changeTopic: t.changeTopic,
    openAll: t.openAll,
    closeAll: t.closeAll,
    empty: t.empty,
    categories: buildCategories(lang),
    links: [],
  };
}

function buildHelpContent(lang) {
  const t = TEXT[lang].help;
  return {
    title: t.title,
    subtitle: t.subtitle,
    items: t.items,
    links: [],
  };
}

function buildChatContent(lang) {
  const t = TEXT[lang].chat;
  return {
    title: t.title,
    description: t.description,
    buttonLabel: t.buttonLabel,
    buttonHref: "",
    buttonLinkType: "external",
    ctaButton: {
      content: t.buttonLabel,
      label: t.buttonLabel,
      href: "",
      slug: "",
    },
    links: [],
  };
}

const BLOCKS = [
  {
    type: HERO_TYPE,
    style: { showImage: false },
    content: buildHeroContent,
  },
  {
    type: SEARCH_TYPE,
    style: { showSubmit: false },
    content: buildSearchContent,
  },
  {
    type: EXPLORER_TYPE,
    style: {},
    content: buildExplorerContent,
  },
  {
    type: HELP_TYPE,
    style: {},
    content: buildHelpContent,
  },
  {
    type: CHAT_TYPE,
    style: {},
    content: buildChatContent,
  },
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

for (const row of [
  { id: HERO_TYPE, label: "Page Hero" },
  { id: SEARCH_TYPE, label: "Search Console" },
  { id: EXPLORER_TYPE, label: "Help FAQs" },
  { id: HELP_TYPE, label: "Get Help" },
  { id: CHAT_TYPE, label: "Live Chat Banner" },
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
  console.log("component_types ok:", row.id);
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
        label: "FAQs",
        description: "Help FAQs with nested explorer, Get Help, and live chat",
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
