/**
 * One-off admin task for the "seat-journey" block + its demo page:
 *   1. Register the "seat-journey" component type (FK for components.type).
 *   2. Ensure the "seat-selection" page row exists.
 *   3. Seed one seat-journey block per language (EN + AR), if that language has
 *      no blocks yet.
 *
 * Idempotent: re-running upserts the type/page and only seeds a language's block
 * when that language has none. Run once against the CMS Supabase project.
 *
 *   node scripts/apply-seat-journey-page.mjs
 *
 * NOTE: behind a TLS-inspecting proxy the Supabase JS client fails with
 * "fetch failed" — use the curl auth+REST recipe in the cms2 docs instead.
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

const PAGE_SLUG = "seat-selection";
const TYPE_ID = "seat-journey";
const IMG =
  "https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/seat-selection/journey.jpg";

const TEXT = {
  en: {
    title: "Your Journey Begins Here",
    description:
      "With seat selection, choose your ideal seating position for a comfortable and enjoyable flight. Whether you prefer a window seat for great views or a seat near the exit for easy movement, the choice is yours.",
    imageAlt: "Passenger enjoying the flight by the window",
  },
  ar: {
    title: "رحلتك تبدأ من هنا",
    description:
      "مع خدمة اختيار المقعد، اختر موضع جلوسك المثالي لرحلة مريحة وممتعة. سواء كنت تفضّل مقعدًا بجانب النافذة للاستمتاع بالإطلالة أو مقعدًا قرب المخرج لسهولة الحركة، فالخيار لك.",
    imageAlt: "مسافرة تستمتع بالرحلة بجانب النافذة",
  },
};

function buildContent(lang) {
  const t = TEXT[lang];
  return {
    title: t.title,
    description: t.description,
    imageUrl: IMG,
    imageAlt: t.imageAlt,
    links: [],
  };
}

const STYLE = {
  imageSide: "right",
  imageRadius: "3xl",
  sectionPadding: "default",
  showSectionBg: false,
  sectionBg: "100",
  titleColor: "700",
  titleFontWeight: "semibold",
  titleColorHover: "700",
  titleFontWeightHover: "semibold",
  bodyColor: "700",
  bodyFontWeight: "normal",
  bodyColorHover: "700",
  bodyFontWeightHover: "normal",
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

{
  const { error } = await supabase
    .from("component_types")
    .upsert({ id: TYPE_ID, label: "Seat Journey" });
  if (error) {
    console.error("component_types upsert failed:", error.message);
    process.exit(1);
  }
  console.log("component_types ok:", TYPE_ID);
}

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
        label: "Seat Selection",
        description: "Seat selection page",
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
  console.log(`seeded seat-journey block (${lang}):`, comp.id);
}

await supabase.auth.signOut();
console.log("Done.");
