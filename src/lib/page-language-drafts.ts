import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPPORTED_LANGUAGES } from "@/lib/cms-languages";

/**
 * Per-language draft for a page.
 *
 * `pages.status` hides a page in every language. A single language can also be
 * kept as a draft (e.g. an Arabic copy that is not translated yet): the page's
 * `description` starts with a `[[draft:ar]]` marker (`[[draft:en-ar]]` for
 * both). The pages table has no column for it, so — like the admin's
 * `[[parent:…]]` / `[[builtin:…]]` markers — it lives in leading
 * `[[key:value]]` markers that the admin (flychamadmin cms2 utils/pageParent.js)
 * reads and writes in the same format.
 *
 * Non-admin callers (the public website) never receive a draft language's
 * blocks; a signed-in CMS admin still sees and edits them.
 */

const MARKER = /^\[\[([a-z]+):([a-z0-9]+(?:-[a-z0-9]+)*)\]\](?:\r?\n)?/;
const MARKER_ORDER = ["builtin", "parent", "draft"];

function readMarkers(description: string | null | undefined) {
  let rest = String(description ?? "");
  const markers = new Map<string, string>();
  let match = rest.match(MARKER);
  while (match) {
    markers.set(match[1] ?? "", match[2] ?? "");
    rest = rest.slice(match[0].length);
    match = rest.match(MARKER);
  }
  return { markers, rest };
}

function writeMarkers(markers: Map<string, string>, rest: string): string | null {
  const keys = [
    ...MARKER_ORDER.filter((key) => markers.has(key)),
    ...[...markers.keys()].filter((key) => !MARKER_ORDER.includes(key)),
  ];
  const prefix = keys.map((key) => `[[${key}:${markers.get(key)}]]`).join("\n");
  if (!prefix) return rest || null;
  return rest ? `${prefix}\n${rest}` : prefix;
}

/** Languages kept as draft on this page, e.g. `["ar"]`. */
export function draftLangsFromDescription(description: string | null | undefined): string[] {
  const value = readMarkers(description).markers.get("draft");
  if (!value) return [];
  const langs = value.split("-");
  return SUPPORTED_LANGUAGES.filter((lang) => langs.includes(lang));
}

/** Description with `lang` added to / removed from the draft marker. */
export function descriptionWithDraftLang(
  description: string | null | undefined,
  lang: string,
  draft: boolean,
): string | null {
  const { markers, rest } = readMarkers(description);
  const current = new Set<string>(draftLangsFromDescription(description));
  if (draft) current.add(lang);
  else current.delete(lang);
  const ordered = SUPPORTED_LANGUAGES.filter((l) => current.has(l));
  if (ordered.length) markers.set("draft", ordered.join("-"));
  else markers.delete("draft");
  return writeMarkers(markers, rest);
}

/**
 * True when the request carries a CMS admin's token (`public.is_admin()`).
 * Anonymous or failed checks count as public.
 */
export async function callerIsAdmin(
  supabase: SupabaseClient,
  request: Request,
): Promise<boolean> {
  if (!request.headers.get("authorization")?.startsWith("Bearer ")) return false;
  try {
    const { data, error } = await supabase.rpc("is_admin");
    return !error && data === true;
  } catch {
    return false;
  }
}
