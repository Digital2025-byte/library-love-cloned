export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
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

export const DEFAULT_MAP_INFO_STYLE = {
  showTitle: true,
  showDescription: true,
  showCountries: true,
  showCities: true,
  showOffices: true,
  showName: true,
  showAddress: true,
  showPhone: true,
  showEmail: true,
  showHours: true,
  showMap: true,
  showSectionBg: true,
  showCardBg: true,
  sectionBg: "white",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "main",
  descriptionColor: "main",
  chipColor: "primary-1",
  chipActiveText: "white",
  chipIdleBg: "white",
  tabColor: "primary-1",
  cardRadius: "lg",
  cardBg: "white",
  nameColor: "main",
  bodyColor: "secondary-2",
  iconColor: "primary-2",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  nameFontWeight: "semibold",
  bodyFontWeight: "normal",
  chipActiveTextFontWeight: "medium",
  tabFontWeight: "medium",
};

export function resolveMapInfoStyle(style = {}) {
  return {
    ...DEFAULT_MAP_INFO_STYLE,
    ...style,
  };
}

export const MAP_INFO_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showCountries",
    "showCities",
    "showOffices",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  tabs: ["chipColor", "chipActiveText", "chipActiveTextFontWeight", "chipIdleBg", "tabColor", "tabFontWeight"],
  details: [
    "showName",
    "showAddress",
    "showPhone",
    "showEmail",
    "showHours",
    "showMap",
    "showCardBg",
    "cardRadius",
    "cardBg",
    "nameColor", "nameFontWeight",
    "bodyColor", "bodyFontWeight",
    "iconColor",
  ],
};
