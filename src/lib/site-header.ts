/**
 * Dynamic site header — document schema, normaliser and validator.
 *
 * ONE module shared by the `get-header` / `update-header` routes (and reusable
 * by any other server code). The shape and limits follow the shared header
 * contract (HEADER-CONTRACT.md) that the public site (new_fly_cham) and the
 * admin (flychamadmin/cms2) build against.
 *
 * zod is not a dependency of this backend, so validation is a small
 * hand-rolled validator that mirrors what a zod schema would enforce:
 *   - `normalizeHeaderDocument()` fills MISSING optional fields with defaults
 *     (so documents saved by an older client still validate) and strips
 *     unknown keys. It never "fixes" a present-but-wrong value.
 *   - `parseHeaderDocument()` normalises, then validates types, enums, limits,
 *     icon names, hrefs and id uniqueness, returning every issue with its path.
 */

export const HEADER_SCHEMA_VERSION = 1 as const;

export const HEADER_LIMITS = {
  menus: 8,
  tabsPerMenu: 10,
  linksPerTab: 24,
  cardsPerTab: 12,
  label: 80,
  description: 200,
  href: 500,
  id: 80,
  styleToken: 40,
} as const;

export const TAB_TYPES = ["links", "destinations", "activities", "map"] as const;
export type TabType = (typeof TAB_TYPES)[number];

/** CMS font-weight names (same set the cms2 weight picker offers). */
export const FONT_WEIGHTS = ["light", "normal", "medium", "semibold", "bold", "extrabold"] as const;
export type FontWeight = (typeof FONT_WEIGHTS)[number];

export const ICON_NAME_PATTERN = /^[A-Z][A-Za-z0-9]{1,60}$/;
const STYLE_TOKEN_PATTERN = /^[A-Za-z0-9#-]+$/;
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HeaderLink = {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  href: string;
};

export type HeaderCard = {
  id: string;
  name: string;
  location: string;
  code: string;
  tag: string;
  imageUrl: string;
  href: string;
};

export type HeaderTab = {
  id: string;
  label: string;
  icon: string;
  badge: string;
  type: TabType;
  withDescriptions: boolean;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  links: HeaderLink[];
  cards: HeaderCard[];
};

export type HeaderMenu = {
  id: string;
  label: string;
  visible: boolean;
  tabs: HeaderTab[];
};

export const HEADER_STYLE_COLOR_KEYS = [
  "barBg",
  "navColor",
  "navColorHover",
  "indicatorColor",
  "panelBg",
  "sidebarBg",
  "tabColor",
  "tabColorHover",
  "iconColor",
  "iconColorHover",
  "linkTitleColor",
  "linkTitleColorHover",
  "linkDescriptionColor",
  "ctaBarBg",
  "ctaTextColor",
  "inlineCtaColor",
  "cardBarBg",
  "cardTitleColor",
  "cardMetaColor",
  "tagBg",
  "tagTextColor",
] as const;

export const HEADER_STYLE_WEIGHT_KEYS = [
  "navFontWeight",
  "navFontWeightHover",
  "tabFontWeight",
  "tabFontWeightHover",
  "linkTitleFontWeight",
  "linkTitleFontWeightHover",
  "linkDescriptionFontWeight",
  "ctaFontWeight",
  "cardTitleFontWeight",
] as const;

export type HeaderStyle = {
  [K in (typeof HEADER_STYLE_COLOR_KEYS)[number]]: string;
} & {
  [K in (typeof HEADER_STYLE_WEIGHT_KEYS)[number]]: FontWeight;
};

export type HeaderDocument = {
  schemaVersion: typeof HEADER_SCHEMA_VERSION;
  logo: { lightUrl: string; darkUrl: string; alt: string; href: string };
  login: { show: boolean; label: string; href: string };
  region: { show: boolean; label: string };
  menus: HeaderMenu[];
  style: HeaderStyle;
};

export type HeaderIssue = { path: string; message: string };

export type ParseHeaderResult =
  { ok: true; document: HeaderDocument } | { ok: false; issues: HeaderIssue[] };

// ---------------------------------------------------------------------------
// Defaults (reproduce today's static header — same values as default-header.json)
// ---------------------------------------------------------------------------

export const DEFAULT_HEADER_STYLE: HeaderStyle = {
  barBg: "50",
  navColor: "700",
  navColorHover: "primary-1",
  navFontWeight: "normal",
  navFontWeightHover: "normal",
  indicatorColor: "primary-2",
  panelBg: "50",
  sidebarBg: "100",
  tabColor: "700",
  tabColorHover: "primary-1",
  tabFontWeight: "medium",
  tabFontWeightHover: "medium",
  iconColor: "700",
  iconColorHover: "primary-1",
  linkTitleColor: "700",
  linkTitleColorHover: "primary-1",
  linkTitleFontWeight: "semibold",
  linkTitleFontWeightHover: "semibold",
  linkDescriptionColor: "500",
  linkDescriptionFontWeight: "normal",
  ctaBarBg: "primary-1",
  ctaTextColor: "50",
  ctaFontWeight: "semibold",
  inlineCtaColor: "primary-1",
  cardBarBg: "primary-1",
  cardTitleColor: "50",
  cardTitleFontWeight: "semibold",
  cardMetaColor: "primary-3",
  tagBg: "primary-3",
  tagTextColor: "700",
};

const MEDIA_BASE =
  "https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout";

export const DEFAULT_HEADER_LOGO = {
  lightUrl: `${MEDIA_BASE}/logo.webp`,
  darkUrl: `${MEDIA_BASE}/logo-dark.webp`,
  alt: "Fly Cham",
  href: "/",
};

// ---------------------------------------------------------------------------
// Normaliser — fills missing fields, strips unknown keys, keeps wrong values
// ---------------------------------------------------------------------------

/** Field names read with dot access (explicit so noPropertyAccessFromIndexSignature is happy). */
type Field =
  | "schemaVersion"
  | "logo"
  | "login"
  | "region"
  | "menus"
  | "style"
  | "lightUrl"
  | "darkUrl"
  | "alt"
  | "href"
  | "show"
  | "label"
  | "id"
  | "visible"
  | "tabs"
  | "icon"
  | "badge"
  | "type"
  | "withDescriptions"
  | "imageUrl"
  | "imageAlt"
  | "ctaLabel"
  | "ctaHref"
  | "links"
  | "cards"
  | "title"
  | "description"
  | "name"
  | "location"
  | "code"
  | "tag";
type Obj = { [K in Field]?: unknown } & Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** `value` when present (not undefined/null), otherwise the fallback. */
function or<T>(value: unknown, fallback: T): unknown {
  return value === undefined || value === null ? fallback : value;
}

function normalizeLink(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `link-${index + 1}`),
    title: or(raw.title, ""),
    description: or(raw.description, ""),
    icon: or(raw.icon, ""),
    badge: or(raw.badge, ""),
    href: or(raw.href, ""),
  };
}

