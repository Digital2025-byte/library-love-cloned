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
  tight: "mt-1 py-4 sm:py-6",
  default: "mt-1 py-6 sm:py-12",
  loose: "mt-1 py-10 sm:py-16",
};

export function resolveCarouselItemStyle(style = {}) {
  return {
    ...DEFAULT_CAROUSEL_ITEM_STYLE,
    ...style,
  };
}

export const DEFAULT_CAROUSEL_ITEM_STYLE = {
  showTitle: true,
  showArrows: true,
  showDots: true,
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
  cityColor: "50",
  countryColor: "50",
  overlayColor: "secondary-2",
  buttonBg: "primary-2",
  buttonText: "white",
  navColor: "white",
  dotColor: "primary-2",
  titleFontWeight: "semibold",
  countryFontWeight: "medium",
  buttonTextFontWeight: "semibold",
};

export const CAROUSEL_ITEM_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showArrows",
    "showDots",
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
    "cityColor",
    "countryColor", "countryFontWeight",
    "overlayColor",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
  nav: ["navColor", "dotColor"],
};
