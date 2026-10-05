/**
 * One-off admin task: make /cham-miles a CMS page built from ONE full-bleed
 * "cham-miles-register" block (new_fly_cham ChamMilesRegister / cms2
 * ChamMilesRegister).
 *
 *   1. Converts new_fly_cham's former bundled artwork
 *      (src/assets/images/cham-miles/background.png + logo.png) to lossless
 *      WebP (logo keeps alpha, both keep their pixel size) and uploads them to
 *      cms-media/cham-miles/{background,logo}.webp — skipped when present.
 *   2. Upserts component_types { id: 'cham-miles-register' }.
 *   3. Ensures page { slug: 'cham-miles', label: 'Cham Miles', status: 'published' }.
 *   4. Seeds ONE block per language (EN + AR) from the chamMiles.* strings in
 *      new_fly_cham's en.json / ar.json, when that language has no blocks.
 *      Style is stored empty so the block keeps its built-in defaults
 *      (= the former static page).
 *
 * Idempotent. Run from cms/:
 *
 *   node scripts/apply-cham-miles-page.mjs [--dry-run]
 *
 * Behind the TLS-inspecting proxy run with
 *   NODE_EXTRA_CA_CERTS="C:\Users\malsaati\AppData\Local\Temp\corp-ca-bundle.pem"
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  const eq = t.indexOf("=");
  if (!t || t.startsWith("#") || eq === -1) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!process.env[k]) process.env[k] = v;
}
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing in cms/.env");
const DRY_RUN = process.argv.includes("--dry-run");

const SLUG = "cham-miles";
const TYPE = "cham-miles-register";
const FOLDER = "cham-miles";
const MEDIA = `${url}/storage/v1/object/public/cms-media`;
const MAX_BYTES = 400 * 1024;

const NEW_FLY_CHAM = resolve(process.cwd(), "../new_fly_cham");
const ASSETS = resolve(NEW_FLY_CHAM, "src/assets/images/cham-miles");
const IMAGES = [
  { name: "background", src: resolve(ASSETS, "background.png") },
  { name: "logo", src: resolve(ASSETS, "logo.png") },
];

const requireFromSite = createRequire(resolve(process.cwd(), "../flychamwebsite/package.json"));
const sharp = requireFromSite("sharp");

const LOCALES = {
  en: JSON.parse(readFileSync(resolve(NEW_FLY_CHAM, "src/i18n/locales/en.json"), "utf8")),
  ar: JSON.parse(readFileSync(resolve(NEW_FLY_CHAM, "src/i18n/locales/ar.json"), "utf8")),
};

/** The flat editor shape (cms2 CHAM_MILES_REGISTER_FIELDS) for one language. */
function buildContent(lang, imageUrls) {
  const cm = LOCALES[lang].chamMiles;
  const f = cm.form;
  const l = cm.login;
  const lines = (obj, keys) => keys.map((k) => obj[k]).join("\n");
  return {
    bgUrl: imageUrls.background,
    bgAlt: "",
    logoUrl: imageUrls.logo,
    logoAlt: cm.logoAlt,
    logoHref: "/",
    headlineBefore: cm.welcome.headlineBefore,
    headlineBrand: cm.welcome.headlineBrand,
    headlineAfter: cm.welcome.headlineAfter,
    description: cm.welcome.description,
    formTitle: f.title,
    formSubtitle: f.subtitle,
    titlePlaceholder: f.titlePlaceholder,
    titleOptions: lines(f.titles, ["mr", "mrs", "ms", "miss"]),
    firstNamePlaceholder: f.firstName,
    lastNamePlaceholder: f.lastName,
    emailPlaceholder: f.email,
    countryCodePlaceholder: f.countryCode,
    countryCodeOptions: lines(f.countryCodes, ["sy", "ae", "sa", "lb", "jo", "eg"]),
    phonePlaceholder: f.phone,
    dobLabel: f.dateOfBirth,
    dayPlaceholder: f.day,
    monthPlaceholder: f.month,
    monthOptions: lines(f.months, Array.from({ length: 12 }, (_, i) => String(i + 1))),
    yearPlaceholder: f.year,
    agreeTermsPrefix: f.agreeTermsPrefix,
    termsLabel: f.terms,
    termsHref: "/legal/terms-and-conditions",
    agreeTermsAnd: f.agreeTermsAnd,
    privacyLabel: f.privacy,
    privacyHref: "/legal/privacy-policy",
    agreeMarketingLabel: f.agreeMarketing,
    continueLabel: f.continue,
    hasAccountText: f.hasAccount,
    loginLinkLabel: f.loginLink,
    loginTitle: l.title,
    loginSubtitle: l.subtitle,
    loginEmailPlaceholder: l.email,
    loginPasswordPlaceholder: l.password,
    showPasswordLabel: l.showPassword,
    hidePasswordLabel: l.hidePassword,
    rememberMeLabel: l.rememberMe,
    forgotLabel: l.forgotPassword,
    forgotHref: "",
    loginSubmitLabel: l.submit,
    noAccountText: l.noAccount,
    createAccountLabel: l.createAccount,
    links: [],
  };
}

