/**
 * Language helpers for the public CMS API.
 *
 * Component `content` is stored as a per-language JSONB map, e.g.
 * `{ en: {...}, ar: {...} }` (`style` is shared across languages). These helpers
 * let the read endpoints accept a `?lang=` query param and resolve a single
 * locale for consumers that only render one language, while still returning the
 * full map so editors can load and save every locale in one round trip.
 */

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
const RTL_LANGUAGES = new Set<SupportedLanguage>(["ar"]);

/**
 * Normalize a raw `?lang=` value to a supported language, or `null` when it is
 * absent / unrecognized (callers then fall back to returning the full map).
 */
export function normalizeLang(value: unknown): SupportedLanguage | null {
  if (typeof value !== "string") return null;
  const lang = value.trim().toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
    ? (lang as SupportedLanguage)
    : null;
}

/** Text direction for a language ("rtl" for Arabic, otherwise "ltr"). */
export function dirFor(lang: SupportedLanguage | null): "rtl" | "ltr" {
  return lang && RTL_LANGUAGES.has(lang) ? "rtl" : "ltr";
}

/**
 * The stored object for one language out of a per-language `content` map, or
 * `null` when that language is not authored. No cross-language fallback — an
 * unauthored locale returns `null` so an editor can tell it apart from real
 * content and seed it instead of showing another language's text.
 */
export function pickLanguage(
  content: unknown,
  lang: SupportedLanguage,
): Record<string, unknown> | null {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return null;
  }
  const value = (content as Record<string, unknown>)[lang];
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * True when `value` looks like a per-language map (`{ en: {...}, ar: {...} }`)
 * rather than a flat object of fields. A per-language map has at least one key
 * and every key is a supported language. Used to tell a new per-language
 * `style` apart from a legacy flat `style`.
 */
export function isLanguageMap(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  return (
    keys.length > 0 &&
    keys.every((k) => (SUPPORTED_LANGUAGES as readonly string[]).includes(k))
  );
}

/**
 * Resolve one language's `style` object.
 *   - per-language map → `style[lang]` (fallback to default language, then {}),
 *   - legacy flat style → returned as-is (it applies to every language).
 */
export function styleForLang(
  style: unknown,
  lang: SupportedLanguage,
): Record<string, unknown> {
  if (!isPlainObject(style)) return {};
  if (isLanguageMap(style)) {
    const picked = style[lang] ?? style[DEFAULT_LANGUAGE];
    return isPlainObject(picked) ? picked : {};
  }
  return style; // flat legacy style shared across languages
}

/**
 * Merge an incoming per-language `style` over what is stored, keeping languages
 * the client did not send. A legacy flat style is first seeded onto every
 * language so the first per-language edit does not lose the shared look.
 */
export function mergeStyleMaps(
  existing: unknown,
  incoming: unknown,
): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  if (isLanguageMap(existing)) {
    Object.assign(base, existing);
  } else if (isPlainObject(existing) && Object.keys(existing).length > 0) {
    // Legacy flat style → apply it as each language's starting point.
    for (const lang of SUPPORTED_LANGUAGES) base[lang] = existing;
  }
  const inc = isLanguageMap(incoming)
    ? incoming
    : isPlainObject(incoming) && Object.keys(incoming).length > 0
      ? Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, incoming]))
      : {};
  return { ...base, ...inc };
}

/**
 * Resolve a single language object out of a per-language `content` map, falling
 * back to the default language and then to an empty object. Returns `{}` for a
 * content value that is not a language map.
 */
export function localizeContent(
  content: unknown,
  lang: SupportedLanguage | null,
): Record<string, unknown> {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return {};
  }
  const map = content as Record<string, unknown>;
  const pick = (key: string) => {
    const value = map[key];
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  };
  if (lang) {
    return pick(lang) ?? pick(DEFAULT_LANGUAGE) ?? {};
  }
  return pick(DEFAULT_LANGUAGE) ?? {};
}
