/**
 * One-off admin task for the "landmark-feature" block + its demo page:
 *   1. Register the "landmark-feature" component type (FK for components.type).
 *   2. Ensure the "things-to-do-in-damascus" page row exists.
 *   3. Seed one landmark-feature block (Umayyad Mosque, EN) on that page.
 *
 * Idempotent: re-running upserts the type/page and only seeds a block when the
 * page has none. Run once against the CMS Supabase project.
 *
 * Usage (from the cms/ directory):
 *   node scripts/apply-landmark-feature-page.mjs
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

const PAGE_SLUG = "things-to-do-in-damascus";
const TYPE_ID = "landmark-feature";

const CONTENT_EN = {
  items: [
    {
      id: "umayyad",
      title: "Umayyad Mosque",
      description:
        "Built by Caliph Al-Walid I in 705 AD, the Umayyad Mosque stands at the heart of Old Damascus. Its layered sacred history, three distinctive minarets, and remarkable gilded mosaics make it one of the city's most significant architectural and spiritual landmarks. The mosque remains a defining symbol of Damascus, where centuries of faith, culture and artistic heritage come together.",
      imageUrl: "",
      imageAlt: "The gilded mosaics and courtyard of the Umayyad Mosque",
      imageFirst: false,
      thumbnails: [],
    },
  ],
  links: [],
};

const STYLE_EN = {
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
    .upsert({ id: TYPE_ID, label: "Landmark Feature" });
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
        label: "Things to Do in Damascus",
        description: "Landmark guide for Damascus",
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

// 3. Seed one landmark-feature block (EN) if the page has none for that lang.
{
  const { data: links, error } = await supabase
    .from("page_components")
    .select("id")
    .eq("page_id", pageId)
    .eq("lang", "en");
  if (error) {
    console.error("page_components lookup failed:", error.message);
    process.exit(1);
  }
  if (links && links.length) {
    console.log("page already has", links.length, "EN block(s) — skipping seed.");
  } else {
    const { data: comp, error: compErr } = await supabase
      .from("components")
      .insert({
        type: TYPE_ID,
        position: 0,
        style: { en: STYLE_EN },
        content: { en: CONTENT_EN },
      })
      .select("id")
      .single();
    if (compErr) {
      console.error("components insert failed:", compErr.message);
      process.exit(1);
    }
    const { error: linkErr } = await supabase
      .from("page_components")
      .insert({ page_id: pageId, component_id: comp.id, position: 0, lang: "en" });
    if (linkErr) {
      console.error("page_components insert failed:", linkErr.message);
      process.exit(1);
    }
    console.log("seeded landmark-feature block:", comp.id);
  }
}

await supabase.auth.signOut();
console.log("Done.");
