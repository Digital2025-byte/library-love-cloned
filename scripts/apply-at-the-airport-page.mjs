/**
 * One-off admin task for the At the Airport page (Figma 39457:12163):
 *   1. Register the airport-service-cards component type.
 *   2. Upload the Figma photos to cms-media/at-the-airport/*.webp.
 *   3. Ensure the "at-the-airport" page row exists (child of travel-experience
 *      on the public site; the CMS slug stays flat).
 *   4. Seed EN + AR blocks when a language has none, or replace them when the
 *      existing order is not the design:
 *        0 breadcrumbs
 *        1 page-media-hero
 *        2 airport-service-cards
 *        3 promo-banner
 *
 *   node scripts/apply-at-the-airport-page.mjs
 *   node scripts/apply-at-the-airport-page.mjs --repair
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

const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL).replace(/\/$/, "");
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "at-the-airport";
const PAGE_LABEL = "At the Airport";
const PAGE_DESCRIPTION = "Airport services: lounge, wheelchair assistance, and priority boarding";
const FOLDER = "at-the-airport";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), `../new_fly_cham/src/assets/images-webp/${FOLDER}`);
const UPLOADS = [
  "hero.webp",
  "lounge.webp",
  "wheelchair.webp",
  "priority-boarding.webp",
  "support.webp",
];
const EXPECTED = ["breadcrumbs", "page-media-hero", "airport-service-cards", "promo-banner"];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "airport-service-cards", label: "Airport Service Cards" },
  { id: "promo-banner", label: "Promo Banner" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

const text = (colorKey, color, weight) => {
  const weightKey = colorKey.endsWith("Color")
    ? colorKey.replace(/Color$/, "FontWeight")
    : `${colorKey}FontWeight`;
  return {
    [colorKey]: color,
    [weightKey]: weight,
    [`${colorKey}Hover`]: color,
    [`${weightKey}Hover`]: weight,
  };
};

const LAYOUT = { sectionPadding: "none", showSectionBg: false, sectionBg: "100" };

const CRUMBS_STYLE = {
  ...LAYOUT,
  ...text("crumbColor", "600", "medium"),
  crumbColorHover: "primary-1",
  ...text("currentColor", "primary-1", "semibold"),
  ...text("focusColor", "primary-1", "medium"),
  separatorColor: "600",
  crumbUnderline: false,
  ...BACKLINKS,
};

const HERO_STYLE = {
  layout: "cover",
  height: "default",
  titleSize: "default",
  contentWidth: "default",
  overlayWidth: "default",
  objectPosition: "center",
  sectionBg: "100",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  showButton: false,
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "700", "normal"),
  ...BACKLINKS,
};

const CARDS_STYLE = {
  ...LAYOUT,
  showHeader: true,
  showTitle: true,
  showSubtitle: true,
  headerAlign: "center",
  columns: "3",
  cardGap: "default",
  cardRadius: "lg",
  imageHeight: "default",
  ...text("titleColor", "700", "semibold"),
  ...text("subtitleColor", "700", "normal"),
  cardBg: "background",
  showCardShadow: true,
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "700", "normal"),
  showLink: true,
  showLinkIcon: true,
  learnMoreColor: "primary-1",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "50",
  learnMoreFontWeightHover: "semibold",
  arrowBadgeBg: "primary-1",
  arrowColor: "50",
  ...BACKLINKS,
};

const PROMO_STYLE = {
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: false,
  showOverlay: true,
  sectionBg: "100",
  sectionPadding: "none",
  bannerHeight: "medium",
  bannerRadius: "sm",
  objectPosition: "center",
  overlayColor: "primary-1",
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "normal"),
  buttonBg: "secondary",
  buttonBgHover: "secondary-800",
  buttonText: "700",
  buttonTextFontWeight: "semibold",
  buttonTextHover: "700",
  buttonTextFontWeightHover: "semibold",
  ...BACKLINKS,
};

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "At The Airport"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "At The Airport",
      subtitle:
        "Plan ahead with our services designed to help you prepare before departure and enjoy a smoother journey from the start",
      imageAlt: "A traveller with luggage walking through the airport",
    },
    cards: {
      title: "Airport service",
      subtitle: "Support and facilities to make your time at the airport easier.",
      learnMore: "Learn More",
      items: [
        {
          id: "lounge",
          image: "lounge.webp",
          title: "Business Lounge",
          description:
            "Relax before your flight in a comfortable lounge environment with space to unwind or prepare for your journey.",
          imageAlt: "A business lounge with seating and warm lighting",
        },
        {
          id: "wheelchair",
          image: "wheelchair.webp",
          title: "Wheelchair Assistance",
          description:
            "Request mobility support at the airport for a smoother journey through check-in, security, and boarding.",
          imageAlt: "A passenger receiving wheelchair assistance at the airport",
        },
        {
          id: "priorityBoarding",
          image: "priority-boarding.webp",
          title: "Priority Boarding",
          description:
            "Enjoy a more convenient boarding experience with priority support. Beat the queues and settle into your seat sooner.",
          imageAlt: "A Fly Cham aircraft parked at the airport gate",
        },
      ],
    },
    promo: {
      title: "Find the Support You Need",
      description:
        "Access helpful information, contact Fly Cham, browse frequently asked questions, or submit and track a request through our Help Centre.",
      buttonLabel: "Visit the Help Center",
      imageAlt: "A Fly Cham agent ready to help a passenger",
    },
  },
  ar: {
    crumbs: ["الرئيسية", "في المطار"],
    ariaLabel: "مسار التنقّل",
    hero: {
      title: "في المطار",
      subtitle:
        "خطّط مسبقاً مع خدماتنا المصممة لمساعدتك على الاستعداد قبل المغادرة والاستمتاع برحلة أكثر سلاسة من البداية",
      imageAlt: "مسافرة مع حقيبتها في ممر المطار",
    },
    cards: {
      title: "خدمات المطار",
      subtitle: "دعم ومرافق لجعل وقتك في المطار أسهل.",
      learnMore: "اعرف المزيد",
      items: [
        {
          id: "lounge",
          image: "lounge.webp",
          title: "صالة رجال الأعمال",
          description:
            "استرح قبل رحلتك في بيئة صالة مريحة مع مساحة للاسترخاء أو الاستعداد لرحلتك.",
          imageAlt: "صالة رجال أعمال مع مقاعد وإضاءة دافئة",
        },
        {
          id: "wheelchair",
          image: "wheelchair.webp",
          title: "دعم الكرسي المتحرك",
          description:
            "اطلب دعم التنقّل في المطار لرحلة أكثر سلاسة خلال تسجيل الوصول والأمن والصعود.",
          imageAlt: "مسافر يتلقى مساعدة الكرسي المتحرك في المطار",
        },
        {
          id: "priorityBoarding",
          image: "priority-boarding.webp",
          title: "الصعود بأولوية",
          description:
            "استمتع بتجربة صعود أكثر راحة مع دعم الأولوية. تجنّب الطوابير واستقر في مقعدك في وقت أقرب.",
          imageAlt: "طائرة فلاي شام متوقفة عند بوابة المطار",
        },
      ],
    },
    promo: {
      title: "اعثر على الدعم الذي تحتاجه",
      description:
        "اطّلع على معلومات مفيدة، وتواصل مع فلاي شام، وتصفّح الأسئلة الشائعة، أو أرسل طلباً وتابعه عبر مركز المساعدة.",
      buttonLabel: "زر مركز المساعدة",
      imageAlt: "موظفة فلاي شام جاهزة لمساعدة المسافر",
    },
  },
};

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const crumbHrefs = ["/", ""];
  return [
    {
      type: "breadcrumbs",
      style: CRUMBS_STYLE,
      content: {
        items: copy.crumbs.map((label, i) => ({ label, href: crumbHrefs[i] })),
        separator: "/",
        ariaLabel: copy.ariaLabel,
        links: [],
      },
    },
    {
      type: "page-media-hero",
      style: HERO_STYLE,
      content: {
        title: copy.hero.title,
        subtitle: copy.hero.subtitle,
        imageUrl: `${MEDIA}/hero.webp`,
        imageAlt: copy.hero.imageAlt,
        image: { fileUrl: `${MEDIA}/hero.webp`, alt: copy.hero.imageAlt },
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "airport-service-cards",
      style: CARDS_STYLE,
      content: {
        title: copy.cards.title,
        subtitle: copy.cards.subtitle,
        items: copy.cards.items.map((item) => ({
          id: item.id,
          imageUrl: `${MEDIA}/${item.image}`,
          imageAlt: item.imageAlt,
          title: item.title,
          description: item.description,
          cta: copy.cards.learnMore,
          href: "/help",
          icon: "ArrowRight",
        })),
        links: [],
      },
    },
    {
      type: "promo-banner",
      style: PROMO_STYLE,
      content: {
        title: copy.promo.title,
        description: copy.promo.description,
        buttonLabel: copy.promo.buttonLabel,
        buttonHref: "/help",
        imageUrl: `${MEDIA}/support.webp`,
        imageAlt: copy.promo.imageAlt,
        ctaButton: { content: copy.promo.buttonLabel, href: "/help" },
        image: { fileUrl: `${MEDIA}/support.webp`, alt: copy.promo.imageAlt },
        links: [],
      },
    },
  ];
}

function restError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || payload.error_description || payload.error || fallback;
}

function curl(method, path, { body, token, prefer, query, file, contentType, headers } = {}) {
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
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  for (const header of headers || []) args.push("-H", header);
  let dir;
  if (file) {
    args.push("--data-binary", `@${file}`);
  } else if (body !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "cms-seed-"));
    const tmp = join(dir, "body.json");
    writeFileSync(tmp, JSON.stringify(body), "utf8");
    args.push("--data-binary", `@${tmp}`);
  }
  let stdout;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 20_000_000 });
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      const transient = error?.status === 52 || error?.status === 56 || error?.status === 28;
      if (!transient || attempt === 3) break;
    }
  }
  if (dir) rmSync(dir, { recursive: true, force: true });
  if (lastError) throw lastError;
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Non-JSON from ${path}: ${trimmed.slice(0, 400)}`);
  }
}

function componentTypeOf(link) {
  const row = link?.components;
  const component = Array.isArray(row) ? row[0] : row;
  return component?.type || null;
}

function seedLanguage(token, pageId, lang) {
  const blocks = buildBlocks(lang);
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
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang} ${block.type}):`, restError(link, "unknown error"));
      process.exit(1);
    }
    console.log(`seeded ${block.type} (${lang}) @${position}:`, comp.id);
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

for (const row of COMPONENT_TYPES) {
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

for (const name of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, {
    token,
    file: resolve(ASSETS, name),
    contentType: "image/webp",
    headers: ["x-upsert: true", "Cache-Control: max-age=3600"],
  });
  if (res?.error || (res?.statusCode && Number(res.statusCode) >= 400)) {
    console.error(`image upload failed (${name}):`, restError(res, JSON.stringify(res)));
    process.exit(1);
  }
  console.log("image uploaded:", `${FOLDER}/${name}`);
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
        label: PAGE_LABEL,
        description: PAGE_DESCRIPTION,
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

const repair = process.argv.includes("--repair");

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }
  const ordered = links.slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const types = ordered.map(componentTypeOf);
  const matches = types.length === EXPECTED.length && types.every((type, i) => type === EXPECTED[i]);

  if (matches && repair) {
    const blocks = buildBlocks(lang);
    for (const row of ordered) {
      const block = blocks[row.position];
      const res = curl("PATCH", "/rest/v1/components", {
        token,
        query: `id=eq.${row.component_id}`,
        prefer: "return=minimal",
        body: {
          type: block.type,
          style: { [lang]: block.style },
          content: { [lang]: block.content },
        },
      });
      if (res?.message) {
        console.error(`repair failed (${lang} ${block.type}):`, restError(res, "unknown error"));
        process.exit(1);
      }
      console.log(`repaired ${block.type} (${lang}) @${row.position}`);
    }
    continue;
  }

  if (matches) {
    console.log(`kept ${lang}:`, types.join(" → "));
    continue;
  }

  if (ordered.length) {
    const ids = ordered.map((row) => row.component_id).filter(Boolean);
    const removedLinks = curl("DELETE", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${pageId}&lang=eq.${lang}`,
      prefer: "return=minimal",
    });
    if (removedLinks?.message) {
      console.error(`page_components delete failed (${lang}):`, restError(removedLinks, "unknown error"));
      process.exit(1);
    }
    if (ids.length) {
      const removed = curl("DELETE", "/rest/v1/components", {
        token,
        query: `id=in.(${ids.join(",")})`,
        prefer: "return=minimal",
      });
      if (removed?.message) {
        console.error(`components delete failed (${lang}):`, restError(removed, "unknown error"));
        process.exit(1);
      }
    }
    console.log(`replaced ${lang} (${types.join(" → ") || "empty"})`);
  }

  seedLanguage(token, pageId, lang);
}

console.log("Done. Open /en/travel-experience/at-the-airport");
