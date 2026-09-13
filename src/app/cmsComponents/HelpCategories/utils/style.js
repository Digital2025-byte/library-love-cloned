export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const COLUMNS_OPTIONS = [
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
  tight: "gap-2 md:gap-3",
  default: "gap-3 md:gap-5",
  loose: "gap-5 md:gap-8",
};

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-3xl",
};

export const COLUMNS_CLASS = {
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  5: "md:grid-cols-2 lg:grid-cols-5",
};

export const DEFAULT_HELP_CATEGORIES_STYLE = {
  showHeader: true,
  showSectionTitle: true,
  showSectionSubtitle: true,
  showIcon: true,
  showCardTitle: true,
  showCardDescription: true,
  showArrow: true,
  showCardBg: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  columns: "5",
  cardGap: "default",
  cardRadius: "lg",
  titleAlign: "left",
  sectionTitleColor: "700",
  sectionSubtitleColor: "600",
  cardBg: "background",
  iconBg: "100",
  iconColor: "700",
  cardTitleColor: "700",
  cardDescriptionColor: "600",
  arrowBg: "primary-1",
  arrowColor: "50",
  sectionTitleFontWeight: "bold",
  cardTitleFontWeight: "bold",
};

export function resolveHelpCategoriesStyle(style = {}) {
  return { ...DEFAULT_HELP_CATEGORIES_STYLE, ...style };
}

export const HELP_CATEGORIES_STYLE_RESET_KEYS = {
  header: [
    "showHeader",
    "showSectionTitle",
    "showSectionSubtitle",
    "titleAlign",
    "sectionTitleColor",
    "sectionSubtitleColor",
    "sectionTitleFontWeight",
  ],
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "columns",
    "cardGap",
  ],
  cards: [
    "showIcon",
    "showCardTitle",
    "showCardDescription",
    "showArrow",
    "showCardBg",
    "cardRadius",
    "cardBg",
    "iconBg",
    "iconColor",
    "cardTitleColor",
    "cardTitleFontWeight",
    "cardDescriptionColor",
    "arrowBg",
    "arrowColor",
  ],
};