function normalizeCard(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `card-${index + 1}`),
    name: or(raw.name, ""),
    location: or(raw.location, ""),
    code: or(raw.code, ""),
    tag: or(raw.tag, ""),
    imageUrl: or(raw.imageUrl, ""),
    href: or(raw.href, ""),
  };
}

function normalizeList(raw: unknown, fn: (item: unknown, i: number) => unknown) {
  if (raw === undefined || raw === null) return [];
  return Array.isArray(raw) ? raw.map(fn) : raw;
}

function normalizeTab(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `tab-${index + 1}`),
    label: or(raw.label, ""),
    icon: or(raw.icon, ""),
    badge: or(raw.badge, ""),
    type: or(raw.type, "links"),
    withDescriptions: or(raw.withDescriptions, false),
    imageUrl: or(raw.imageUrl, ""),
    imageAlt: or(raw.imageAlt, ""),
    ctaLabel: or(raw.ctaLabel, ""),
    ctaHref: or(raw.ctaHref, ""),
    links: normalizeList(raw.links, normalizeLink),
    cards: normalizeList(raw.cards, normalizeCard),
  };
}

function normalizeMenu(raw: unknown, index: number): unknown {
  if (!isObj(raw)) return raw;
  return {
    id: or(raw.id, `menu-${index + 1}`),
    label: or(raw.label, ""),
    visible: or(raw.visible, true),
    tabs: normalizeList(raw.tabs, normalizeTab),
  };
}

function normalizeStyle(raw: unknown): unknown {
  if (raw === undefined || raw === null) return { ...DEFAULT_HEADER_STYLE };
  if (!isObj(raw)) return raw;
  const out: Obj = {};
  for (const key of Object.keys(DEFAULT_HEADER_STYLE) as (keyof HeaderStyle)[]) {
    out[key] = or(raw[key], DEFAULT_HEADER_STYLE[key]);
  }
  return out;
}

/**
 * Fill missing optional fields with defaults and drop unknown keys. The result
 * still has to go through validation (`parseHeaderDocument`) — present values
 * of the wrong type are passed through untouched so they are reported.
 */
