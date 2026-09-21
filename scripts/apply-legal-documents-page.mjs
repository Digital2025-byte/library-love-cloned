/**
 * One-off admin task for the four legal document pages:
 *   /legal/new-terms-and-conditions          slug terms-and-conditions
 *   /legal/new-booking-terms-and-conditions  slug booking-terms-and-conditions
 *   /legal/new-privacy-policy                slug privacy-policy
 *   /legal/new-cookies                       slug cookies
 *
 * Blocks per page: 0 page-media-hero, 1 legal-document, 2 legal-more-info.
 *
 *   node scripts/apply-legal-documents-page.mjs
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

const HERO_TYPE = "page-media-hero";
const DOC_TYPE = "legal-document";
const MORE_TYPE = "legal-more-info";

const en = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/en.json"),
    "utf8"
  )
);
const ar = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "../new_fly_cham/src/i18n/locales/ar.json"),
    "utf8"
  )
);

const LOCALES = { en, ar };

function navItems(lang) {
  const nav = LOCALES[lang].legal.nav;
  return [
    { id: "hub", label: nav.hub, href: "/new-legal" },
    { id: "privacy", label: nav.privacy, href: "/legal/new-privacy-policy" },
    {
      id: "terms",
      label: nav.terms,
      href: "/legal/new-terms-and-conditions",
    },
    { id: "cookies", label: nav.cookies, href: "/legal/new-cookies" },
    { id: "chamMiles", label: nav.chamMiles, href: "" },
    {
      id: "ticket",
      label: nav.ticket,
      href: "/legal/new-booking-terms-and-conditions",
    },
  ];
}

function mapBlocks(blocks = []) {
  return blocks.map((block) => ({
    type: block.type || "p",
    text: block.text || "",
    items: Array.isArray(block.items) ? block.items : [],
  }));
}

function mapCardSections(sections = []) {
  return sections.map((section, index) => ({
    id: `legal-section-${index + 1}`,
    variant: "card",
    title: section.title || "",
    body: section.body || "",
    items: Array.isArray(section.items) ? section.items : [],
    blocks: mapBlocks(section.blocks),
  }));
}

function moreInfoCards(lang, ids) {
  const cards = LOCALES[lang].legal.cards;
  const iconFor = (id) => (id === "cookies" ? "cookie" : "shield");
  const hrefFor = {
    terms: "/legal/new-terms-and-conditions",
    privacy: "/legal/new-privacy-policy",
    cookies: "/legal/new-cookies",
    beforeYouBook: "/legal/new-booking-terms-and-conditions",
    manageBooking: `https://flycham.com/gb/${lang}/manage-booking`,
    prepareJourney: "/travel-experience/before-you-fly",
  };
  return ids.map((id) => ({
    id,
    icon: iconFor(id),
    title: cards[id]?.title || "",
    description: cards[id]?.description || "",
    cta: cards[id]?.cta || "",
    href: hrefFor[id],
  }));
}

function buildHero(lang, pageKey, coverKey) {
  const hero = LOCALES[lang].legal[pageKey].hero;
  return {
    title: hero.title,
    subtitle: hero.subtitle,
    imageUrl: "",
    imageAlt: hero.imageAlt,
    coverKey,
    links: [],
  };
}

function buildMore(lang, cardIds) {
  return {
    title: LOCALES[lang].legal.moreInfoTitle,
    cards: moreInfoCards(lang, cardIds),
    links: [],
  };
}

function buildTermsDoc(lang) {
  const page = LOCALES[lang].legal.terms;
  return {
    layout: "sidebar",
    showNav: true,
    navItems: navItems(lang),
    activeId: "terms",
    dateLine: page.effectiveDate,
    introTitle: page.intro.title,
    introBody: page.intro.body,
    introParagraphs: [],
    introBullets: [],
    introAfter: "",
    summaryTitle: "",
    summaryIntro: "",
    summaryPoints: [],
    tocTitle: "",
    tocItems: [],
    inShortLabel: "",
    sections: mapCardSections(page.sections),
    contact: {
      variant: "links",
      title: page.contact.title,
      intro: page.contact.intro,
      emailLabel: page.contact.emailLabel,
      email: page.contact.email,
      phoneLabel: page.contact.phoneLabel,
      phone: page.contact.phone,
    },
  };
}

function buildPrivacyDoc(lang) {
  const page = LOCALES[lang].legal.privacy;
  return {
    layout: "sidebar",
    showNav: true,
    navItems: navItems(lang),
    activeId: "privacy",
    dateLine: page.lastUpdated,
    introTitle: "",
    introBody: "",
    introParagraphs: page.intro.paragraphs || [],
    introBullets: page.intro.bullets || [],
    introAfter: page.intro.afterBullets || "",
    summaryTitle: page.summary.title,
    summaryIntro: page.summary.intro,
    summaryPoints: page.summary.points || [],
    tocTitle: page.toc.title,
    tocItems: (page.toc.items || []).map((text, index) => ({
      text,
      href: `#legal-section-${index + 1}`,
    })),
    inShortLabel: page.inShortLabel,
    sections: mapCardSections(page.sections),
    contact: { variant: "hidden" },
  };
}

function buildBookingDoc(lang) {
  const page = LOCALES[lang].legal.bookingTerms;
  return {
    layout: "sidebar",
    showNav: true,
    navItems: navItems(lang),
    activeId: "ticket",
    dateLine: "",
    introTitle: "",
    introBody: "",
    introParagraphs: [],
    introBullets: [],
    introAfter: "",
    summaryTitle: "",
    summaryIntro: "",
    summaryPoints: [],
    tocTitle: "",
    tocItems: [],
    inShortLabel: "",
    sections: mapCardSections(page.sections),
    contact: { variant: "hidden" },
  };
}

function buildCookiesDoc(lang) {
  const page = LOCALES[lang].legal.cookies;
  return {
    layout: "sheet",
    showNav: false,
    navItems: [],
    activeId: "",
    dateLine: page.effectiveDate,
    introTitle: "",
    introBody: "",
    introParagraphs: [],
    introBullets: [],
    introAfter: "",
    summaryTitle: "",
    summaryIntro: "",
    summaryPoints: [],
    tocTitle: "",
    tocItems: [],
    inShortLabel: "",
    sections: [
      {
        id: "legal-section-1",
        variant: "prose",
        title: page.whatAre.title,
        body: page.whatAre.body,
      },
      {
        id: "legal-section-2",
        variant: "tint-stack",
        title: page.typesTitle,
        cards: page.types,
      },
      {
        id: "legal-section-3",
        variant: "grid-tiles",
        title: page.thirdParty.title,
        body: page.thirdParty.intro,
        items: page.thirdParty.items,
      },
      {
        id: "legal-section-4",
        variant: "preferences",
        title: page.preferences.title,
        body: page.preferences.intro,
        methods: page.preferences.methods,
        note: page.preferences.note,
      },
      {
        id: "legal-section-5",
        variant: "tint-grid",
        title: page.duration.title,
        body: page.duration.intro,
        cards: page.duration.items,
      },
      {
        id: "legal-section-6",
        variant: "prose",
        title: page.updates.title,
        body: page.updates.body,
      },
      {
        id: "legal-section-7",
        variant: "contact-company",
        title: page.contact.title,
        body: page.contact.intro,
        company: page.contact.company,
        department: page.contact.department,
        emailLabel: page.contact.emailLabel,
        email: page.contact.email,
        phoneLabel: page.contact.phoneLabel,
        phone: page.contact.phone,
      },
    ],
    contact: { variant: "hidden" },
  };
}

const PAGES = [
  {
    slug: "terms-and-conditions",
    label: "Website Terms and Conditions",
    description: "Website terms document with sidebar, clause cards, and more-info band",
    coverKey: "legal-terms",
    pageKey: "terms",
    doc: buildTermsDoc,
    moreIds: ["privacy", "cookies"],
    docStyle: { columnGap: "relaxed" },
  },
  {
    slug: "booking-terms-and-conditions",
    label: "Booking Terms and Conditions",
    description: "Booking terms document with sidebar and clause cards",
    coverKey: "legal-terms",
    pageKey: "bookingTerms",
    doc: buildBookingDoc,
    moreIds: ["manageBooking", "prepareJourney"],
    docStyle: { columnGap: "relaxed" },
  },
  {
    slug: "privacy-policy",
    label: "Privacy Policy",
    description: "Privacy notice with sidebar, summary, TOC, and clause cards",
    coverKey: "legal-privacy",
    pageKey: "privacy",
    doc: buildPrivacyDoc,
    moreIds: ["cookies", "terms"],
    docStyle: {},
  },
  {
    slug: "cookies",
    label: "Cookies Policy",
    description: "Cookies article sheet with tint cards and more-info band",
    coverKey: "legal-cookies",
    pageKey: "cookies",
    doc: buildCookiesDoc,
    moreIds: ["beforeYouBook", "privacy"],
    docStyle: {},
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
        // ignore
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
  { id: HERO_TYPE, label: "Page Media Hero" },
  { id: DOC_TYPE, label: "Legal Document" },
  { id: MORE_TYPE, label: "Legal More Info" },
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

for (const page of PAGES) {
  let pageId;
  const existing = curl("GET", "/rest/v1/pages", {
    token,
    query: `slug=eq.${page.slug}&select=id`,
  });
  if (!Array.isArray(existing)) {
    console.error("pages lookup failed:", restError(existing, "unknown error"));
    process.exit(1);
  }
  if (existing[0]?.id) {
    pageId = existing[0].id;
    console.log("page exists:", page.slug, pageId);
  } else {
    const inserted = curl("POST", "/rest/v1/pages", {
      token,
      prefer: "return=representation",
      body: {
        slug: page.slug,
        label: page.label,
        description: page.description,
        status: "published",
      },
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    if (!row?.id) {
      console.error("pages insert failed:", restError(inserted, "unknown error"));
      process.exit(1);
    }
    pageId = row.id;
    console.log("page created:", page.slug, pageId);
  }

  const blocksFor = (lang) => [
    {
      type: HERO_TYPE,
      style: {},
      content: buildHero(lang, page.pageKey, page.coverKey),
    },
    {
      type: DOC_TYPE,
      style: page.docStyle,
      content: page.doc(lang),
    },
    {
      type: MORE_TYPE,
      style: {},
      content: buildMore(lang, page.moreIds),
    },
  ];

  for (const lang of ["en", "ar"]) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,components(type)&order=position.asc`,
    });
    if (!Array.isArray(links)) {
      console.error(
        `page_components lookup failed (${page.slug} ${lang}):`,
        restError(links, "unknown error")
      );
      process.exit(1);
    }
    const blocks = blocksFor(lang);
    const existingTypes = new Set(
      links.map((row) => componentTypeOf(row)).filter(Boolean)
    );
    if (existingTypes.size === blocks.length) {
      console.log(
        `${page.slug} already has ${links.length} ${lang} block(s) — skipping seed.`
      );
      continue;
    }
    if (links.length) {
      console.log(
        `${page.slug} has ${links.length} ${lang} block(s); seeding missing types.`
      );
    }

    for (let position = 0; position < blocks.length; position += 1) {
      const block = blocks[position];
      if (existingTypes.has(block.type)) {
        console.log(`already present ${page.slug} ${block.type} (${lang}) — skip.`);
        continue;
      }
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
        console.error(
          `components insert failed (${page.slug} ${lang} ${block.type}):`,
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
          `page_components insert failed (${page.slug} ${lang} ${block.type}):`,
          restError(link, "unknown error")
        );
        process.exit(1);
      }
      console.log(`seeded ${page.slug} ${block.type} (${lang}):`, comp.id);
    }

    const verify = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}&select=position,components(type)&order=position.asc`,
    });
    const order = Array.isArray(verify)
      ? verify.map((row) => `${row.position}:${componentTypeOf(row)}`).join(" → ")
      : "(lookup failed)";
    console.log(`order (${page.slug} ${lang}):`, order);
  }
}

console.log("Done.");
