/**
 * One-off admin task for the Allowed Baggage dynamic page (Figma 40239:32515):
 *   1. Register the baggage-* component types (+ ensure the reused ones exist).
 *   2. Upload the Figma photos to cms-media/allowed-baggage/*.webp.
 *   3. Ensure the "allowed-baggage" page row exists.
 *   4. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs
 *        1 page-media-hero
 *        2 seat-journey            ("Everything You Need to Know Before You Pack")
 *        3 baggage-allowance       (NEW — the Baggage guide cards)
 *        4 cta-banner              ("Prohibited & Dangerous Items", arrow icon)
 *        5 faqs
 *        6 info-accordion          (Baggage Terms and Conditions / Fees)
 *        7 baggage-resource-cards  (NEW — "Everything You Need for Your Baggage")
 *
 * Copy for the two new blocks comes from cms2's demo i18n (baggageAllowance /
 * baggageResourceCards); the rest is the Figma copy below.
 *
 * Frontend URL: /travel-experience/before-you-fly/allowed-baggage
 * CMS slug:     allowed-baggage
 *
 *   node scripts/apply-allowed-baggage-page.mjs
 *   node scripts/apply-allowed-baggage-page.mjs --repair   # re-write seeded
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

const PAGE_SLUG = "allowed-baggage";
const FOLDER = "allowed-baggage";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), `../new_fly_cham/src/assets/images-webp/${FOLDER}`);
const UPLOADS = [
  "hero.webp",
  "pack.webp",
  "prohibited.webp",
  "extra-baggage.webp",
  "prohibited-calculator.webp",
  "cargo-shipping.webp",
];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "seat-journey", label: "Seat Journey" },
  { id: "baggage-allowance", label: "Baggage Allowance" },
  { id: "cta-banner", label: "CTA Banner" },
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

// Text left / 621×375 photo right, 16px radius.
const INTRO_STYLE = {
  ...LAYOUT,
  imageSide: "right",
  imageRadius: "2xl",
  ...text("titleColor", "700", "semibold"),
  ...text("bodyColor", "700", "normal"),
  ...BACKLINKS,
};

const ALLOWANCE_STYLE = {
  ...LAYOUT,
  showHeader: true,
  showDescription: true,
  columns: "3",
  cardGap: "default",
  cardRadius: "lg",
  ...text("titleColor", "700", "semibold"),
  ...text("descriptionColor", "700", "normal"),
  cardBg: "background",
  cardHeaderBg: "background",
  headerBorderColor: "100",
  dividerColor: "100",
  showDivider: true,
  ...text("cardTitleColor", "700", "semibold"),
  ...text("labelColor", "700", "medium"),
  ...text("valueColor", "primary-1", "bold"),
  iconColor: "primary-1",
  ...text("cardDescriptionColor", "700", "normal"),
  ...BACKLINKS,
};

// Figma banner: 360px, 12px radius, #01263B wash, gold CTA + arrow.
const BANNER_STYLE = {
  ...LAYOUT,
  showTitle: true,
  showDescription: true,
  showButton: true,
  showButtonIcon: true,
  showHeroImage: true,
  showOverlay: true,
  overlayColor: "secondary-2",
  bannerHeight: "medium",
  bannerRadius: "sm",
  titleAlign: "left",
  verticalAlign: "center",
  ...text("titleColor", "50", "semibold"),
  ...text("descriptionColor", "50", "normal"),
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
  ...text("questionColor", "main-dark", "medium"),
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

const RESOURCE_STYLE = {
  ...LAYOUT,
  showHeader: true,
  showDescription: true,
  columns: "3",
  cardGap: "default",
  cardRadius: "lg",
  imageHeight: "default",
  ...text("titleColor", "foreground", "semibold"),
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
    crumbs: ["Home", "Travel experience", "Before You Fly", "Allowed Baggage"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Allowed Baggage",
      subtitle: "We have designed baggage guidelines for your comfort and safety",
      imageAlt: "Vintage suitcases stacked on an airport luggage trolley",
    },
    intro: {
      title: "Everything You Need to Know Before You Pack",
      description:
        "Before you fly with Fly Cham, take a moment to check what you can pack and which items may be restricted or prohibited. Taking into account that we are committed to following international aviation safety standards to help ensure a safe, smooth journey for every passenger.",
      imageAlt: "Blue suitcases ready for the journey",
    },
    banner: {
      title: "Prohibited & Dangerous Items",
      description:
        "Learn about items that are restricted or not allowed on board to ensure a safe and smooth journey for all passengers.",
      buttonLabel: "Learn more",
      imageAlt: "Dangerous items sign at airport security",
    },
    faqs: {
      title: "Frequently Asked Questions",
      browseLabel: "Browse Baggage FAQs",
      items: [
        {
          question: "What is the maximum weight for checked baggage?",
          answer:
            "Your checked baggage allowance depends on your travel class: up to 40 kg in Business Class, 30 kg in Economy Class and 10 kg on domestic flights. Please check your ticket for your exact allowance.",
        },
        {
          question: "Can I bring a musical instrument on board?",
          answer:
            "Small musical instruments can be carried in the cabin if they fit in the overhead bin or under the seat in front of you. Larger instruments must be checked in or may need an extra seat, so please contact us before your flight.",
        },
        {
          question: "What items are prohibited in carry-on luggage?",
          answer:
            "Sharp objects, flammable materials, explosives and liquids over 100 ml are not allowed in cabin baggage. Check the prohibited and dangerous items list before you pack.",
        },
        {
          question: "How do I add extra baggage to my booking?",
          answer:
            "You can add extra baggage through Manage Booking, at any Fly Cham sales office or at the airport check-in desk. Extra baggage fees apply.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "Baggage Terms and Conditions",
        body:
          "Baggage allowances vary by travel class and fare type. Carry-on baggage must fit in the overhead bin or under the seat in front of you. Checked baggage is subject to size and weight limits, and oversized items may require special handling.\n\nPlease check your ticket or contact our sales offices for the most up-to-date baggage information before your flight.",
      },
      {
        id: "fees",
        title: "Baggage Fees",
        body:
          "Are there fees for overweight baggage? Yes, bags exceeding the standard weight limit may incur an extra baggage fee. Please check your fare conditions before checking in.",
      },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "قبل أن تسافر", "الأمتعة المسموح بها"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "الأمتعة المسموح بها",
      subtitle: "صممنا إرشادات الأمتعة من أجل راحتك وسلامتك",
      imageAlt: "حقائب سفر كلاسيكية مكدسة على عربة أمتعة في المطار",
    },
    intro: {
      title: "كل ما تحتاج معرفته قبل حزم أمتعتك",
      description:
        "قبل أن تسافر مع فلاي شام، خصص لحظة للتحقق مما يمكنك حزمه والمواد التي قد تكون مقيدة أو محظورة، علمًا بأننا ملتزمون باتباع معايير سلامة الطيران الدولية للمساعدة في ضمان رحلة آمنة وسلسة لكل مسافر.",
      imageAlt: "حقائب سفر زرقاء جاهزة للرحلة",
    },
    banner: {
      title: "المواد المحظورة والخطرة",
      description:
        "تعرّف على المواد المقيدة أو غير المسموح بها على متن الطائرة لضمان رحلة آمنة وسلسة لجميع المسافرين.",
      buttonLabel: "اعرف المزيد",
      imageAlt: "لافتة المواد الخطرة عند نقطة التفتيش الأمني في المطار",
    },
    faqs: {
      title: "الأسئلة الشائعة",
      browseLabel: "تصفح أسئلة الأمتعة",
      items: [
        {
          question: "ما هو الحد الأقصى لوزن الأمتعة المسجلة؟",
          answer:
            "يعتمد الوزن المسموح به للأمتعة المسجلة على درجة السفر: حتى 40 كغ في درجة رجال الأعمال، و30 كغ في الدرجة السياحية، و10 كغ على الرحلات الداخلية. يرجى مراجعة تذكرتك لمعرفة الوزن المسموح به بدقة.",
        },
        {
          question: "هل يمكنني إحضار آلة موسيقية على متن الطائرة؟",
          answer:
            "يمكن حمل الآلات الموسيقية الصغيرة في المقصورة إذا كانت تتسع في الخزانة العلوية أو أسفل المقعد الذي أمامك. أما الآلات الأكبر فيجب تسجيلها أو قد تحتاج إلى مقعد إضافي، لذا يرجى التواصل معنا قبل رحلتك.",
        },
        {
          question: "ما المواد المحظورة في أمتعة اليد؟",
          answer:
            "لا يُسمح بالأدوات الحادة والمواد القابلة للاشتعال والمتفجرات والسوائل التي تزيد عن 100 مل في أمتعة المقصورة. راجع قائمة المواد المحظورة والخطرة قبل حزم أمتعتك.",
        },
        {
          question: "كيف أضيف أمتعة إضافية إلى حجزي؟",
          answer:
            "يمكنك إضافة أمتعة إضافية من خلال إدارة الحجز، أو في أي مكتب مبيعات تابع لفلاي شام، أو عند مكتب تسجيل الوصول في المطار. تُطبق رسوم الأمتعة الإضافية.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "شروط وأحكام الأمتعة",
        body:
          "يختلف الوزن المسموح به للأمتعة حسب درجة السفر ونوع السعر. يجب أن تتسع أمتعة اليد في الخزانة العلوية أو أسفل المقعد الذي أمامك. تخضع الأمتعة المسجلة لحدود الحجم والوزن، وقد تتطلب القطع كبيرة الحجم معاملة خاصة.\n\nيرجى مراجعة تذكرتك أو التواصل مع مكاتب المبيعات لدينا للحصول على أحدث معلومات الأمتعة قبل رحلتك.",
      },
      {
        id: "fees",
        title: "رسوم الأمتعة",
        body:
          "هل توجد رسوم على الأمتعة الزائدة الوزن؟ نعم، قد تُفرض رسوم أمتعة إضافية على الحقائب التي تتجاوز حد الوزن القياسي. يرجى مراجعة شروط السعر قبل تسجيل الوصول.",
      },
    ],
  },
};

const ALLOWANCE_ROWS = [
  { id: "business", checked: "40 kg", cabin: "7 kg" },
  { id: "economy", checked: "30 kg", cabin: "7 kg" },
  { id: "domestic", checked: "10 kg", cabin: "7 kg" },
];
const ALLOWANCE_UNITS = { en: "kg", ar: "كغ" };

const RESOURCE_ROWS = [
  { id: "extraBaggage", href: "/help/contact-us/forms", image: "extra-baggage.webp" },
  { id: "prohibitedCalculator", href: "/help/faqs", image: "prohibited-calculator.webp" },
  { id: "cargoShipping", href: "/cargo", image: "cargo-shipping.webp" },
];

function loadDemoLocale(lang) {
  const path = resolve(
    process.cwd(),
    `../flychamadmin/src/cms2/i18n/locales/${lang}.json`
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
  const demo = loadDemoLocale(lang);
  const allowance = demo.baggageAllowance;
  const resources = demo.baggageResourceCards;
  const unit = (value) => value.replace("kg", ALLOWANCE_UNITS[lang]);
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
        imageUrl: `${MEDIA}/pack.webp`,
        imageAlt: copy.intro.imageAlt,
        links: [],
      },
    },
    {
      type: "baggage-allowance",
      style: ALLOWANCE_STYLE,
      content: {
        title: allowance.title,
        description: allowance.description,
        cards: ALLOWANCE_ROWS.map((row) => ({
          id: row.id,
          title: allowance.cards[row.id].title,
          description: allowance.cards[row.id].description,
          stats: [
            { icon: "SuitcaseRolling", label: allowance.checkedLabel, value: unit(row.checked) },
            { icon: "Backpack", label: allowance.cabinLabel, value: unit(row.cabin) },
          ],
        })),
        links: [],
      },
    },
    {
      type: "cta-banner",
      style: BANNER_STYLE,
      content: {
        title: copy.banner.title,
        description: copy.banner.description,
        buttonLabel: copy.banner.buttonLabel,
        buttonHref: "/help/faqs",
        buttonLinkType: "internal",
        buttonIcon: "ArrowRight",
        imageUrl: `${MEDIA}/prohibited.webp`,
        imageAlt: copy.banner.imageAlt,
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
        title: resources.title,
        description: "",
        items: RESOURCE_ROWS.map((row) => ({
          id: row.id,
          imageUrl: `${MEDIA}/${row.image}`,
          imageAlt: resources.items[row.id].imageAlt,
          title: resources.items[row.id].title,
          description: resources.items[row.id].description,
          buttonLabel: resources.items[row.id].buttonLabel,
          href: row.href,
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
        label: "Allowed Baggage",
        description: "Baggage allowance by class, prohibited items, baggage FAQs and services",
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

console.log("Done. Open /en/travel-experience/before-you-fly/allowed-baggage");
