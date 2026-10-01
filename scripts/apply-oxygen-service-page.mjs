/**
 * One-off admin task for the Oxygen Service dynamic page (Figma 40347:13592):
 *   1. Register the service-steps component type (+ ensure the reused ones exist).
 *   2. Upload the Figma photos to cms-media/oxygen-service/*.webp.
 *   3. Ensure the "oxygen-service" page row exists.
 *   4. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs
 *        1 page-media-hero
 *        2 seat-journey            ("How can I request an in-flight oxygen service?")
 *        3 service-steps           (NEW — "Medical Report Requirements")
 *        4 faqs
 *        5 info-accordion          (Terms and Conditions / Service Availability)
 *        6 baggage-resource-cards  ("Check more things", 2 columns)
 *
 * Copy for the new block comes from cms2's demo i18n (serviceSteps); the rest
 * is the Figma copy below. FAQ answers + all Arabic copy are ours (Figma only
 * has the EN questions).
 *
 * Frontend URL: /travel-experience/before-you-fly/oxygen-service
 * CMS slug:     oxygen-service
 *
 *   node scripts/apply-oxygen-service-page.mjs
 *   node scripts/apply-oxygen-service-page.mjs --repair   # re-write seeded
 *     type/content/style onto the existing blocks at the same position
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

const PAGE_SLUG = "oxygen-service";
const PAGE_LABEL = "Oxygen Service";
const PAGE_DESCRIPTION =
  "In-flight medical oxygen: how to request it, medical report steps, FAQs and terms";
const FOLDER = "oxygen-service";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), `../new_fly_cham/src/assets/images-webp/${FOLDER}`);
const UPLOADS = [
  "hero.webp",
  "request.webp",
  "medical-report.webp",
  "extra-baggage.webp",
  "onboard.webp",
];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "seat-journey", label: "Seat Journey" },
  { id: "service-steps", label: "Service Steps" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
  { id: "baggage-resource-cards", label: "Baggage Resource Cards" },
];

const BACKLINKS = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

/** color + weight + both hover twins for one text role. */
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

// Figma: Home / … — 14px medium #5F5F5C; current page semibold primary.
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

// Figma hero: 500px, 64px bold primary title, 18px regular Text/700 subtitle.
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

// Text left / 607×400 photo right (12px radius), gold 52px "Request" button.
const INTRO_STYLE = {
  ...LAYOUT,
  layout: "default",
  imageSide: "right",
  imageRadius: "lg",
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  showButton: true,
  showButtonIcon: false,
  buttonSize: "medium",
  buttonBg: "secondary",
  buttonBgHover: "secondary-800",
  ...text("buttonText", "700", "semibold"),
  ...BACKLINKS,
};

// Photo left, numbered steps (tinted circle, Primary 1 step titles), gold CTA.
const STEPS_STYLE = {
  ...LAYOUT,
  imageSide: "left",
  imageRadius: "lg",
  showImage: true,
  showDescription: true,
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  showSteps: true,
  stepMarker: "number",
  markerBg: "",
  ...text("numberColor", "primary-1", "bold"),
  ...text("stepTitleColor", "primary-1", "semibold"),
  ...text("stepDescriptionColor", "700", "normal"),
  showButton: true,
  showButtonIcon: false,
  buttonBg: "secondary",
  buttonBgHover: "",
  ...text("buttonText", "700", "semibold"),
  ...BACKLINKS,
};

const FAQS_STYLE = {
  ...LAYOUT,
  showTitle: true,
  showBrowse: true,
  itemGap: "default",
  titleAlign: "left",
  ...text("titleColor", "700", "semibold"),
  itemBg: "background",
  itemBorderColor: "200",
  itemRadius: "lg",
  ...text("questionColor", "700", "medium"),
  ...text("answerColor", "600", "normal"),
  iconColor: "700",
  browseBg: "secondary",
  browseHoverBg: "secondary-800",
  ...text("browseText", "700", "semibold"),
  ...BACKLINKS,
};

