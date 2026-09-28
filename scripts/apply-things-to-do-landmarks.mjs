/**
 * Seed / refresh Landmark Feature on the things-to-do-in-damascus CMS page so
 * it matches the static page (Old City, Souq, Umayyad — alternating sides).
 *
 *   node scripts/apply-things-to-do-landmarks.mjs
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

const PAGE_SLUG = "things-to-do-in-damascus";
const TYPE_ID = "landmark-feature";

const STYLE = {
  showSectionBg: true,
  sectionBg: "50",
  sectionPadding: "default",
  imageRadius: "lg",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  bodyColor: "700",
  bodyFontWeight: "normal",
  bodyColorHover: "700",
  bodyFontWeightHover: "normal",
  showCarousel: true,
  carouselBg: "50",
  arrowBg: "secondary-900",
  arrowColor: "50",
  activeBorderColor: "primary-2",
  showLinks: true,
};

const LANDMARKS = {
  en: [
    {
      id: "oldCity",
      imageFirst: false,
      title: "Old City of Damascus",
      description:
        "Built in the 18th century by As'ad Pasha al-Azm, it showcases elegant courtyards, intricate stonework, and stunning interior details. Today, the palace hosts a museum with displays of traditional clothing, furniture, and artifacts, offering a fascinating insight into the city's history and culture.",
      imageUrl: "",
      imageAlt: "A traditional courtyard house in the Old City of Damascus",
      thumbnails: [],
    },
    {
      id: "souq",
      imageFirst: true,
      title: "Souq Al-Hamidiyah",
      description:
        "Step into Souq Al-Hamidiyah, one of the oldest covered markets in the world and one of Damascus's most iconic landmarks. Located in the heart of the Old City, it brings together traditional shopping, local crafts, spices, perfumes and historic character in one vibrant passage. Surrounded by major landmarks such as the Umayyad Mosque, Damascus Citadel and nearby heritage souqs, it offers a rich introduction to the culture and everyday life of Damascus.",
      imageUrl: "",
      imageAlt: "Shoppers walking through the covered Souq Al-Hamidiyah",
      thumbnails: [],
    },
    {
      id: "umayyad",
      imageFirst: false,
      title: "Umayyad Mosque",
      description:
        "Built by Caliph Al-Walid I in 705 AD, the Umayyad Mosque stands at the heart of Old Damascus. Its layered sacred history, three distinctive minarets, and remarkable gilded mosaics make it one of the city's most significant architectural and spiritual landmarks. The mosque remains a defining symbol of Damascus, where centuries of faith, culture and artistic heritage come together.",
      imageUrl: "",
      imageAlt: "The gilded mosaics and courtyard of the Umayyad Mosque",
      thumbnails: [],
    },
  ],
  ar: [
    {
      id: "oldCity",
      imageFirst: false,
      title: "مدينة دمشق القديمة",
      description:
        "بُني في القرن الثامن عشر على يد أسعد باشا العظم، ويتميّز بأفنيته الأنيقة ونقوشه الحجرية الدقيقة وتفاصيله الداخلية الآسرة. ويضم القصر اليوم متحفاً يعرض الأزياء التقليدية والأثاث والمقتنيات، ويمنح الزائر لمحة رائعة عن تاريخ المدينة وثقافتها.",
      imageUrl: "",
      imageAlt: "بيت دمشقي تقليدي بفناء في مدينة دمشق القديمة",
      thumbnails: [],
    },
    {
      id: "souq",
      imageFirst: true,
      title: "سوق الحميدية",
      description:
        "ادخل إلى سوق الحميدية، أحد أقدم الأسواق المسقوفة في العالم وأحد أبرز معالم دمشق. يقع في قلب المدينة القديمة، ويجمع بين التسوق التقليدي والحرف المحلية والبهارات والعطور والطابع التاريخي في ممرّ واحد نابض بالحياة. وتحيط به معالم كبرى كالجامع الأموي وقلعة دمشق والأسواق التراثية المجاورة، ليقدّم مدخلاً غنياً إلى ثقافة دمشق وحياتها اليومية.",
      imageUrl: "",
      imageAlt: "متسوقون يسيرون في سوق الحميدية المسقوف",
      thumbnails: [],
    },
    {
      id: "umayyad",
      imageFirst: false,
      title: "الجامع الأموي",
      description:
        "بناه الخليفة الوليد بن عبد الملك عام 705 ميلادي، ويقع الجامع الأموي في قلب دمشق القديمة. يجعله تاريخه الديني العريق ومآذنه الثلاث المميزة وفسيفساؤه المذهّبة الرائعة من أبرز المعالم المعمارية والروحية في المدينة. ولا يزال الجامع رمزاً خالداً لدمشق، حيث تجتمع قرون من الإيمان والثقافة والإرث الفني.",
      imageUrl: "",
      imageAlt: "الفسيفساء المذهّبة وصحن الجامع الأموي",
      thumbnails: [],
    },
  ],
};

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
  const stdout = execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 10_000_000,
  });
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

const typeUpsert = curl("POST", "/rest/v1/component_types", {
  token,
  query: "on_conflict=id",
  prefer: "resolution=merge-duplicates,return=minimal",
  body: { id: TYPE_ID, label: "Landmark Feature" },
});
if (typeUpsert?.message) {
  console.error("component_types upsert failed:", restError(typeUpsert, "unknown"));
  process.exit(1);
}
console.log("component_types ok:", TYPE_ID);

let pages = curl("GET", "/rest/v1/pages", {
  token,
  query: `slug=eq.${PAGE_SLUG}&select=id`,
});
if (!Array.isArray(pages)) {
  console.error("pages lookup failed:", restError(pages, "unknown"));
  process.exit(1);
}

let pageId = pages[0]?.id;
if (!pageId) {
  const inserted = curl("POST", "/rest/v1/pages", {
    token,
    prefer: "return=representation",
    body: {
      slug: PAGE_SLUG,
      label: "Things to Do in Damascus",
      description: "Landmark guide for Damascus",
      status: "published",
    },
  });
  const row = Array.isArray(inserted) ? inserted[0] : inserted;
  if (!row?.id) {
    console.error("pages insert failed:", restError(inserted, "unknown"));
    process.exit(1);
  }
  pageId = row.id;
  console.log("page created:", pageId);
} else {
  console.log("page exists:", pageId);
}

const links = curl("GET", "/rest/v1/page_components", {
  token,
  query: `page_id=eq.${pageId}&select=component_id,position,lang`,
});
if (!Array.isArray(links)) {
  console.error("page_components lookup failed:", restError(links, "unknown"));
  process.exit(1);
}

const componentIds = [
  ...new Set(links.map((row) => row.component_id).filter(Boolean)),
];
let landmarkId = null;
if (componentIds.length) {
  const idFilter = componentIds.map((id) => `"${id}"`).join(",");
  const comps = curl("GET", "/rest/v1/components", {
    token,
    query: `id=in.(${idFilter})&select=id,type`,
  });
  if (Array.isArray(comps)) {
    landmarkId = comps.find((row) => row.type === TYPE_ID)?.id || null;
  }
}

const content = {
  en: { items: LANDMARKS.en, links: [] },
  ar: { items: LANDMARKS.ar, links: [] },
};
const style = { en: STYLE, ar: STYLE };

if (landmarkId) {
  const patched = curl("PATCH", `/rest/v1/components?id=eq.${landmarkId}`, {
    token,
    prefer: "return=minimal",
    body: { content, style },
  });
  if (patched?.message) {
    console.error("patch failed:", restError(patched, "unknown"));
    process.exit(1);
  }
  console.log("updated landmark-feature:", landmarkId);
} else {
  // One component row PER LANGUAGE. Linking a single row to both languages
  // is legal ((page, component, lang) is what's unique) but wrong: the two
  // locales are meant to be independent sets, and a shared link used to break
  // delete/update, which read the link with .maybeSingle().
  for (const lang of ["en", "ar"]) {
    const created = curl("POST", "/rest/v1/components", {
      token,
      prefer: "return=representation",
      body: { type: TYPE_ID, position: 0, content, style },
    });
    const row = Array.isArray(created) ? created[0] : created;
    if (!row?.id) {
      console.error(
        `components insert failed (${lang}):`,
        restError(created, "unknown"),
      );
      process.exit(1);
    }
    if (!landmarkId) landmarkId = row.id;

    const link = curl("POST", "/rest/v1/page_components", {
      token,
      prefer: "return=minimal",
      body: {
        page_id: pageId,
        component_id: row.id,
        position: 0,
        lang,
      },
    });
    if (link?.message) {
      console.error(`page_components insert failed (${lang}):`, restError(link, "unknown"));
      process.exit(1);
    }
    console.log(`created + linked landmark-feature (${lang}):`, row.id);
  }
}

console.log("Done — 3 landmarks (oldCity, souq, umayyad).");
