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

export const MAP_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-4 md:py-6",
  default: "py-8",
  loose: "py-12 md:py-16",
};

export const DEFAULT_DESTINATIONS_MAP_STYLE = {
  showSearch: true,
  showFilters: true,
  showReset: true,
  showBookNow: true,
  showSectionBg: true,
  sectionBg: "primary-800",
  sectionPadding: "default",
  mapRadius: "sm",
  searchBg: "white",
  filterBg: "white",
  filterText: "secondary-2",
  bookBg: "primary-2",
  bookText: "white",
};

export function resolveDestinationsMapStyle(style = {}) {
  return {
    ...DEFAULT_DESTINATIONS_MAP_STYLE,
    ...style,
  };
}

export const DESTINATIONS_MAP_STYLE_RESET_KEYS = {
  layout: [
    "showSearch",
    "showFilters",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "mapRadius",
  ],
  search: [
    "showReset",
    "showBookNow",
    "searchBg",
    "bookBg",
    "bookText",
  ],
  filters: ["filterBg", "filterText"],
};
