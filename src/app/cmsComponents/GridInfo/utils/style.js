export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
  { value: "right", label: "End" },
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

export const TITLE_ALIGN_CLASS = {
  left: "text-start",
  center: "text-center",
  right: "text-end",
};

export const TITLE_ITEMS_CLASS = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

export const TITLE_JUSTIFY_CLASS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

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

export const CARD_GAP_CLASS = {
  tight: "gap-2 sm:gap-3",
  default: "gap-4 sm:gap-4.5",
  loose: "gap-6 sm:gap-8",
};

export const DEFAULT_GRID_INFO_STYLE = {
  showTitle: true,
  showDescription: true,
  showFilter: true,
  showSectionBg: true,
  showName: true,
  showAddress: true,
  showPhone: true,
  showEmail: true,
  showHours: true,
  showCardBg: true,
  sectionBg: "surface-2",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "primary-1",
  chipColor: "primary-1",
  chipActiveText: "white",
  chipIdleBg: "white",
  cardRadius: "sm",
  cardGap: "default",
  cardBg: "white",
  nameColor: "main",
  bodyColor: "secondary-2",
  iconColor: "primary-2",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  nameFontWeight: "semibold",
  bodyFontWeight: "normal",
  chipActiveTextFontWeight: "medium",
};

export function resolveGridInfoStyle(style = {}) {
  return {
    ...DEFAULT_GRID_INFO_STYLE,
    ...style,
  };
}

export const GRID_INFO_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showFilter",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "titleAlign",
  ],
  title: ["titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  filter: ["chipColor", "chipActiveText", "chipActiveTextFontWeight", "chipIdleBg"],
  cards: [
    "showName",
    "showAddress",
    "showPhone",
    "showEmail",
    "showHours",
    "showCardBg",
    "cardRadius",
    "cardGap",
    "cardBg",
    "nameColor", "nameFontWeight",
    "bodyColor", "bodyFontWeight",
    "iconColor",
  ],
};
