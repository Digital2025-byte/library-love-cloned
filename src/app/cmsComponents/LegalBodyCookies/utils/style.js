export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const SECTION_PADDING_CLASS = {
  tight: "py-8 md:py-10",
  default: "py-12 md:py-16",
  loose: "py-16 md:py-20",
};

export const DEFAULT_LEGAL_BODY_COOKIES_STYLE = {
  showChip: true,
  showIntroduction: true,
  showTypes: true,
  showThirdParty: true,
  showPreferences: true,
  showLifespan: true,
  showUpdates: true,
  showContact: true,
  showSectionBg: false,
  showCardBg: true,
  sectionBg: "white",
  sectionPadding: "default",
  cardBg: "50",
  titleColor: "primary-1",
  bodyColor: "700",
  chipColor: "primary-1",
  titleFontWeight: "semibold",
  bodyFontWeight: "normal",
};

export function resolveLegalBodyCookiesStyle(style = {}) {
  return {
    ...DEFAULT_LEGAL_BODY_COOKIES_STYLE,
    ...style,
  };
}

export const LEGAL_BODY_COOKIES_STYLE_RESET_KEYS = {
  layout: [
    "showChip",
    "showIntroduction",
    "showTypes",
    "showThirdParty",
    "showPreferences",
    "showLifespan",
    "showUpdates",
    "showContact",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "showCardBg",
    "cardBg",
  ],
  copy: ["titleColor", "titleFontWeight", "bodyColor", "bodyFontWeight", "chipColor"],
};