const TERMS_STYLE = {
  ...LAYOUT,
  cardBg: "background",
  cardRadius: "sm",
  dividerColor: "200",
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "600", "normal"),
  iconColor: "700",
  ...BACKLINKS,
};

// "Check more things": 2 columns, 332px photos, full-width Primary 1 buttons.
const RESOURCE_STYLE = {
  ...LAYOUT,
  showHeader: true,
  showDescription: true,
  columns: "2",
  cardGap: "default",
  cardRadius: "lg",
  imageHeight: "xl",
  ...text("titleColor", "700", "semibold"),
  ...text("descriptionColor", "700", "normal"),
  cardBg: "background",
  showCardShadow: true,
  ...text("cardTitleColor", "700", "semibold"),
  ...text("cardDescriptionColor", "700", "normal"),
  showButton: true,
  showButtonIcon: true,
  buttonBg: "primary-1",
  buttonBgHover: "primary-800",
  ...text("buttonText", "50", "semibold"),
  ...BACKLINKS,
};

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Before You Fly", "Oxygen Service"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Oxygen Service",
      subtitle: "In-flight medical oxygen assistance for passengers who need it.",
      imageAlt: "Cabin crew helping a passenger with an oxygen mask on board",
    },
    intro: {
      title: "How can I request an in-flight oxygen service?",
      description:
        "You can request the service from Fly Cham at least 48 hours before your flight's scheduled departure, either through our sales offices or by submitting an oxygen service request via our website. Approval for the oxygen service is subject to the passenger providing a recent medical report clearing them for air travel.",
      imageAlt: "Cabin crew assisting a passenger using in-flight oxygen",
      buttonLabel: "Request Oxygen service",
    },
    faqs: {
      title: "Frequently Asked Questions",
      browseLabel: "Browse all FAQs",
      items: [
        {
          question: "Who is eligible for the in-flight oxygen service?",
          answer:
            "Passengers who need supplemental oxygen during the flight can request the service, provided they submit a recent medical report clearing them for air travel at least 48 hours before departure.",
        },
        {
          question: "What is the oxygen flow rate provided on board?",
          answer:
            "The flow rate is set according to your medical report, which must specify the oxygen flow rate per minute you require during the flight.",
        },
        {
          question: "Can I bring my own portable oxygen concentrator (POC)?",
          answer:
            "Please contact our sales offices before your flight. Personal oxygen devices are subject to approval under applicable aviation safety standards.",
        },
        {
          question: "Is there an additional charge for the oxygen service?",
          answer:
            "Service charges may apply depending on your route. Our team will confirm any applicable fee when reviewing your request.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "Oxygen Service Terms and Conditions",
        body:
          "Fly Cham reserves the right to reassign the passenger's seat for the oxygen cylinder service in accordance with applicable safety standards and procedures for such cases.",
      },
      {
        id: "availability",
        title: "Service Availability",
        body:
          "The in-flight oxygen service is available on selected Fly Cham routes. Availability may be subject to aircraft type and route. Please confirm availability when submitting your service request at least 48 hours before departure.",
      },
    ],
    more: {
      title: "Check more things",
      items: [
        {
          id: "extraBaggage",
          title: "Add extra baggage for your trip",
          description:
            "Check the list of restricted and prohibited items to stay safe and compliant with international aviation regulations.",
          buttonLabel: "add extra",
          imageAlt: "Navy suitcases stacked on top of each other",
        },
        {
          id: "onboard",
          title: "Check onboard experience",
          description:
            "Check the list of restricted and prohibited items to stay safe and compliant with international aviation regulations.",
          buttonLabel: "Explore onboard experience",
          imageAlt: "Young traveller enjoying the in-flight entertainment screen",
        },
      ],
    },
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "قبل أن تسافر", "خدمة الأكسجين"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "خدمة الأكسجين",
      subtitle: "مساعدة بالأكسجين الطبي على متن الطائرة للمسافرين الذين يحتاجون إليها.",
      imageAlt: "أحد أفراد الطاقم يساعد مسافرة بقناع الأكسجين على متن الطائرة",
    },
    intro: {
      title: "كيف يمكنني طلب خدمة الأكسجين على متن الطائرة؟",
      description:
        "يمكنك طلب الخدمة من فلاي شام قبل 48 ساعة على الأقل من موعد إقلاع رحلتك، إما من خلال مكاتب المبيعات لدينا أو بتقديم طلب خدمة الأكسجين عبر موقعنا الإلكتروني. وتخضع الموافقة على خدمة الأكسجين لتقديم المسافر تقريرًا طبيًا حديثًا يثبت لياقته للسفر جوًا.",
      imageAlt: "طاقم الطائرة يساعد مسافرة تستخدم الأكسجين أثناء الرحلة",
      buttonLabel: "اطلب خدمة الأكسجين",
    },
    faqs: {
      title: "الأسئلة الشائعة",
      browseLabel: "تصفح جميع الأسئلة",
      items: [
        {
          question: "من يحق له الاستفادة من خدمة الأكسجين على متن الطائرة؟",
          answer:
            "يمكن للمسافرين الذين يحتاجون إلى أكسجين إضافي أثناء الرحلة طلب الخدمة، شريطة تقديم تقرير طبي حديث يثبت لياقتهم للسفر جوًا قبل 48 ساعة على الأقل من الإقلاع.",
        },
        {
          question: "ما معدل تدفق الأكسجين المقدم على متن الطائرة؟",
          answer:
            "يُحدَّد معدل التدفق وفقًا لتقريرك الطبي، والذي يجب أن يوضح معدل تدفق الأكسجين في الدقيقة الذي تحتاجه أثناء الرحلة.",
        },
        {
          question: "هل يمكنني إحضار جهاز تركيز الأكسجين المحمول الخاص بي؟",
          answer:
            "يرجى التواصل مع مكاتب المبيعات لدينا قبل رحلتك. تخضع أجهزة الأكسجين الشخصية للموافقة وفق معايير سلامة الطيران المعمول بها.",
        },
        {
          question: "هل توجد رسوم إضافية على خدمة الأكسجين؟",
          answer:
            "قد تُطبَّق رسوم على الخدمة حسب خط رحلتك. سيؤكد فريقنا أي رسوم مطبقة عند مراجعة طلبك.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "شروط وأحكام خدمة الأكسجين",
        body:
          "تحتفظ فلاي شام بالحق في إعادة تعيين مقعد المسافر مع خدمة أسطوانة الأكسجين وفقًا لمعايير وإجراءات السلامة المطبقة في مثل هذه الحالات.",
      },
      {
        id: "availability",
        title: "توفر الخدمة",
        body:
          "تتوفر خدمة الأكسجين على متن الطائرة على خطوط مختارة لفلاي شام، وقد يعتمد توفرها على نوع الطائرة وخط الرحلة. يرجى التأكد من توفر الخدمة عند تقديم طلبك قبل 48 ساعة على الأقل من الإقلاع.",
      },
    ],
    more: {
      title: "اكتشف المزيد",
      items: [
        {
          id: "extraBaggage",
          title: "أضف أمتعة إضافية لرحلتك",
          description:
            "راجع قائمة المواد المقيدة والمحظورة لتبقى آمنًا وملتزمًا بأنظمة الطيران الدولية.",
          buttonLabel: "أضف أمتعة",
          imageAlt: "حقائب سفر كحلية مكدسة فوق بعضها",
        },
        {
          id: "onboard",
          title: "اكتشف تجربتك على متن الطائرة",
          description:
            "راجع قائمة المواد المقيدة والمحظورة لتبقى آمنًا وملتزمًا بأنظمة الطيران الدولية.",
          buttonLabel: "استكشف التجربة على متن الطائرة",
          imageAlt: "مسافرة صغيرة تستمتع بشاشة الترفيه أثناء الرحلة",
        },
      ],
    },
  },
};

