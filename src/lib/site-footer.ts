/**
 * Dynamic site footer — document schema, normaliser and validator.
 *
 * Mirror of `site-header.ts` for the footer (FOOTER-CONTRACT.md). Shared by the
 * `get-footer` / `update-footer` routes. The href rule, icon-name rule, font
 * weights and missing-table detection are imported from `site-header.ts`
 * unchanged, so both documents follow exactly the same rules.
 *
 *   - `normalizeFooterDocument()` fills MISSING optional fields with defaults
 *     and strips unknown keys. It never "fixes" a present-but-wrong value.
 *   - `parseFooterDocument()` normalises, then validates types, enums, limits,
 *     icon names, hrefs and id uniqueness, returning every issue with its path.
 */

import {
  FONT_WEIGHTS,
  ICON_NAME_PATTERN,
  isMissingTable,
  isValidHeaderHref,
  type FontWeight,
} from "./site-header";

export { isMissingTable };

export const FOOTER_SCHEMA_VERSION = 1 as const;

export const FOOTER_LIMITS = {
  social: 12,
  columns: 10,
  linksPerColumn: 20,
  legalLinks: 10,
  label: 80,
  copyright: 200,
  followText: 200,
  href: 500,
  id: 80,
  styleToken: 40,
} as const;

export const FOOTER_GROUPS = [1, 2, 3, 4] as const;
export type FooterGroup = (typeof FOOTER_GROUPS)[number];

const STYLE_TOKEN_PATTERN = /^[A-Za-z0-9#-]+$/;
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FooterSocialLink = {
  id: string;
  icon: string;
  label: string;
  href: string;
  showOnMobile: boolean;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  external: boolean;
  highlight: boolean;
};

export type FooterColumn = {
  id: string;
  title: string;
  href: string;
  group: FooterGroup;
  links: FooterLink[];
};

export type FooterLegalLink = {
  id: string;
  label: string;
  href: string;
  showOnMobile: boolean;
};

export const FOOTER_STYLE_COLOR_KEYS = [
  "bg",
  "columnTitleColor",
  "columnTitleColorHover",
  "mobileTitleColor",
  "mobileTitleColorHover",
  "linkColor",
  "linkColorHover",
  "highlightColor",
  "followTextColor",
  "socialColor",
  "socialColorHover",
  "legalColor",
  "legalColorHover",
  "dividerColor",
] as const;

export const FOOTER_STYLE_WEIGHT_KEYS = [
  "columnTitleFontWeight",
  "mobileTitleFontWeight",
  "linkFontWeight",
] as const;

export type FooterStyle = {
  [K in (typeof FOOTER_STYLE_COLOR_KEYS)[number]]: string;
} & {
  [K in (typeof FOOTER_STYLE_WEIGHT_KEYS)[number]]: FontWeight;
} & { showPattern: boolean };

export type FooterDocument = {
  schemaVersion: typeof FOOTER_SCHEMA_VERSION;
  brand: {
    logoUrl: string;
    logoAlt: string;
    logoHref: string;
    followText: string;
    patternUrl: string;
  };
  social: FooterSocialLink[];
  columns: FooterColumn[];
  legal: { copyright: string; links: FooterLegalLink[] };
  style: FooterStyle;
};

export type FooterIssue = { path: string; message: string };

export type ParseFooterResult =
  { ok: true; document: FooterDocument } | { ok: false; issues: FooterIssue[] };

// ---------------------------------------------------------------------------
// Defaults (reproduce today's static footer — same values as default-footer.json)
// Key order matches default-footer.json so a normalised default is identical.
// ---------------------------------------------------------------------------

export const DEFAULT_FOOTER_STYLE: FooterStyle = {
  bg: "primary-1",
  showPattern: true,
  columnTitleColor: "secondary",
  columnTitleColorHover: "50",
  columnTitleFontWeight: "semibold",
  mobileTitleColor: "50",
  mobileTitleColorHover: "secondary",
  mobileTitleFontWeight: "semibold",
  linkColor: "50",
  linkColorHover: "secondary",
  linkFontWeight: "normal",
  highlightColor: "secondary",
  followTextColor: "50",
  socialColor: "50",
  socialColorHover: "primary-2",
  legalColor: "50",
  legalColorHover: "primary-2",
  dividerColor: "50",
};

const MEDIA_BASE =
  "https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout";

export const DEFAULT_FOOTER_BRAND = {
  logoUrl: `${MEDIA_BASE}/logo.webp`,
  logoAlt: "Fly Cham",
  logoHref: "/",
  followText: "",
  patternUrl: `${MEDIA_BASE}/footer-pattern.webp`,
};

// ---------------------------------------------------------------------------
// Normaliser — fills missing fields, strips unknown keys, keeps wrong values
// ---------------------------------------------------------------------------

type Field =
  | "schemaVersion"
  | "brand"
  | "social"
  | "columns"
  | "legal"
  | "style"
  | "logoUrl"
  | "logoAlt"
  | "logoHref"
  | "followText"
  | "patternUrl"
  | "id"
  | "icon"
  | "label"
  | "href"
  | "showOnMobile"
  | "title"
  | "group"
  | "links"
  | "external"
  | "highlight"
  | "copyright"
  | "showPattern";
type Obj = { [K in Field]?: unknown } & Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** `value` when present (not undefined/null), otherwise the fallback. */
function or<T>(value: unknown, fallback: T): unknown {
  return value === undefined || value === null ? fallback : value;
}

function normalizeList(raw: unknown, fn: (item: unknown, i: number) => unknown) {
  if (raw === undefined || raw === null) return [];
  return Array.isArray(raw) ? raw.map(fn) : raw;
}

function normalizeSocial(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `social-${index + 1}`),
    icon: or(raw.icon, ""),
    label: or(raw.label, ""),
    href: or(raw.href, ""),
    showOnMobile: or(raw.showOnMobile, true),
  };
}

