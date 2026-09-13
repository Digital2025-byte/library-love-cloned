/**
 * Shared font-weight tokens for CMS style inspectors and renderers.
 * Pair with text colors via weightKeyForColorKey() / getTextStyle().
 */

import { getThemeColorCss } from "./themeColors";

export const FONT_WEIGHT_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "normal", label: "Regular" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
  { value: "extrabold", label: "Extra bold" },
];

/** Tailwind utility classes */
export const FONT_WEIGHT_CLASS = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

/** CSS font-weight values (inline style; overrides hardcoded Tailwind weights) */
export const FONT_WEIGHT_VALUE = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/** Style keys that control readable text (not fills, icons, washes). */
export const TEXT_COLOR_KEYS = new Set([
  "titleColor",
  "descriptionColor",
  "subtitleColor",
  "itemTitleColor",
  "itemColor",
  "itemDescriptionColor",
  "itemBodyColor",
  "nameColor",
  "userNameColor",
  "copyColor",
  "phoneColor",
  "countryColor",
  "listColor",
  "bodyColor",
  "cardHeadingColor",
  "cardBodyColor",
  "cardTitleColor",
  "tileLabelColor",
  "tileValueColor",
  "nextFlightColor",
  "headingColor",
  "highlightColor",
  "badgeText",
  "chipText",
  "chipActiveText",
  "primaryText",
  "secondaryText",
  "buttonText",
  "tabColor",
  "tabText",
  "labelColor",
  "numberColor",
  "questionColor",
  "answerColor",
  "prefixColor",
  "valueColor",
]);

const DEFAULT_WEIGHT_BY_WEIGHT_KEY = {
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  subtitleFontWeight: "medium",
  itemTitleFontWeight: "semibold",
  itemFontWeight: "medium",
  itemDescriptionFontWeight: "normal",
  itemBodyFontWeight: "normal",
  nameFontWeight: "semibold",
  userNameFontWeight: "medium",
  copyFontWeight: "normal",
  phoneFontWeight: "semibold",
  countryFontWeight: "medium",
  listFontWeight: "normal",
  bodyFontWeight: "normal",
  cardHeadingFontWeight: "semibold",
  cardBodyFontWeight: "normal",
  cardTitleFontWeight: "semibold",
  tileLabelFontWeight: "medium",
  tileValueFontWeight: "semibold",
  nextFlightFontWeight: "semibold",
  headingFontWeight: "semibold",
  highlightFontWeight: "bold",
  badgeTextFontWeight: "medium",
  chipTextFontWeight: "medium",
  chipActiveTextFontWeight: "medium",
  primaryTextFontWeight: "semibold",
  secondaryTextFontWeight: "semibold",
  buttonTextFontWeight: "semibold",
  tabFontWeight: "medium",
  tabTextFontWeight: "medium",
  labelFontWeight: "medium",
  numberFontWeight: "bold",
  questionFontWeight: "semibold",
  answerFontWeight: "normal",
  prefixFontWeight: "semibold",
  valueFontWeight: "medium",
};

export function isTextColorKey(key) {
  return TEXT_COLOR_KEYS.has(key);
}

export function weightKeyForColorKey(colorKey) {
  if (!colorKey || !isTextColorKey(colorKey)) return null;
  if (colorKey.endsWith("Color")) {
    return colorKey.replace(/Color$/, "FontWeight");
  }
  if (colorKey.endsWith("Text")) {
    return `${colorKey}FontWeight`;
  }
  return null;
}

export function defaultWeightForKey(weightKey, fallback = "medium") {
  return DEFAULT_WEIGHT_BY_WEIGHT_KEY[weightKey] || fallback;
}

export function resolveFontWeight(value, fallback = "medium") {
  if (value && FONT_WEIGHT_VALUE[value] !== undefined) return value;
  if (fallback && FONT_WEIGHT_VALUE[fallback] !== undefined) return fallback;
  return "medium";
}

export function getFontWeightClass(value, fallback = "medium") {
  return FONT_WEIGHT_CLASS[resolveFontWeight(value, fallback)];
}

export function getFontWeightValue(value, fallback = "medium") {
  return FONT_WEIGHT_VALUE[resolveFontWeight(value, fallback)];
}

/**
 * Build { color, fontWeight } for a text role.
 * @param {object} style
 * @param {string} colorKey e.g. "titleColor"
 * @param {string} colorFallback theme token
 * @param {string} [weightFallback]
 */
export function getTextStyle(
  style,
  colorKey,
  colorFallback,
  weightFallback
) {
  const weightKey = weightKeyForColorKey(colorKey);
  const resolvedFallback =
    weightFallback || defaultWeightForKey(weightKey || "", "medium");

  return {
    color: getThemeColorCss(style?.[colorKey], colorFallback),
    fontWeight: getFontWeightValue(
      weightKey ? style?.[weightKey] : undefined,
      resolvedFallback
    ),
  };
}

/**
 * Given a DEFAULT_*_STYLE object, return font-weight entries for its text colors.
 */
export function fontWeightsForStyleDefaults(defaults = {}) {
  const weights = {};
  for (const key of Object.keys(defaults)) {
    const weightKey = weightKeyForColorKey(key);
    if (!weightKey) continue;
    weights[weightKey] = defaultWeightForKey(weightKey);
  }
  return weights;
}
