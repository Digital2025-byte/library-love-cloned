/**
 * One-off admin task: register the "contact-channels" component type so that
 * components of this type can be created (components.type has a FK to
 * component_types.id). Run once against the CMS Supabase project.
 *
 * Usage (from the cms/ directory):
 *   node scripts/apply-contact-channels-type.mjs
 *
 * If your network uses a TLS-inspecting proxy and Node reports
 * "self-signed certificate in certificate chain", point Node at your trusted
 * root store first, e.g. on Windows:
 *   set NODE_EXTRA_CA_CERTS=%TEMP%\corp-ca-bundle.pem
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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Local CMS admin service account (same one created by create-cms-admin.mjs).
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

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

// Grant admin role if this is the first login (idempotent).
const { error: roleErr } = await supabase.rpc("ensure_first_admin");
if (roleErr) console.warn("ensure_first_admin warning:", roleErr.message);

const { error: upsertError } = await supabase
  .from("component_types")
  .upsert({ id: "contact-channels", label: "Contact Channels" });
if (upsertError) {
  console.error("Upsert failed:", upsertError.message);
  process.exit(1);
}

const { data: row, error: selError } = await supabase
  .from("component_types")
  .select("id, label")
  .eq("id", "contact-channels")
  .maybeSingle();
if (selError) {
  console.error("Verify failed:", selError.message);
  process.exit(1);
}

console.log("Done. component_types row:", row);
await supabase.auth.signOut();
