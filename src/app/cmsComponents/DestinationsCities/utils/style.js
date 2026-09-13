import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

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

export const CARD_RADIUS_BOTTOM_CLASS = {
  none: "rounded-b-none",
  sm: "rounded-b-xl",
  lg: "rounded-b-2xl",
  full: "rounded-b-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-2 pt-4",
  default: "py-2 pt-8",
  loose: "py-6 pt-12 lg:pt-16",
};

export const DEFAULT_DESTINATIONS_CITIES_STYLE = {
  showTitle: true,
  showDescription: true,
  showSectionBg: true,
  showCardImage: true,
  showCity: true,
  showOrigin: true,
  showNew: true,
  showFlights: true,
  showDuration: true,
  showCardDescription: true,
  showPanel: true,
  showInactiveDim: true,
  showButton: true,
  sectionBg: "primary-800",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "50",
  descriptionColor: "50",
  cardRadius: "full",
  cityColor: "50",
  originColor: "50",
  originBg: "900",
  metaColor: "50",
  bodyColor: "50",
  panelBg: "secondary-2",
  overlayColor: "secondary-2",
  buttonBg: "main",
  buttonText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  bodyFontWeight: "normal",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveDestinationsCitiesStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_DESTINATIONS_CITIES_STYLE, ...style },
    DEFAULT_DESTINATIONS_CITIES_STYLE
  );
}

export const DESTINATIONS_CITIES_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  cards: [
    "showCardImage",
    "showCity",
    "showOrigin",
    "showNew",
    "showFlights",
    "showDuration",
    "showCardDescription",
    "showPanel",
    "showInactiveDim",
    "cardRadius",
    "cityColor",
    "originColor",
    "originBg",
    "metaColor",
    "bodyColor", "bodyFontWeight",
    "panelBg",
    "overlayColor",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