function normalizeLink(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `link-${index + 1}`),
    label: or(raw.label, ""),
    href: or(raw.href, ""),
    external: or(raw.external, false),
    highlight: or(raw.highlight, false),
  };
}

function normalizeColumn(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `column-${index + 1}`),
    title: or(raw.title, ""),
    href: or(raw.href, ""),
    group: or(raw.group, (index % 4) + 1),
    links: normalizeList(raw.links, normalizeLink),
  };
}

function normalizeLegalLink(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `legal-${index + 1}`),
    label: or(raw.label, ""),
    href: or(raw.href, ""),
    showOnMobile: or(raw.showOnMobile, true),
  };
}

function normalizeStyle(raw: unknown): unknown {
  if (raw === undefined || raw === null) return { ...DEFAULT_FOOTER_STYLE };
  if (!isObj(raw)) return raw;
  const out: Obj = {};
  for (const key of Object.keys(DEFAULT_FOOTER_STYLE) as (keyof FooterStyle)[]) {
    out[key] = or(raw[key], DEFAULT_FOOTER_STYLE[key]);
  }
  return out;
}

/**
 * Fill missing optional fields with defaults and drop unknown keys. The result
 * still has to go through validation (`parseFooterDocument`).
 */
export function normalizeFooterDocument(input: unknown): unknown {
  if (!isObj(input)) return input;
  const brand = isObj(input.brand) ? input.brand : (input.brand ?? {});
  const legal = isObj(input.legal) ? input.legal : (input.legal ?? {});
  return {
    schemaVersion: or(input.schemaVersion, FOOTER_SCHEMA_VERSION),
    brand: isObj(brand)
      ? {
          logoUrl: or(brand.logoUrl, DEFAULT_FOOTER_BRAND.logoUrl),
          logoAlt: or(brand.logoAlt, DEFAULT_FOOTER_BRAND.logoAlt),
          logoHref: or(brand.logoHref, DEFAULT_FOOTER_BRAND.logoHref),
          followText: or(brand.followText, DEFAULT_FOOTER_BRAND.followText),
          patternUrl: or(brand.patternUrl, DEFAULT_FOOTER_BRAND.patternUrl),
        }
      : brand,
    social: normalizeList(input.social, normalizeSocial),
    columns: normalizeList(input.columns, normalizeColumn),
    legal: isObj(legal)
      ? {
          copyright: or(legal.copyright, ""),
          links: normalizeList(legal.links, normalizeLegalLink),
        }
      : legal,
    style: normalizeStyle(input.style),
  };
}

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

/** Same link rule as the header ("" | "/path" | "#anchor" | http(s)/mailto/tel). */
export const isValidFooterHref = isValidHeaderHref;

