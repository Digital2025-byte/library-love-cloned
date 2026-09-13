export const LINK_UNDERLINE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "always", label: "Always" },
  { value: "hover", label: "On hover" },
];

export const DEFAULT_BACKLINK_STYLE = {
  showLinks: true,
  linkColor: "primary-1",
  linkHoverColor: "primary-2",
  linkFontWeight: "semibold",
  linkUnderline: "always",
  linkItalic: false,
};

export const BACKLINK_STYLE_RESET_KEYS = [
  "showLinks",
  "linkColor",
  "linkHoverColor",
  "linkFontWeight",
  "linkUnderline",
  "linkItalic",
];

export function resolveBacklinkUnderline(linkUnderline, fallback = "always") {
  if (linkUnderline === true) return "always";
  if (linkUnderline === false) return "none";
  if (LINK_UNDERLINE_OPTIONS.some((option) => option.value === linkUnderline)) {
    return linkUnderline;
  }
  return fallback;
}

/**
 * Merge component style with backlink defaults and normalize underline.
 * Use in every component's resolveXStyle().
 */
export function resolveBacklinkStyle(style = {}, defaults = DEFAULT_BACKLINK_STYLE) {
  const { linkUnderline, ...rest } = style;
  const merged = {
    ...defaults,
    ...rest,
  };

  return {
    ...merged,
    linkUnderline: resolveBacklinkUnderline(
      linkUnderline,
      defaults.linkUnderline ?? DEFAULT_BACKLINK_STYLE.linkUnderline
    ),
  };
}

/**
 * Spread into a component's DEFAULT_*_STYLE object.
 */
export function withBacklinkStyleDefaults(componentDefaults = {}) {
  return {
    ...componentDefaults,
    ...DEFAULT_BACKLINK_STYLE,
  };
}