const MORE_ROWS = {
  extraBaggage: {
    href: "/travel-experience/before-you-fly/allowed-baggage",
    image: "extra-baggage.webp",
  },
  onboard: { href: "/travel-experience/onboard", image: "onboard.webp" },
};

const STEP_IDS = ["submit", "report", "confirmation"];

function loadDemoLocale(lang) {
  const path = resolve(
    process.cwd(),
    `../flychamadmin/src/cms2/i18n/locales/${lang}.json`
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const steps = loadDemoLocale(lang).serviceSteps;
  const crumbHrefs = ["/", "/travel-experience", "/travel-experience/before-you-fly", ""];

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
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "seat-journey",
      style: INTRO_STYLE,
      content: {
        title: copy.intro.title,
        description: copy.intro.description,
        imageUrl: `${MEDIA}/request.webp`,
        imageAlt: copy.intro.imageAlt,
        buttonLabel: copy.intro.buttonLabel,
        buttonHref: "/help/contact-us/forms/request-a-form?form=oxygenService",
        buttonIcon: "ArrowRight",
        links: [],
      },
    },
    {
      type: "service-steps",
      style: STEPS_STYLE,
      content: {
        title: steps.title,
        description: "",
        imageUrl: `${MEDIA}/medical-report.webp`,
        imageAlt: steps.imageAlt,
        steps: STEP_IDS.map((id) => ({
          id,
          icon: "",
          title: steps.steps[id].title,
          description: steps.steps[id].description,
        })),
        buttonLabel: steps.buttonLabel,
        buttonHref: "/help/contact-us",
        buttonIcon: "ArrowRight",
        links: [],
      },
    },
    {
      type: "faqs",
      style: FAQS_STYLE,
      content: {
        title: copy.faqs.title,
        browseLabel: copy.faqs.browseLabel,
        browseHref: "/help/faqs",
        items: copy.faqs.items,
        links: [],
      },
    },
    {
      type: "info-accordion",
      style: TERMS_STYLE,
      content: {
        items: copy.terms.map((item) => ({ ...item, defaultOpen: true })),
        links: [],
      },
    },
    {
      type: "baggage-resource-cards",
      style: RESOURCE_STYLE,
      content: {
        title: copy.more.title,
        description: "",
        items: copy.more.items.map((item) => ({
          id: item.id,
          imageUrl: `${MEDIA}/${MORE_ROWS[item.id].image}`,
          imageAlt: item.imageAlt,
          title: item.title,
          description: item.description,
          buttonLabel: item.buttonLabel,
          href: MORE_ROWS[item.id].href,
          buttonIcon: "ArrowRight",
        })),
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
  // Send bodies from a UTF-8 file: passing JSON as a CLI arg goes through the
  // Windows ANSI codepage and turns Arabic into "????".
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
  try {
    stdout = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 20_000_000 });
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
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

for (const lang of ["en", "ar"]) {
  const links = curl("GET", "/rest/v1/page_components", {
    token,
    query: `page_id=eq.${pageId}&lang=eq.${lang}&select=id,position,component_id,components(id,type)`,
  });
  if (!Array.isArray(links)) {
    console.error(`page_components lookup failed (${lang}):`, restError(links, "unknown error"));
    process.exit(1);
  }

  if (links.length > 0 && process.argv.includes("--repair")) {
    const blocks = buildBlocks(lang);
    for (const row of links) {
      const block = blocks[row.position];
      if (!block) continue;
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

  if (links.length > 0) {
    const order = links
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((row) => `${row.position}:${componentTypeOf(row)}`)
      .join(" → ");
    console.log(`kept ${lang} (${links.length} blocks):`, order);
    continue;
  }

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
      console.error(
        `components insert failed (${lang} ${block.type}):`,
        restError(inserted, "unknown error")
      );
      process.exit(1);
    }
    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: { page_id: pageId, component_id: comp.id, position, lang },
    });
    if (link?.message) {
      console.error(
        `page_components insert failed (${lang} ${block.type}):`,
        restError(link, "unknown error")
      );
      process.exit(1);
    }
    console.log(`seeded ${block.type} block (${lang}) @${position}:`, comp.id);
  }
}

console.log("Done. Open /en/travel-experience/before-you-fly/oxygen-service");
