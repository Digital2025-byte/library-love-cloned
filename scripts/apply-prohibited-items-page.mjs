/**
 * One-off admin task for the Prohibited Items dynamic page (Figma 40329:11857):
 *   1. Register the new component types (+ ensure the reused ones exist).
 *   2. Upload the Figma photos + item icons to cms-media/prohibited-items/.
 *   3. Ensure the "prohibited-items" page row exists.
 *   4. Seed EN + AR blocks when a language has none:
 *        0 breadcrumbs
 *        1 page-media-hero
 *        2 prohibited-items-grid  (NEW — both cabin and checked baggage, 4 cols)
 *        3 prohibited-items-grid  (NEW — cabin baggage only, 3 cols)
 *        4 instructions-card      (NEW — lithium batteries, image right)
 *        5 instructions-card      (NEW — liquids, image left)
 *        6 faqs
 *        7 info-accordion         (Baggage Terms and Conditions / Fees)
 *
 * Frontend URL: /travel-experience/before-you-fly/prohibited-items
 * CMS slug:     prohibited-items
 *
 *   node scripts/apply-prohibited-items-page.mjs
 *   node scripts/apply-prohibited-items-page.mjs --repair   # re-write seeded
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

const PAGE_SLUG = "prohibited-items";
const FOLDER = "prohibited-items";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), `../new_fly_cham/src/assets/images-webp/${FOLDER}`);

const BOTH_ROWS = [
  { id: "explosives", icon: "explosives.svg", phosphor: "FireSimple" },
  { id: "flammableGas", icon: "flammable-gas.svg", phosphor: "Fire" },
  { id: "toxic", icon: "toxic.svg", phosphor: "Skull" },
  { id: "corrosive", icon: "corrosive.svg", phosphor: "Flask" },
  { id: "sprays", icon: "spray.svg", phosphor: "SprayBottle" },
  { id: "electroshock", icon: "electroshock.svg", phosphor: "Lightning" },
  { id: "lighters", icon: "lighter.svg", phosphor: "Flame" },
  { id: "batteries", icon: "battery.svg", phosphor: "BatteryWarning" },
];
const CABIN_ROWS = [
  { id: "firearms", icon: "firearm.svg", phosphor: "Crosshair" },
  { id: "ammunition", icon: "ammunition.svg", phosphor: "Target" },
  { id: "blades", icon: "knife-scissors.svg", phosphor: "Knife" },
  { id: "tools", icon: "tools.svg", phosphor: "Wrench" },
  { id: "blunt", icon: "blunt.svg", phosphor: "Hammer" },
  { id: "restraints", icon: "handcuffs.svg", phosphor: "LinkSimple" },
];

const UPLOADS = [
  { name: "hero.webp", type: "image/webp" },
  { name: "lithium.webp", type: "image/webp" },
  { name: "liquids.webp", type: "image/webp" },
  ...[...BOTH_ROWS, ...CABIN_ROWS].map((row) => ({
    name: `icons/${row.icon}`,
    type: "image/svg+xml",
  })),
];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "prohibited-items-grid", label: "Prohibited Items Grid" },
  { id: "instructions-card", label: "Instructions Card" },
  { id: "faqs", label: "FAQs" },
  { id: "info-accordion", label: "Info Accordion" },
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

// Figma 40347:12542 — white 12px cards, #5F5F5C icons, 14px medium labels.
const gridStyle = (columns) => ({
  ...LAYOUT,
  showHeader: true,
  showDescription: true,
  columns,
  cardGap: "default",
  cardRadius: "md",
  cardHeight: "default",
  ...text("titleColor", "700", "semibold"),
  ...text("descriptionColor", "600", "normal"),
  cardBg: "background",
  showCardBorder: false,
  cardBorderColor: "200",
  showCardShadow: false,
  showIcon: true,
  iconSize: "auto",
  iconColor: "600",
  iconWeight: "regular",
  ...text("labelColor", "700", "medium"),
  ...BACKLINKS,
});

// Figma 40347:12759 — white 16px card, numbered 14px/27px list, 471×321 photo.
const instructionsStyle = (imageSide) => ({
  ...LAYOUT,
  showHeader: true,
  showDescription: true,
  showImage: true,
  imageSide,
  imageRadius: "md",
  imageHeight: "default",
  listStyle: "decimal",
  listGap: "default",
  ...text("titleColor", "700", "semibold"),
  ...text("descriptionColor", "700", "normal"),
  cardBg: "background",
  cardRadius: "lg",
  showCardShadow: false,
  ...text("listColor", "700", "normal"),
  markerColor: "700",
  showButton: false,
  showButtonIcon: true,
  buttonBg: "primary-1",
  buttonBgHover: "primary-800",
  ...text("buttonText", "50", "semibold"),
  ...BACKLINKS,
});

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

const PAGE_COPY = {
  en: {
    crumbs: ["Home", "Travel experience", "Before You Fly", "Prohibited Items"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Prohibited Items",
      subtitle: "We have designed baggage guidelines for your comfort and safety",
      imageAlt: "Airport security X-ray baggage inspection",
    },
    both: {
      title: "Items prohibited in both cabin and checked baggage",
      items: {
        explosives: "Explosives, fireworks, flares and detonators",
        flammableGas: "Flammable gases, gas refills, liquid oxygen",
        toxic: "Toxic or infectious substances",
        corrosive: "Corrosive substances",
        sprays: "Pepper spray and other incapacitating sprays",
        electroshock: "Electroshock weapons containing dangerous goods",
        lighters: "Lighters, lighter fuel and refills (prohibited in all baggage)",
        batteries: "Damaged, defective or recalled lithium batteries",
      },
    },
    cabin: {
      title: "The following must not be carried in cabin baggage",
      items: {
        firearms: "Firearms , Guns and weapon replicas",
        ammunition: "Ammunition",
        blades: "Knives, blades, scissors and sharp objects",
        tools: "Tools that may cause serious injury",
        blunt: "Blunt instruments (e.g. baseball bats, golf clubs)",
        restraints: "Restraining devices (e.g. handcuffs)",
      },
    },
    lithium: {
      title: "Lithium batteries and power banks instructions",
      imageAlt: "Lithium battery pack with charging cables",
      items: [
        "Power banks are permitted in carry-on baggage only and are prohibited in checked baggage.",
        "Spare lithium batteries must be carried in carry-on baggage only and protected against short circuits.",
        "Electronic devices containing lithium batteries should be carried in carry-on baggage whenever practicable.",
        "Damaged, defective, or recalled lithium batteries/devices are prohibited in both carry-on and checked baggage.",
        "Lithium batteries exceeding 100 Wh and up to 160 Wh require operator approval, while batteries exceeding 160 Wh are not permitted for carriage by passengers.",
      ],
    },
    liquids: {
      title: "Instructions for carrying liquid materials in baggage",
      imageAlt: "Liquids in a transparent bag at airport security screening",
      items: [
        "Liquids, aerosols and gels (LAGs) carried in cabin baggage must be in individual containers with a maximum capacity of 100 ml (3.4 oz) each.",
        "Containers exceeding 100 ml are not permitted in cabin baggage, even if partially filled. Such items should be placed in checked baggage where permitted.",
        "If carrying a liquid with a maximum capacity of 1000 ml, it must be enclosed in a single, resealable, transparent plastic bag and placed in checked baggage, not cabin baggage.",
        "Essential medicines, baby food and special dietary liquids may be exempt from the 100 ml limit but may require separate screening or supporting documentation. Duty-free liquids must remain sealed with proof of purchase and are subject to transit-airport rules.",
      ],
    },
    faqs: {
      title: "Frequently Asked Questions",
      browseLabel: "Browse all FAQs",
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
            "Sharp objects, flammable materials, explosives and liquids over 100 ml are not allowed in cabin baggage. Check the prohibited items lists on this page before you pack.",
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
    crumbs: ["الرئيسية", "تجربة السفر", "قبل أن تسافر", "المواد المحظورة"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "المواد المحظورة",
      subtitle: "صممنا إرشادات الأمتعة من أجل راحتك وسلامتك",
      imageAlt: "فحص الأمتعة بالأشعة السينية في نقطة التفتيش الأمني بالمطار",
    },
    both: {
      title: "المواد المحظورة في أمتعة المقصورة والأمتعة المسجلة",
      items: {
        explosives: "المتفجرات والألعاب النارية والمشاعل والصواعق",
        flammableGas: "الغازات القابلة للاشتعال وعبوات إعادة تعبئة الغاز والأكسجين السائل",
        toxic: "المواد السامة أو المعدية",
        corrosive: "المواد المسببة للتآكل",
        sprays: "رذاذ الفلفل وغيره من البخاخات المُعطِّلة",
        electroshock: "أسلحة الصعق الكهربائي التي تحتوي على مواد خطرة",
        lighters: "الولاعات ووقودها وعبوات إعادة تعبئتها (محظورة في جميع الأمتعة)",
        batteries: "بطاريات الليثيوم التالفة أو المعيبة أو المسحوبة من السوق",
      },
    },
    cabin: {
      title: "يُمنع حمل المواد التالية في أمتعة المقصورة",
      items: {
        firearms: "الأسلحة النارية والمسدسات ومجسمات الأسلحة",
        ammunition: "الذخيرة",
        blades: "السكاكين والشفرات والمقصات والأدوات الحادة",
        tools: "الأدوات التي قد تسبب إصابات خطيرة",
        blunt: "الأدوات الراضّة (مثل مضارب البيسبول وعصي الغولف)",
        restraints: "أدوات التقييد (مثل الأصفاد)",
      },
    },
    lithium: {
      title: "تعليمات بطاريات الليثيوم وبنوك الطاقة",
      imageAlt: "حزمة بطارية ليثيوم مع كابلات الشحن",
      items: [
        "يُسمح بحمل بنوك الطاقة في أمتعة اليد فقط، ويُحظر وضعها في الأمتعة المسجلة.",
        "يجب حمل بطاريات الليثيوم الاحتياطية في أمتعة اليد فقط وحمايتها من الدوائر الكهربائية القصيرة.",
        "يُفضل حمل الأجهزة الإلكترونية التي تحتوي على بطاريات ليثيوم في أمتعة اليد كلما أمكن ذلك.",
        "يُحظر حمل بطاريات أو أجهزة الليثيوم التالفة أو المعيبة أو المسحوبة من السوق في أمتعة اليد والأمتعة المسجلة.",
        "تتطلب بطاريات الليثيوم التي تزيد سعتها عن 100 واط/ساعة وحتى 160 واط/ساعة موافقة شركة الطيران، ولا يُسمح للمسافرين بحمل البطاريات التي تتجاوز سعتها 160 واط/ساعة.",
      ],
    },
    liquids: {
      title: "تعليمات حمل المواد السائلة في الأمتعة",
      imageAlt: "سوائل في كيس شفاف عند نقطة التفتيش الأمني في المطار",
      items: [
        "يجب أن تكون السوائل والبخاخات والمواد الهلامية المحمولة في أمتعة المقصورة في عبوات منفردة لا تتجاوز سعة كل منها 100 مل (3.4 أونصة).",
        "لا يُسمح بالعبوات التي تتجاوز سعتها 100 مل في أمتعة المقصورة حتى لو كانت ممتلئة جزئيًا، ويجب وضعها في الأمتعة المسجلة حيثما يُسمح بذلك.",
        "عند حمل سائل بسعة قصوى تبلغ 1000 مل، يجب وضعه في كيس بلاستيكي شفاف واحد قابل لإعادة الإغلاق ووضعه في الأمتعة المسجلة وليس في أمتعة المقصورة.",
        "قد تُستثنى الأدوية الضرورية وأغذية الأطفال والسوائل الغذائية الخاصة من حد 100 مل، لكنها قد تتطلب فحصًا منفصلًا أو مستندات داعمة. ويجب أن تبقى سوائل السوق الحرة مختومة مع إثبات الشراء، وتخضع لقواعد مطار العبور.",
      ],
    },
    faqs: {
      title: "الأسئلة الشائعة",
      browseLabel: "تصفح جميع الأسئلة الشائعة",
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
            "لا يُسمح بالأدوات الحادة والمواد القابلة للاشتعال والمتفجرات والسوائل التي تزيد عن 100 مل في أمتعة المقصورة. راجع قوائم المواد المحظورة في هذه الصفحة قبل حزم أمتعتك.",
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

function gridItems(rows, labels) {
  return rows.map((row) => ({
    id: row.id,
    iconSource: "image",
    iconUrl: `${MEDIA}/icons/${row.icon}`,
    iconAlt: "",
    icon: row.phosphor,
    label: labels[row.id],
    href: "",
  }));
}

function instructions(copy, image, imageSide) {
  return {
    type: "instructions-card",
    style: instructionsStyle(imageSide),
    content: {
      title: copy.title,
      description: "",
      items: copy.items.map((text, index) => ({ id: `item-${index + 1}`, text })),
      imageUrl: `${MEDIA}/${image}`,
      imageAlt: copy.imageAlt,
      buttonLabel: "",
      buttonHref: "",
      buttonIcon: "ArrowRight",
      links: [],
    },
  };
}

function buildBlocks(lang) {
  const copy = PAGE_COPY[lang];
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
      type: "prohibited-items-grid",
      style: gridStyle("4"),
      content: {
        title: copy.both.title,
        description: "",
        items: gridItems(BOTH_ROWS, copy.both.items),
        links: [],
      },
    },
    {
      type: "prohibited-items-grid",
      style: gridStyle("3"),
      content: {
        title: copy.cabin.title,
        description: "",
        items: gridItems(CABIN_ROWS, copy.cabin.items),
        links: [],
      },
    },
    instructions(copy.lithium, "lithium.webp", "right"),
    instructions(copy.liquids, "liquids.webp", "left"),
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

for (const { name, type } of UPLOADS) {
  const res = curl("POST", `/storage/v1/object/cms-media/${FOLDER}/${name}`, {
    token,
    file: resolve(ASSETS, name),
    contentType: type,
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
        label: "Prohibited Items",
        description: "Items prohibited in cabin and checked baggage, lithium battery and liquids rules, baggage FAQs",
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

console.log("Done. Open /en/travel-experience/before-you-fly/prohibited-items");