/** Image/asset URL: "" (none), a site path, or an absolute http(s) URL. */
function isValidAssetUrl(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  return /^https?:\/\/[^\s]+$/i.test(value);
}

class Checker {
  issues: FooterIssue[] = [];

  add(path: string, message: string) {
    if (this.issues.length < 200) this.issues.push({ path, message });
  }

  obj(value: unknown, path: string): value is Obj {
    if (isObj(value)) return true;
    this.add(path, "Expected an object");
    return false;
  }

  bool(value: unknown, path: string) {
    if (typeof value !== "boolean") this.add(path, "Expected a boolean");
  }

  str(
    value: unknown,
    path: string,
    max: number,
    opts: { required?: boolean } = {},
  ): value is string {
    if (typeof value !== "string") {
      this.add(path, "Expected a string");
      return false;
    }
    if (value.length > max) {
      this.add(path, `Must be at most ${max} characters`);
      return false;
    }
    if (opts.required && value.trim() === "") {
      this.add(path, "Must not be empty");
      return false;
    }
    return true;
  }

  id(value: unknown, path: string, seen: Set<string>) {
    if (!this.str(value, path, FOOTER_LIMITS.id, { required: true })) return;
    if (!ID_PATTERN.test(value)) {
      this.add(path, "Id may only contain letters, digits, '-' and '_'");
      return;
    }
    if (seen.has(value)) this.add(path, `Duplicate id "${value}"`);
    seen.add(value);
  }

  icon(value: unknown, path: string, opts: { required?: boolean } = {}) {
    if (!this.str(value, path, 61, opts)) return;
    if (value !== "" && !ICON_NAME_PATTERN.test(value)) {
      this.add(
        path,
        opts.required
          ? "Icon must be a PascalCase Phosphor icon name"
          : "Icon must be a PascalCase Phosphor icon name or empty",
      );
    }
  }

  href(value: unknown, path: string) {
    if (!this.str(value, path, FOOTER_LIMITS.href)) return;
    if (!isValidFooterHref(value)) {
      this.add(path, 'Link must be an app path ("/help") or an absolute http(s)/mailto/tel URL');
    }
  }

  asset(value: unknown, path: string, opts: { required?: boolean } = {}) {
    if (!this.str(value, path, FOOTER_LIMITS.href, opts)) return;
    if (!isValidAssetUrl(value)) {
      this.add(path, "Image URL must be a site path or an absolute http(s) URL");
    }
  }

  array(value: unknown, path: string, max: number): value is unknown[] {
    if (!Array.isArray(value)) {
      this.add(path, "Expected an array");
      return false;
    }
    if (value.length > max) {
      this.add(path, `At most ${max} items allowed`);
      return false;
    }
    return true;
  }
}

function checkSocial(c: Checker, item: unknown, path: string, ids: Set<string>) {
  if (!c.obj(item, path)) return;
  c.id(item.id, `${path}.id`, ids);
  c.icon(item.icon, `${path}.icon`, { required: true });
  c.str(item.label, `${path}.label`, FOOTER_LIMITS.label);
  c.href(item.href, `${path}.href`);
  c.bool(item.showOnMobile, `${path}.showOnMobile`);
}

function checkLink(c: Checker, link: unknown, path: string, ids: Set<string>) {
  if (!c.obj(link, path)) return;
  c.id(link.id, `${path}.id`, ids);
  c.str(link.label, `${path}.label`, FOOTER_LIMITS.label);
  c.href(link.href, `${path}.href`);
  c.bool(link.external, `${path}.external`);
  c.bool(link.highlight, `${path}.highlight`);
}

function checkColumn(c: Checker, col: unknown, path: string, ids: Set<string>) {
  if (!c.obj(col, path)) return;
  c.id(col.id, `${path}.id`, ids);
  c.str(col.title, `${path}.title`, FOOTER_LIMITS.label);
  c.href(col.href, `${path}.href`);
  if (!(FOOTER_GROUPS as readonly unknown[]).includes(col.group)) {
    c.add(`${path}.group`, `Must be one of: ${FOOTER_GROUPS.join(", ")}`);
  }
  if (c.array(col.links, `${path}.links`, FOOTER_LIMITS.linksPerColumn)) {
    const linkIds = new Set<string>();
    col.links.forEach((l, i) => checkLink(c, l, `${path}.links[${i}]`, linkIds));
  }
}

