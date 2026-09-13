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

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6 lg:py-8",
  default: "py-8 sm:py-12 lg:py-16",
  loose: "py-12 sm:py-16 lg:py-20",
};

export const DEFAULT_CALL_US_STYLE = {
  showTitle: true,
  showDescription: true,
  showPhone: true,
  showIcon: true,
  showSectionBg: true,
  showCardBg: true,
  sectionBg: "100",
  sectionPadding: "default",
  cardRadius: "lg",
  cardBg: "main",
  titleColor: "white",
  descriptionColor: "white",
  phoneColor: "white",
  iconBg: "primary-1",
  iconColor: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  phoneFontWeight: "semibold",
};

export function resolveCallUsStyle(style = {}) {
  return {
    ...DEFAULT_CALL_US_STYLE,
    ...style,
  };
}

export const CALL_US_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showPhone",
    "showIcon",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  card: ["showCardBg", "cardRadius", "cardBg"],
  title: ["titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight", "phoneColor", "phoneFontWeight"],
  icon: ["iconBg", "iconColor"],
};
