/**
 * Seeds the transportation-service page from Figma 40473:22912.
 * URL: /travel-experience/before-you-fly/transportation-service
 *
 * Blocks: breadcrumbs, page-media-hero, seat-journey, service-benefits,
 * faqs, info-accordion, baggage-resource-cards.
 *
 *   node scripts/apply-transportation-service-page.mjs
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
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "transportation-service";
const FOLDER = "transportation-service";
const MEDIA = `${url}/storage/v1/object/public/cms-media/${FOLDER}`;
const ASSETS = resolve(process.cwd(), "../new_fly_cham/src/assets/images/transportation-service");
const PAGE_HREF = "/travel-experience/before-you-fly/transportation-service";
const UPLOADS = ["hero.png", "booking.png", "benefits.png", "toys.png", "onboard.png"];

const COMPONENT_TYPES = [
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "page-media-hero", label: "Page Media Hero" },
  { id: "seat-journey", label: "Seat Journey" },
  { id: "service-benefits", label: "Service Benefits" },
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
  contentWidth: "narrow",
  overlayWidth: "default",
  objectPosition: "center",
  sectionBg: "100",
  showTitle: true,
  showSubtitle: true,
  showOverlay: true,
  showButton: false,
  ...text("titleColor", "primary-1", "bold"),
  ...text("subtitleColor", "700", "medium"),
  ...BACKLINKS,
};

const BOOKING_STYLE = {
  ...LAYOUT,
  layout: "default",
  imageSide: "left",
  imageRadius: "2xl-24",
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

const BENEFITS_STYLE = {
  ...LAYOUT,
  showHeader: true,
  columns: "3",
  radius: "lg",
  showOverlay: true,
  overlayColor: "secondary-2",
  ...text("titleColor", "50", "semibold"),
  showIcon: true,
  iconBg: "primary-3",
  iconColor: "secondary-2",
  ...text("itemTitleColor", "50", "semibold"),
  ...text("itemDescriptionColor", "50", "normal"),
  showLink: true,
  showLinkIcon: true,
  ...text("buttonText", "primary-3", "semibold"),
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

const RESOURCE_STYLE = {
  ...LAYOUT,
  showHeader: true,
  showDescription: false,
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
    crumbs: ["Home", "Travel experience", "Before You Fly", "Transportation service"],
    ariaLabel: "Breadcrumb",
    hero: {
      title: "Transportation Service",
      subtitle: "Transfer to and from Damascus Airport",
      imageAlt: "A white car waiting at the airport terminal",
    },
    booking: {
      title: "Seamless Airport Transfers",
      description:
        "No need to worry about arranging airport transportation anymore. Simply request the Ya Marhaba service and enjoy a smooth, comfortable, and stress-free transfer to and from Damascus International Airport. Designed to make your journey easier from the very beginning, this service ensures convenience, reliability, and a seamless travel experience every step of the way.",
      buttonLabel: "Manage booking",
      imageAlt: "A passenger riding in a chauffeur-driven car",
    },
    benefits: {
      title: "Service benefits",
      imageAlt: "A passenger seated in a premium car",
      items: [
        {
          id: "comfort",
          icon: "Armchair",
          title: "Comfort",
          description:
            "Enjoy a smooth and relaxing journey with spacious seating and a stress-free ride from start to finish.",
        },
        {
          id: "luxury",
          icon: "Star",
          title: "Luxury",
          description:
            "Travel in style with premium vehicles and a refined experience designed for your comfort and convenience.",
        },
        {
          id: "prices",
          icon: "Tag",
          title: "Special prices",
          description:
            "Benefit from exclusive rates and great value for your airport transfers and private chauffeur service.",
        },
      ],
    },
    faqs: {
      title: "Frequently Asked Questions",
      browseLabel: "Browse all FAQs",
      items: [
        {
          question: "Who is eligible for the in-flight oxygen service?",
          answer:
            "Passengers who need supplemental oxygen for a medical reason may request the service, subject to medical clearance before departure.",
        },
        {
          question: "What is the oxygen flow rate provided on board?",
          answer:
            "A standard flow rate is available on board. Tell us the rate you need when you submit your request so we can confirm it for your flight.",
        },
        {
          question: "Can I bring my own portable oxygen concentrator (POC)?",
          answer:
            "An approved portable oxygen concentrator may be brought in the cabin when you notify us in advance and it meets aviation safety requirements.",
        },
        {
          question: "Is there an additional charge for the oxygen service?",
          answer: "The oxygen service may carry an additional fee. The charge is confirmed when your request is reviewed.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "Oxygen Service Terms and Conditions",
        body: "Fly Cham reserves the right to reassign the passenger's seat for the oxygen cylinder service in accordance with applicable safety standards and procedures for such cases.",
      },
      {
        id: "availability",
        title: "Service Availability",
        body: "The in-flight oxygen service is available on selected Fly Cham routes. Availability may be subject to aircraft type and route. Please confirm availability when submitting your service request at least 48 hours before departure.",
      },
    ],
    resourcesTitle: "Everything You Need to know",
    resources: [
      {
        id: "toys",
        image: "toys.png",
        title: "Kids toys",
        description:
          "Check the list of restricted and prohibited items to stay safe and compliant with international aviation regulations.",
        buttonLabel: "Discover kids toys",
        href: "/help/faqs",
        imageAlt: "Colorful toys arranged on a table",
      },
      {
        id: "onboard",
        image: "onboard.png",
        title: "Check onboard experience",
        description:
          "Check the list of restricted and prohibited items to stay safe and compliant with international aviation regulations.",
        buttonLabel: "Explore onboard experience",
        href: "/travel-experience/onboard",
        imageAlt: "Passengers seated in the aircraft cabin",
      },
    ],
  },
  ar: {
    crumbs: ["الرئيسية", "تجربة السفر", "قبل السفر", "خدمة النقل"],
    ariaLabel: "مسار التنقل",
    hero: {
      title: "خدمة النقل",
      subtitle: "النقل من وإلى مطار دمشق",
      imageAlt: "سيارة بيضاء بانتظار الركاب عند مبنى المطار",
    },
    booking: {
      title: "نقل سلس من وإلى المطار",
      description:
        "لا داعي للقلق بشأن ترتيب النقل من وإلى المطار بعد الآن. اطلب خدمة يا مرحبا واستمتع بتنقل مريح وهادئ وخالٍ من التوتر من وإلى مطار دمشق الدولي. صُممت هذه الخدمة لتسهيل رحلتك منذ البداية، وتضمن لك الراحة والموثوقية وتجربة سفر سلسة في كل خطوة.",
      buttonLabel: "إدارة الحجز",
      imageAlt: "راكب في سيارة يقودها سائق",
    },
    benefits: {
      title: "مزايا الخدمة",
      imageAlt: "راكب يجلس في سيارة مميزة",
      items: [
        {
          id: "comfort",
          icon: "Armchair",
          title: "الراحة",
          description: "استمتع برحلة هادئة ومريحة مع مقاعد واسعة وتنقل خالٍ من التوتر من البداية حتى النهاية.",
        },
        {
          id: "luxury",
          icon: "Star",
          title: "الفخامة",
          description: "سافر بأناقة مع سيارات مميزة وتجربة راقية صُممت لراحتك وسهولة تنقلك.",
        },
        {
          id: "prices",
          icon: "Tag",
          title: "أسعار خاصة",
          description: "استفد من أسعار حصرية وقيمة مميزة لخدمات النقل من وإلى المطار وخدمة السائق الخاص.",
        },
      ],
    },
    faqs: {
      title: "الأسئلة الشائعة",
      browseLabel: "تصفّح كل الأسئلة",
      items: [
        {
          question: "من المؤهل لخدمة الأكسجين على متن الطائرة؟",
          answer:
            "يمكن للركاب الذين يحتاجون إلى أكسجين إضافي لأسباب طبية طلب الخدمة، بعد الحصول على موافقة طبية قبل المغادرة.",
        },
        {
          question: "ما معدل تدفق الأكسجين المتوفر على متن الطائرة؟",
          answer:
            "يتوفر معدل تدفق قياسي على متن الطائرة. أخبرنا بالمعدل الذي تحتاجه عند تقديم الطلب حتى نؤكده لرحلتك.",
        },
        {
          question: "هل يمكنني إحضار جهاز تركيز الأكسجين المحمول الخاص بي؟",
          answer:
            "يمكن إحضار جهاز تركيز أكسجين محمول معتمد إلى المقصورة عند إبلاغنا مسبقًا واستيفائه متطلبات سلامة الطيران.",
        },
        {
          question: "هل توجد رسوم إضافية على خدمة الأكسجين؟",
          answer: "قد تترتب رسوم إضافية على خدمة الأكسجين. يتم تأكيد الرسوم عند مراجعة طلبك.",
        },
      ],
    },
    terms: [
      {
        id: "terms",
        title: "شروط وأحكام خدمة الأكسجين",
        body: "تحتفظ فلاي شام بالحق في إعادة تعيين مقعد الراكب لخدمة أسطوانة الأكسجين وفقًا لمعايير وإجراءات السلامة المعمول بها في مثل هذه الحالات.",
      },
      {
        id: "availability",
        title: "توفر الخدمة",
        body: "تتوفر خدمة الأكسجين على متن الطائرة على رحلات مختارة من فلاي شام. قد يخضع التوفر لنوع الطائرة والمسار. يرجى تأكيد التوفر عند تقديم طلب الخدمة قبل 48 ساعة على الأقل من المغادرة.",
      },
    ],
    resourcesTitle: "كل ما تحتاج معرفته",
    resources: [
      {
        id: "toys",
        image: "toys.png",
        title: "ألعاب الأطفال",
        description: "راجع قائمة المواد المقيّدة والممنوعة لتبقى آمنًا وملتزمًا بأنظمة الطيران الدولية.",
        buttonLabel: "اكتشف ألعاب الأطفال",
        href: "/help/faqs",
        imageAlt: "ألعاب ملونة مرتبة على طاولة",
      },
      {
        id: "onboard",
        image: "onboard.png",
        title: "تعرّف على تجربة الرحلة",
        description: "راجع قائمة المواد المقيّدة والممنوعة لتبقى آمنًا وملتزمًا بأنظمة الطيران الدولية.",
        buttonLabel: "استكشف تجربة الرحلة",
        href: "/travel-experience/onboard",
        imageAlt: "ركاب جالسون في مقصورة الطائرة",
      },
    ],
  },
};

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
        imageUrl: `${MEDIA}/hero.png`,
        imageAlt: copy.hero.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        slides: [],
        links: [],
      },
    },
    {
      type: "seat-journey",
      style: BOOKING_STYLE,
      content: {
        title: copy.booking.title,
        description: copy.booking.description,
        imageUrl: `${MEDIA}/booking.png`,
        imageAlt: copy.booking.imageAlt,
        buttonLabel: copy.booking.buttonLabel,
        buttonHref: "/",
        buttonIcon: "ArrowRight",
        links: [],
      },
    },
    {
      type: "service-benefits",
      style: BENEFITS_STYLE,
      content: {
        title: copy.benefits.title,
        imageUrl: `${MEDIA}/benefits.png`,
        imageAlt: copy.benefits.imageAlt,
        items: copy.benefits.items.map((item) => ({
          ...item,
          linkLabel: "",
          href: "",
          linkIcon: "ArrowRight",
        })),
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
        title: copy.resourcesTitle,
        description: "",
        items: copy.resources.map((item) => ({
          id: item.id,
          imageUrl: `${MEDIA}/${item.image}`,
          imageAlt: item.imageAlt,
          title: item.title,
          description: item.description,
          buttonLabel: item.buttonLabel,
          href: item.href,
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
    "-sS", "-X", method, `${url}${path}${qs}`,
    "-H", `apikey: ${key}`,
    "-H", `Content-Type: ${contentType || "application/json"}`,
  ];
  if (token) args.push("-H", `Authorization: Bearer ${token}`);
  if (prefer) args.push("-H", `Prefer: ${prefer}`);
  for (const header of headers || []) args.push("-H", header);
  let dir;
  if (file) args.push("--data-binary", `@${file}`);
  else if (body !== undefined) {
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

function retarget(node) {
  if (Array.isArray(node)) {
    node.forEach(retarget);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (node.id === "yaMarhaba" && typeof node.href === "string") node.href = PAGE_HREF;
  Object.values(node).forEach(retarget);
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
    contentType: "image/png",
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
        label: "Transportation Service",
        description: "Ya Marhaba transfers to and from Damascus International Airport",
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

{
  const rows = curl("GET", "/rest/v1/site_header", { token, query: "select=lang,data,version" });
  if (Array.isArray(rows)) {
    for (const row of rows) {
      const before = JSON.stringify(row.data);
      retarget(row.data);
      if (JSON.stringify(row.data) === before) {
        console.log("header already pointed:", row.lang);
        continue;
      }
      const res = curl("PATCH", "/rest/v1/site_header", {
        token,
        query: `lang=eq.${row.lang}`,
        prefer: "return=minimal",
        body: { data: row.data, version: Number(row.version || 1) + 1 },
      });
      if (res?.message) console.error(`header update failed (${row.lang}):`, restError(res, "unknown error"));
      else console.log("header link updated:", row.lang);
    }
  }
}

{
  const pages = curl("GET", "/rest/v1/pages", { token, query: "slug=eq.before-you-fly&select=id" });
  const parentId = Array.isArray(pages) ? pages[0]?.id : null;
  if (parentId) {
    const links = curl("GET", "/rest/v1/page_components", {
      token,
      query: `page_id=eq.${parentId}&select=component_id,components(id,content)`,
    });
    if (Array.isArray(links)) {
      for (const link of links) {
        const component = Array.isArray(link.components) ? link.components[0] : link.components;
        if (!component?.content) continue;
        const before = JSON.stringify(component.content);
        retarget(component.content);
        if (JSON.stringify(component.content) === before) continue;
        const res = curl("PATCH", "/rest/v1/components", {
          token,
          query: `id=eq.${component.id}`,
          prefer: "return=minimal",
          body: { content: component.content },
        });
        if (res?.message) console.error("before-you-fly link update failed:", restError(res, "unknown error"));
        else console.log("before-you-fly transportation link updated:", component.id);
      }
    }
  }
}

console.log("Done. Open /en/travel-experience/before-you-fly/transportation-service");
