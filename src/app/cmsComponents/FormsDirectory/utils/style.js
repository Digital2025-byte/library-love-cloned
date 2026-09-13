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
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

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

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const COLUMNS_CLASS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export const DEFAULT_FORMS_DIRECTORY_STYLE = {
  showTitle: true,
  showIcon: true,
  showCategory: true,
  showDescription: true,
  showArrow: true,
  showCardBg: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  columns: "3",
  cardGap: "default",
  cardRadius: "lg",
  titleColor: "primary-1",
  tabActiveBg: "primary-1",
  tabActiveText: "50",
  tabInactiveBg: "200",
  tabInactiveText: "700",
  cardBg: "background",
  iconBg: "100",
  iconColor: "700",
  cardTitleColor: "700",
  categoryColor: "primary-1",
  descriptionColor: "600",
  arrowBg: "primary-1",
  arrowColor: "50",
  titleFontWeight: "semibold",
  cardTitleFontWeight: "semibold",
};

export function resolveFormsDirectoryStyle(style = {}) {
  return { ...DEFAULT_FORMS_DIRECTORY_STYLE, ...style };
}

export const FORMS_DIRECTORY_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "titleColor",
    "titleFontWeight",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "columns",
    "cardGap",
    "tabActiveBg",
    "tabActiveText",
    "tabInactiveBg",
    "tabInactiveText",
  ],
  cards: [
    "showIcon",
    "showCategory",
    "showDescription",
    "showArrow",
    "showCardBg",
    "cardRadius",
    "cardBg",
    "iconBg",
    "iconColor",
    "cardTitleColor",
    "cardTitleFontWeight",
    "categoryColor",
    "descriptionColor",
    "arrowBg",
    "arrowColor",
  ],
};
