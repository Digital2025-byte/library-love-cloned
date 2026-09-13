import { getThemeColorCss } from "@/styles/themeColors";

export const HEIGHT_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "tall", label: "Tall" },
];

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const BANNER_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-4 md:py-6",
  default: "py-6 md:py-10",
  loose: "py-10 md:py-16",
};

export const HEIGHT_CLASS = {
  compact: "min-h-[180px] sm:min-h-[200px] md:min-h-[220px]",
  default: "min-h-[200px] sm:min-h-[240px] md:min-h-[280px]",
  tall: "min-h-[260px] sm:min-h-[320px] md:min-h-[380px]",
};

/** Accepts a theme token OR a raw #hex, so the exact source navy is preserved. */
export function resolveColor(value, fallbackToken) {
  if (typeof value === "string" && value.startsWith("#")) {
    return value;
  }
  return getThemeColorCss(value, fallbackToken);
}

export const DEFAULT_PROMO_BANNER_STYLE = {
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: false,
  showOverlay: true,
  sectionBg: "100",
  sectionPadding: "default",
  bannerHeight: "default",
  bannerRadius: "lg",
  titleColor: "50",
  descriptionColor: "50",
  overlayColor: "#0B2A4A",
  buttonBg: "secondary",
  buttonText: "btn",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonFontWeight: "medium",
};

export function resolvePromoBannerStyle(style = {}) {
  return { ...DEFAULT_PROMO_BANNER_STYLE, ...style };
}

export const PROMO_BANNER_STYLE_RESET_KEYS = {
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "bannerHeight",
    "bannerRadius",
  ],
  overlay: [
    "showOverlay",
    "overlayColor",
    "titleColor",
    "titleFontWeight",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonFontWeight"],
};