function checkLegalLink(c: Checker, link: unknown, path: string, ids: Set<string>) {
  if (!c.obj(link, path)) return;
  c.id(link.id, `${path}.id`, ids);
  c.str(link.label, `${path}.label`, FOOTER_LIMITS.label);
  c.href(link.href, `${path}.href`);
  c.bool(link.showOnMobile, `${path}.showOnMobile`);
}

function checkStyle(c: Checker, style: unknown, path: string) {
  if (!c.obj(style, path)) return;
  for (const key of FOOTER_STYLE_COLOR_KEYS) {
    const value = style[key];
    if (
      c.str(value, `${path}.${key}`, FOOTER_LIMITS.styleToken, { required: true }) &&
      !STYLE_TOKEN_PATTERN.test(value)
    ) {
      c.add(`${path}.${key}`, 'Must be a theme colour token (e.g. "50", "primary-1")');
    }
  }
  for (const key of FOOTER_STYLE_WEIGHT_KEYS) {
    if (!(FONT_WEIGHTS as readonly unknown[]).includes(style[key])) {
      c.add(`${path}.${key}`, `Must be one of: ${FONT_WEIGHTS.join(", ")}`);
    }
  }
  c.bool(style.showPattern, `${path}.showPattern`);
}

/**
 * Normalise + validate an incoming footer document.
 * `{ ok: true, document }` holds the normalised document (safe to store/render);
 * `{ ok: false, issues }` lists every problem as `{ path, message }`.
 */
export function parseFooterDocument(input: unknown): ParseFooterResult {
  const doc = normalizeFooterDocument(input);
  const c = new Checker();

  if (!c.obj(doc, "document")) return { ok: false, issues: c.issues };

  if (doc.schemaVersion !== FOOTER_SCHEMA_VERSION) {
    c.add("schemaVersion", `Must be ${FOOTER_SCHEMA_VERSION}`);
  }

  if (c.obj(doc.brand, "brand")) {
    c.asset(doc.brand.logoUrl, "brand.logoUrl", { required: true });
    c.str(doc.brand.logoAlt, "brand.logoAlt", FOOTER_LIMITS.label);
    c.href(doc.brand.logoHref, "brand.logoHref");
    c.str(doc.brand.followText, "brand.followText", FOOTER_LIMITS.followText);
    c.asset(doc.brand.patternUrl, "brand.patternUrl");
  }
  if (c.array(doc.social, "social", FOOTER_LIMITS.social)) {
    const ids = new Set<string>();
    doc.social.forEach((s, i) => checkSocial(c, s, `social[${i}]`, ids));
  }
  if (c.array(doc.columns, "columns", FOOTER_LIMITS.columns)) {
    const ids = new Set<string>();
    doc.columns.forEach((col, i) => checkColumn(c, col, `columns[${i}]`, ids));
  }
  if (c.obj(doc.legal, "legal")) {
    c.str(doc.legal.copyright, "legal.copyright", FOOTER_LIMITS.copyright);
    if (c.array(doc.legal.links, "legal.links", FOOTER_LIMITS.legalLinks)) {
      const ids = new Set<string>();
      doc.legal.links.forEach((l, i) => checkLegalLink(c, l, `legal.links[${i}]`, ids));
    }
  }
  checkStyle(c, doc.style, "style");

  if (c.issues.length > 0) return { ok: false, issues: c.issues };
  return { ok: true, document: doc as FooterDocument };
}

// ---------------------------------------------------------------------------
// `public.site_footer` row helpers (shared by get-footer / update-footer)
// ---------------------------------------------------------------------------

export type SiteFooterRow = {
  lang: string;
  data: unknown;
  version: number;
  updated_at: string;
};

export const SITE_FOOTER_COLUMNS = "lang, data, version, updated_at";

/** API payload `{ lang, document, version, updatedAt }` for GET and PUT. */
export function footerPayload(row: SiteFooterRow) {
  return {
    lang: row.lang,
    // Older stored documents get missing optional fields filled with defaults.
    document: normalizeFooterDocument(row.data),
    version: row.version,
    updatedAt: row.updated_at,
  };
}
