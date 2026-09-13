export const VARIANT_OPTIONS = [
  { value: "channels", label: "Channels (CTA button)" },
  { value: "forms", label: "Forms (compact)" },
  { value: "getHelp", label: "Get Help" },
];

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const COLUMNS_OPTIONS = [
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
  { value: "right", label: "End" },
];

export const TITLE_ALIGN_CLASS = {
  left: "text-start items-start",
  center: "text-center items-center",
  right: "text-end items-end",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-4 md:py-6",
  default: "py-6 md:py-10",
  loose: "py-10 md:py-16",
};

export const CARD_GAP_CLASS = {
  tight: "gap-3 md:gap-4",
  default: "gap-4 md:gap-5",
  loose: "gap-5 md:gap-8",
};

export const COLUMNS_CLASS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  5: "md:grid-cols-2 lg:grid-cols-5",
};

export const DEFAULT_CONTACT_CARDS_STYLE = {
  variant: "channels",
  showHeader: true,
  showTitle: true,
  showSubtitle: true,
  showFooterLink: false,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  columns: "3",
  cardGap: "default",
  titleAlign: "left",
  titleColor: "700",
  subtitleColor: "700",
  cardBg: "background",
  iconBg: "100",
  iconColor: "700",
  cardTitleColor: "700",
  cardDescriptionColor: "600",
  buttonBg: "primary-1",
  buttonHoverBg: "primary-800",
  buttonFocusRing: "primary-1",
  buttonText: "50",
  arrowBg: "primary-1",
  arrowColor: "50",
  footerColor: "primary-1",
  titleFontWeight: "bold",
  cardTitleFontWeight: "bold",
};

export function resolveContactCardsStyle(style = {}) {
  return { ...DEFAULT_CONTACT_CARDS_STYLE, ...style };
}

export const CONTACT_CARDS_STYLE_RESET_KEYS = {
  header: [
    "showHeader",
    "showTitle",
    "showSubtitle",
    "titleAlign",
    "titleColor",
    "titleFontWeight",
    "subtitleColor",
  ],
  layout: [
    "variant",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "columns",
    "cardGap",
    "showFooterLink",
    "footerColor",
  ],
  cards: [
    "cardBg",
    "iconBg",
    "iconColor",
    "cardTitleColor",
    "cardTitleFontWeight",
    "cardDescriptionColor",
    "buttonBg",
    "buttonHoverBg",
    "buttonFocusRing",
    "buttonText",
    "arrowBg",
    "arrowColor",
  ],
};