export function normalizeHeaderDocument(input: unknown): unknown {
  if (!isObj(input)) return input;
  const logo = isObj(input.logo) ? input.logo : (input.logo ?? {});
  const login = isObj(input.login) ? input.login : (input.login ?? {});
  const region = isObj(input.region) ? input.region : (input.region ?? {});
  return {
    schemaVersion: or(input.schemaVersion, HEADER_SCHEMA_VERSION),
    logo: isObj(logo)
      ? {
          lightUrl: or(logo.lightUrl, DEFAULT_HEADER_LOGO.lightUrl),
          darkUrl: or(logo.darkUrl, DEFAULT_HEADER_LOGO.darkUrl),
          alt: or(logo.alt, DEFAULT_HEADER_LOGO.alt),
          href: or(logo.href, DEFAULT_HEADER_LOGO.href),
        }
      : logo,
    login: isObj(login)
      ? {
          show: or(login.show, true),
          label: or(login.label, ""),
          href: or(login.href, "/"),
        }
      : login,
    region: isObj(region) ? { show: or(region.show, true), label: or(region.label, "") } : region,
    menus: normalizeList(input.menus, normalizeMenu),
    style: normalizeStyle(input.style),
  };
}

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

/**
 * CMS link rule: "" (none), an app path without language prefix ("/help"),
 * an in-page anchor ("#x"), or an absolute http(s) / mailto / tel URL.
 */
export function isValidHeaderHref(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  if (value.startsWith("#")) return true;
  return /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/i.test(value);
}

/** Image/asset URL: "" (none), a site path, or an absolute http(s) URL. */
function isValidAssetUrl(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  return /^https?:\/\/[^\s]+$/i.test(value);
}

