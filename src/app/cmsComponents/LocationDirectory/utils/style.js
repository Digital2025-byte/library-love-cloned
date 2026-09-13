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
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
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

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-3xl",
};

export const COLUMNS_CLASS = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
};

export const DEFAULT_LOCATION_DIRECTORY_STYLE = {
  showHeader: true,
  showTitle: true,
  showSubtitle: true,
  showCity: true,
  showAddress: true,
  showPhone: true,
  showEmail: true,
  showHours: true,
  showCardBg: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  columns: "2",
  cardGap: "default",
  cardRadius: "lg",
  titleAlign: "left",
  titleColor: "700",
  subtitleColor: "600",
  activeTabColor: "primary-1",
  inactiveTabColor: "600",
  cardBg: "background",
  nameColor: "700",
  metaColor: "600",
  linkColor: "primary-1",
  titleFontWeight: "semibold",
  nameFontWeight: "semibold",
  showMap: false,
  mapSide: "right",
  mapHeight: "default",
  mapRadius: "lg",
  mapPinColor: "primary-1",
  mapZoom: 12,
};

export const MAP_SIDE_OPTIONS = [
  { value: "right", label: "Right" },
  { value: "left", label: "Left" },
];

export const MAP_HEIGHT_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "tall", label: "Tall" },
];

export const MAP_HEIGHT_CLASS = {
  compact: "h-[260px] md:h-[340px]",
  default: "h-[300px] md:h-[440px] lg:h-[560px]",
  tall: "h-[360px] md:h-[520px] lg:h-[640px]",
};

export function resolveLocationDirectoryStyle(style = {}) {
  return { ...DEFAULT_LOCATION_DIRECTORY_STYLE, ...style };
}

export const LOCATION_DIRECTORY_STYLE_RESET_KEYS = {
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
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "columns",
    "cardGap",
    "activeTabColor",
    "inactiveTabColor",
  ],
  cards: [
    "showCity",
    "showAddress",
    "showPhone",
    "showEmail",
    "showHours",
    "showCardBg",
    "cardBg",
    "cardRadius",
    "nameColor",
    "nameFontWeight",
    "metaColor",
    "linkColor",
  ],
  map: ["showMap", "mapSide", "mapHeight", "mapRadius", "mapPinColor", "mapZoom"],
};
