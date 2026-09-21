/**
 * One-off admin task for the "travel-experience-cards" block + its demo page:
 *   1. Register the "travel-experience-cards" component type (FK for components.type).
 *   2. Ensure the "travel-experience" page row exists.
 *   3. Seed one travel-experience-cards block per language (EN + AR) with the four
 *      journey cards, if that language has no blocks yet.
 *
 * Idempotent: re-running upserts the type/page and only seeds a language's block
 * when that language has none. Run once against the CMS Supabase project.
 *
 * Usage (from the cms/ directory):
 *   node scripts/apply-travel-experience-cards-page.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

const PAGE_SLUG = "travel-experience";
const TYPE_ID = "travel-experience-cards";

const CARDS_META = [
  { id: "beforeYouFly", tint: "#01263b", href: "/travel-experience/before-you-fly", withLabel: true },
  { id: "atTheAirport", tint: "#504834", href: "/travel-experience/at-the-airport", withLabel: false },
  { id: "onboard", tint: "#006080", href: "/travel-experience/onboard", withLabel: false },
  { id: "afterTravel", tint: "#01263b", href: "/travel-experience/after-travel", withLabel: false },
];

const TEXT = {
  en: {
    title: "What You Need For an Ideal Journey",
    subtitle:
      "Get ready for a unique travel experience from the moment you plan to your arrival, starting with our comprehensive pre-flight services, our unique onboard experience, and additional services for added comfort.",
    learnMore: "Learn More",
    items: {
      beforeYouFly: {
        title: "Before You Fly",
        description:
          "Plan ahead and enjoy a smooth start to your journey. Book services, check flight status, and prepare your documents.",
        imageAlt: "A passenger preparing for travel before the flight",
      },
      atTheAirport: {
        title: "At the Airport",
        description:
          "Make your airport experience smoother with services at the airport, including Business Lounge access, wheelchair support, and VIP boarding.",
        imageAlt: "A traveller with luggage at the airport terminal",
      },
      onboard: {
        title: "Onboard",
        description:
          "Enjoy entertainment, comfort, and warm hospitality onboard for a more pleasant journey. With our selection of onboard services and entertainment options.",
        imageAlt: "A passenger relaxing onboard the aircraft",
      },
      afterTravel: {
        title: "After Travel",
        description:
          "Find the support you may need after your flight, from baggage claims and tracking to refunds or loyalty miles, and feedback or customer support.",
        imageAlt: "A traveller arriving at their destination after the flight",
      },
    },
  },
  ar: {
    title: "ما تحتاجه لرحلة مثالية",
    subtitle:
      "استعد لتجربة سفر فريدة من لحظة التخطيط وحتى وصولك، بدءاً من خدماتنا الشاملة لما قبل السفر، وتجربتنا المميزة على متن الطائرة، والخدمات الإضافية لمزيد من الراحة.",
    learnMore: "اعرف المزيد",
    items: {
      beforeYouFly: {
        title: "قبل السفر",
        description:
          "خطّط مسبقاً واستمتع ببداية سلسة لرحلتك. احجز الخدمات، وتحقّق من حالة الرحلة، وجهّز مستنداتك.",
        imageAlt: "مسافر يستعدّ للسفر قبل الرحلة",
      },
      atTheAirport: {
        title: "في المطار",
        description:
          "اجعل تجربتك في المطار أكثر سلاسة مع الخدمات المتوفرة في المطار، بما في ذلك الدخول إلى صالة رجال الأعمال، ودعم الكراسي المتحركة، وصعود كبار الشخصيات.",
        imageAlt: "مسافر مع أمتعته في صالة المطار",
      },
      onboard: {
        title: "على متن الطائرة",
        description:
          "استمتع بالترفيه والراحة والضيافة الدافئة على متن الطائرة لرحلة أكثر متعة، مع باقة خدماتنا على متن الطائرة وخيارات الترفيه.",
        imageAlt: "مسافر يستريح على متن الطائرة",
      },
      afterTravel: {
        title: "بعد السفر",
        description:
          "اعثر على الدعم الذي قد تحتاجه بعد رحلتك، من استلام الأمتعة وتتبعها إلى الاسترداد أو أميال الولاء، وتقديم الملاحظات أو دعم الزبائن.",
        imageAlt: "مسافر يصل إلى وجهته بعد الرحلة",
      },
    },
  },
};

function buildContent(lang) {
  const text = TEXT[lang];
  return {
    title: text.title,
    subtitle: text.subtitle,
    learnMore: text.learnMore,
    items: CARDS_META.map((card) => ({
      id: card.id,
      imageUrl: "",
      imageAlt: text.items[card.id].imageAlt,
      title: text.items[card.id].title,
      description: text.items[card.id].description,
      href: card.href,
      tint: card.tint,
      withLabel: card.withLabel,
    })),
    links: [],
  };
}

// Full default style (matches DEFAULT_TRAVEL_EXPERIENCE_CARDS_STYLE in cms2).
const STYLE = {
  showHeader: true,
  showSubtitle: true,
  columns: "4",
  cardGap: "default",
  cardRadius: "lg",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  subtitleColor: "700",
  subtitleFontWeight: "normal",
  subtitleColorHover: "700",
  subtitleFontWeightHover: "normal",
  cardTitleColor: "50",
  cardTitleFontWeight: "semibold",
  cardTitleColorHover: "50",
  cardTitleFontWeightHover: "semibold",
  cardDescriptionColor: "50",
  cardDescriptionFontWeight: "normal",
  cardDescriptionColorHover: "50",
  cardDescriptionFontWeightHover: "normal",
  learnMoreColor: "50",
  learnMoreFontWeight: "semibold",
  learnMoreColorHover: "50",
  learnMoreFontWeightHover: "semibold",
  cardBg: "50",
  cardBorderColor: "200",
  arrowBadgeBg: "100",
  arrowColor: "primary-1",
  showLinks: true,
};

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("Target project:", url);

const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
if (authError) {
  console.error("Sign-in failed:", authError.message);
  process.exit(1);
}
console.log("Signed in as", email);

const { error: roleErr } = await supabase.rpc("ensure_first_admin");
if (roleErr) console.warn("ensure_first_admin warning:", roleErr.message);

// 1. Component type
{
  const { error } = await supabase
    .from("component_types")
    .upsert({ id: TYPE_ID, label: "Travel Experience Cards" });
  if (error) {
    console.error("component_types upsert failed:", error.message);
    process.exit(1);
  }
  console.log("component_types ok:", TYPE_ID);
}

// 2. Page row
let pageId;
{
  const { data: existing, error } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", PAGE_SLUG)
    .maybeSingle();
  if (error) {
    console.error("pages lookup failed:", error.message);
    process.exit(1);
  }
  if (existing) {
    pageId = existing.id;
    console.log("page exists:", PAGE_SLUG, pageId);
  } else {
    const { data: inserted, error: insErr } = await supabase
      .from("pages")
      .insert({
        slug: PAGE_SLUG,
        label: "Travel Experience",
        description: "Journey stages for the travel experience page",
        status: "published",
      })
      .select("id")
      .single();
    if (insErr) {
      console.error("pages insert failed:", insErr.message);
      process.exit(1);
    }
    pageId = inserted.id;
    console.log("page created:", PAGE_SLUG, pageId);
  }
}

// 3. Seed one travel-experience-cards block per language when it has none.
for (const lang of ["en", "ar"]) {
  const { data: links, error } = await supabase
    .from("page_components")
    .select("id")
    .eq("page_id", pageId)
    .eq("lang", lang);
  if (error) {
    console.error(`page_components lookup failed (${lang}):`, error.message);
    process.exit(1);
  }
  if (links && links.length) {
    console.log(`page already has ${links.length} ${lang} block(s) — skipping seed.`);
    continue;
  }
  const { data: comp, error: compErr } = await supabase
    .from("components")
    .insert({
      type: TYPE_ID,
      position: 0,
      style: { [lang]: STYLE },
      content: { [lang]: buildContent(lang) },
    })
    .select("id")
    .single();
  if (compErr) {
    console.error(`components insert failed (${lang}):`, compErr.message);
    process.exit(1);
  }
  const { error: linkErr } = await supabase
    .from("page_components")
    .insert({ page_id: pageId, component_id: comp.id, position: 0, lang });
  if (linkErr) {
    console.error(`page_components insert failed (${lang}):`, linkErr.message);
    process.exit(1);
  }
  console.log(`seeded travel-experience-cards block (${lang}):`, comp.id);
}

await supabase.auth.signOut();
console.log("Done.");
