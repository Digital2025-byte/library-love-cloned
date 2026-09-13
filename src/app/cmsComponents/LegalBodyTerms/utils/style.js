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

export const DEFAULT_LEGAL_BODY_TERMS_STYLE = {
  showChip: true,
  showAcceptance: true,
  showSections: true,
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

export function resolveLegalBodyTermsStyle(style = {}) {
  return {
    ...DEFAULT_LEGAL_BODY_TERMS_STYLE,
    ...style,
  };
}

export const LEGAL_BODY_TERMS_STYLE_RESET_KEYS = {
  layout: [
    "showChip",
    "showAcceptance",
    "showSections",
    "showContact",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "showCardBg",
    "cardBg",
  ],
  copy: ["titleColor", "titleFontWeight", "bodyColor", "bodyFontWeight", "chipColor"],
};