class Checker {
  issues: HeaderIssue[] = [];

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
    if (!this.str(value, path, HEADER_LIMITS.id, { required: true })) return;
    if (!ID_PATTERN.test(value)) {
      this.add(path, "Id may only contain letters, digits, '-' and '_'");
      return;
    }
    if (seen.has(value)) this.add(path, `Duplicate id "${value}"`);
    seen.add(value);
  }

  icon(value: unknown, path: string) {
    if (!this.str(value, path, 61)) return;
    if (value !== "" && !ICON_NAME_PATTERN.test(value)) {
      this.add(path, "Icon must be a PascalCase Phosphor icon name or empty");
    }
  }

  href(value: unknown, path: string) {
    if (!this.str(value, path, HEADER_LIMITS.href)) return;
    if (!isValidHeaderHref(value)) {
      this.add(path, 'Link must be an app path ("/help") or an absolute http(s)/mailto/tel URL');
    }
  }

  asset(value: unknown, path: string, opts: { required?: boolean } = {}) {
    if (!this.str(value, path, HEADER_LIMITS.href, opts)) return;
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

function checkLink(c: Checker, link: unknown, path: string, ids: Set<string>) {
  if (!c.obj(link, path)) return;
  c.id(link.id, `${path}.id`, ids);
  c.str(link.title, `${path}.title`, HEADER_LIMITS.label);
  c.str(link.description, `${path}.description`, HEADER_LIMITS.description);
  c.icon(link.icon, `${path}.icon`);
  c.icon(link.badge, `${path}.badge`);
  c.href(link.href, `${path}.href`);
}

function checkCard(c: Checker, card: unknown, path: string, ids: Set<string>) {
  if (!c.obj(card, path)) return;
  c.id(card.id, `${path}.id`, ids);
  c.str(card.name, `${path}.name`, HEADER_LIMITS.label);
  c.str(card.location, `${path}.location`, HEADER_LIMITS.label);
  c.str(card.code, `${path}.code`, HEADER_LIMITS.label);
  c.str(card.tag, `${path}.tag`, HEADER_LIMITS.label);
  c.asset(card.imageUrl, `${path}.imageUrl`);
  c.href(card.href, `${path}.href`);
}

function checkTab(c: Checker, tab: unknown, path: string, ids: Set<string>) {
  if (!c.obj(tab, path)) return;
  c.id(tab.id, `${path}.id`, ids);
  c.str(tab.label, `${path}.label`, HEADER_LIMITS.label);
  c.icon(tab.icon, `${path}.icon`);
  c.icon(tab.badge, `${path}.badge`);
  if (!(TAB_TYPES as readonly unknown[]).includes(tab.type)) {
    c.add(`${path}.type`, `Must be one of: ${TAB_TYPES.join(", ")}`);
  }
  c.bool(tab.withDescriptions, `${path}.withDescriptions`);
  c.asset(tab.imageUrl, `${path}.imageUrl`);
  c.str(tab.imageAlt, `${path}.imageAlt`, HEADER_LIMITS.description);
  c.str(tab.ctaLabel, `${path}.ctaLabel`, HEADER_LIMITS.label);
  c.href(tab.ctaHref, `${path}.ctaHref`);
  if (c.array(tab.links, `${path}.links`, HEADER_LIMITS.linksPerTab)) {
    const linkIds = new Set<string>();
    tab.links.forEach((l, i) => checkLink(c, l, `${path}.links[${i}]`, linkIds));
  }
  if (c.array(tab.cards, `${path}.cards`, HEADER_LIMITS.cardsPerTab)) {
    const cardIds = new Set<string>();
    tab.cards.forEach((k, i) => checkCard(c, k, `${path}.cards[${i}]`, cardIds));
  }
}

function checkMenu(c: Checker, menu: unknown, path: string, ids: Set<string>) {
  if (!c.obj(menu, path)) return;
  c.id(menu.id, `${path}.id`, ids);
  c.str(menu.label, `${path}.label`, HEADER_LIMITS.label);
  c.bool(menu.visible, `${path}.visible`);
  if (c.array(menu.tabs, `${path}.tabs`, HEADER_LIMITS.tabsPerMenu)) {
    const tabIds = new Set<string>();
    menu.tabs.forEach((t, i) => checkTab(c, t, `${path}.tabs[${i}]`, tabIds));
  }
}

function checkStyle(c: Checker, style: unknown, path: string) {
  if (!c.obj(style, path)) return;
  for (const key of HEADER_STYLE_COLOR_KEYS) {
    const value = style[key];
    if (
      c.str(value, `${path}.${key}`, HEADER_LIMITS.styleToken, { required: true }) &&
      !STYLE_TOKEN_PATTERN.test(value)
    ) {
      c.add(`${path}.${key}`, 'Must be a theme colour token (e.g. "700", "primary-1")');
    }
  }
  for (const key of HEADER_STYLE_WEIGHT_KEYS) {
    if (!(FONT_WEIGHTS as readonly unknown[]).includes(style[key])) {
      c.add(`${path}.${key}`, `Must be one of: ${FONT_WEIGHTS.join(", ")}`);
    }
  }
}

/**
 * Normalise + validate an incoming header document.
 * `{ ok: true, document }` holds the normalised document (safe to store/render);
 * `{ ok: false, issues }` lists every problem as `{ path, message }`.
 */
export function parseHeaderDocument(input: unknown): ParseHeaderResult {
  const doc = normalizeHeaderDocument(input);
  const c = new Checker();

  if (!c.obj(doc, "document")) return { ok: false, issues: c.issues };

  if (doc.schemaVersion !== HEADER_SCHEMA_VERSION) {
    c.add("schemaVersion", `Must be ${HEADER_SCHEMA_VERSION}`);
  }

  if (c.obj(doc.logo, "logo")) {
    c.asset(doc.logo.lightUrl, "logo.lightUrl", { required: true });
    c.asset(doc.logo.darkUrl, "logo.darkUrl", { required: true });
    c.str(doc.logo.alt, "logo.alt", HEADER_LIMITS.label);
    c.href(doc.logo.href, "logo.href");
  }
  if (c.obj(doc.login, "login")) {
    c.bool(doc.login.show, "login.show");
    c.str(doc.login.label, "login.label", HEADER_LIMITS.label);
    c.href(doc.login.href, "login.href");
  }
  if (c.obj(doc.region, "region")) {
    c.bool(doc.region.show, "region.show");
    c.str(doc.region.label, "region.label", HEADER_LIMITS.label);
  }
  if (c.array(doc.menus, "menus", HEADER_LIMITS.menus)) {
    const menuIds = new Set<string>();
    doc.menus.forEach((m, i) => checkMenu(c, m, `menus[${i}]`, menuIds));
  }
  checkStyle(c, doc.style, "style");

  if (c.issues.length > 0) return { ok: false, issues: c.issues };
  return { ok: true, document: doc as HeaderDocument };
}

// ---------------------------------------------------------------------------
// `public.site_header` row helpers (shared by get-header / update-header)
// ---------------------------------------------------------------------------

export type SiteHeaderRow = {
  lang: string;
  data: unknown;
  version: number;
  updated_at: string;
};

export const SITE_HEADER_COLUMNS = "lang, data, version, updated_at";

/** API payload `{ lang, document, version, updatedAt }` for GET and PUT. */
export function headerPayload(row: SiteHeaderRow) {
  return {
    lang: row.lang,
    // Older stored documents get missing optional fields filled with defaults.
    document: normalizeHeaderDocument(row.data),
    version: row.version,
    updatedAt: row.updated_at,
  };
}

/** PostgREST "table not in schema cache" / Postgres "relation does not exist". */
export function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /could not find the table|relation .* does not exist/i.test(error.message ?? "")
  );
}
