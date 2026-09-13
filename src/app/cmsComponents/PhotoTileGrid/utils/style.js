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
  lg: "rounded-2xl sm:rounded-3xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6",
  default: "py-8 sm:py-10 lg:py-12",
  loose: "py-12 sm:py-14 lg:py-16",
};

export const CARD_GAP_CLASS = {
  tight: "gap-3 sm:gap-4",
  default: "gap-4 sm:gap-6 lg:gap-8",
  loose: "gap-6 sm:gap-8 lg:gap-10",
};

export const DEFAULT_PHOTO_TILE_GRID_STYLE = {
  showTitle: true,
  showSectionBg: true,
  showCardImage: true,
  showCity: true,
  showIata: true,
  showCountry: true,
  showOverlay: true,
  showHoverDim: true,
  showButton: true,
  sectionBg: "primary-800",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "white",
  cardRadius: "lg",
  cardGap: "default",
  cityColor: "50",
  countryColor: "50",
  overlayColor: "secondary-2",
  buttonBg: "primary-2",
  buttonText: "white",
  titleFontWeight: "semibold",
  countryFontWeight: "medium",
  buttonTextFontWeight: "semibold",
};

export function resolvePhotoTileGridStyle(style = {}) {
  return {
    ...DEFAULT_PHOTO_TILE_GRID_STYLE,
    ...style,
  };
}

export const PHOTO_TILE_GRID_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight"],
  cards: [
    "showCardImage",
    "showCity",
    "showIata",
    "showCountry",
    "showOverlay",
    "showHoverDim",
    "cardRadius",
    "cardGap",
    "cityColor",
    "countryColor", "countryFontWeight",
    "overlayColor",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
};