// --- Auth + REST helpers ----------------------------------------------------
const auth = await (
  await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@flycham.local", password: "FlyChamAdmin!2026" }),
  })
).json();
if (!auth.access_token) throw new Error(`Sign-in failed: ${JSON.stringify(auth)}`);
const headers = (extra = {}) => ({
  apikey: key,
  Authorization: `Bearer ${auth.access_token}`,
  "Content-Type": "application/json",
  ...extra,
});
async function rest(method, path, body, prefer = "return=representation") {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: headers({ Prefer: prefer }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

// --- 1. Images ----------------------------------------------------------------
const imageUrls = {};
for (const { name, src } of IMAGES) {
  const path = `${FOLDER}/${name}.webp`;
  const publicUrl = `${MEDIA}/${path}`;
  imageUrls[name] = publicUrl;

  const head = await fetch(publicUrl, { method: "HEAD" });
  if (head.ok) {
    console.log(`image ok (exists): ${path}`);
    continue;
  }

  // Lossless keeps the flat geometric art + the logo's alpha pixel-identical;
  // fall back to high-quality lossy only if that ever exceeds the size cap.
  let webp = await sharp(src).webp({ lossless: true, effort: 6 }).toBuffer();
  if (webp.length > MAX_BYTES) {
    webp = await sharp(src).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toBuffer();
  }
  if (webp.length > MAX_BYTES) {
    throw new Error(`${path} is ${webp.length} bytes (> ${MAX_BYTES})`);
  }
  const meta = await sharp(webp).metadata();
  console.log(`image ${path}: ${meta.width}x${meta.height} alpha=${meta.hasAlpha} ${(webp.length / 1024).toFixed(1)} KB`);
  if (DRY_RUN) continue;

  const up = await fetch(`${url}/storage/v1/object/cms-media/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${auth.access_token}`,
      "Content-Type": "image/webp",
      "cache-control": "3600",
      "x-upsert": "true",
    },
    body: webp,
  });
  if (!up.ok) throw new Error(`upload ${path}: ${up.status} ${(await up.text()).slice(0, 200)}`);
  console.log(`  uploaded ${publicUrl}`);
}

// --- 2. Component type --------------------------------------------------------
if (DRY_RUN) {
  console.log(`would upsert component_types ${TYPE}`);
} else {
  await rest(
    "POST",
    "component_types?on_conflict=id",
    { id: TYPE, label: "Cham Miles Register" },
    "resolution=merge-duplicates,return=minimal"
  );
  console.log(`component_types ok: ${TYPE}`);
}

// --- 3. Page --------------------------------------------------------------------
let [page] = await rest("GET", `pages?select=id,label,status&slug=eq.${SLUG}`);
if (!page) {
  if (!DRY_RUN) {
    [page] = await rest("POST", "pages", {
      slug: SLUG,
      label: "Cham Miles",
      description: "Cham Miles loyalty sign-up page",
      status: "published",
    });
  }
  console.log(`page ${SLUG}: ${page ? `created ${page.id}` : "(would create)"}`);
} else {
  if (page.status !== "published" && !DRY_RUN) {
    await rest("PATCH", `pages?id=eq.${page.id}`, { status: "published" }, "return=minimal");
    console.log(`page ${SLUG}: published`);
  }
  console.log(`page ${SLUG}: ${page.id}`);
}

// --- 4. One block per language -------------------------------------------------
for (const lang of ["en", "ar"]) {
  if (page) {
    const existing = await rest(
      "GET",
      `page_components?page_id=eq.${page.id}&lang=eq.${lang}&select=id`
    );
    if (existing.length) {
      console.log(`  skip ${lang}: has ${existing.length} block(s)`);
      continue;
    }
  }
  const content = buildContent(lang, imageUrls);
  if (DRY_RUN) {
    console.log(`  ${lang}: would seed ${TYPE} — "${content.headlineBefore} ${content.headlineBrand} ${content.headlineAfter}"`);
    continue;
  }
  const [comp] = await rest("POST", "components", {
    type: TYPE,
    position: 0,
    style: { [lang]: {} },
    content: { [lang]: content },
  });
  await rest(
    "POST",
    "page_components",
    { page_id: page.id, component_id: comp.id, position: 0, lang },
    "return=minimal"
  );
  console.log(`  seeded ${lang}: ${TYPE} (${comp.id})`);
}

console.log(DRY_RUN ? "Dry run — nothing written." : "Done.");
