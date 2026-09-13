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

export const CARD_SIZE_OPTIONS = [
  { value: "mixed", label: "Mixed" },
  { value: "compact", label: "Compact" },
  { value: "wide", label: "Wide" },
];

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const SPEED_OPTIONS = [
  { value: "10", label: "Fast" },
  { value: "15", label: "Default" },
  { value: "20", label: "Steady" },
  { value: "30", label: "Slow" },
  { value: "45", label: "Very slow" },
];

export const TITLE_ALIGN_CLASS = {
  left: "items-start text-start",
  center: "items-center text-center",
};

export const CARD_RADIUS_VALUE = {
  none: "0px",
  sm: "0.5rem",
  lg: "1.125rem",
  full: "1.75rem",
};

export const CARD_GAP_VALUE = {
  tight: "0.75rem",
  default: "1.5rem",
  loose: "2.5rem",
};

export const ROW_GAP_CLASS = {
  tight: "gap-4",
  default: "gap-8",
  loose: "gap-12",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-6 sm:py-8",
  default: "py-10 sm:py-12 lg:py-16",
  loose: "py-14 sm:py-16 lg:py-20",
};

export function resolveOppositeScrollStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_OPPOSITE_SCROLL_STYLE, ...style },
    DEFAULT_OPPOSITE_SCROLL_STYLE
  );
}

export const DEFAULT_OPPOSITE_SCROLL_STYLE = {
  showTitleDescription: true,
  showDescription: true,
  showExploreButton: true,
  showSectionBg: true,
  showCardTitles: true,
  showOverlay: true,
  dimOnHover: true,
  pauseOnHover: false,
  reverseRows: false,
  sectionBg: "primary-800",
  sectionPadding: "default",
  titleAlign: "center",
  titleColor: "white",
  descriptionColor: "white",
  cardSize: "mixed",
  cardRadius: "lg",
  cardGap: "default",
  rowGap: "default",
  cardTitleColor: "white",
  overlayColor: "foreground",
  speed: "15",
  buttonBg: "white",
  buttonColor: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  cardTitleFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export const OPPOSITE_SCROLL_STYLE_RESET_KEYS = {
  layout: [
    "showTitleDescription",
    "showDescription",
    "showExploreButton",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  cards: [
    "showCardTitles",
    "showOverlay",
    "dimOnHover",
    "cardSize",
    "cardRadius",
    "cardGap",
    "rowGap",
    "cardTitleColor", "cardTitleFontWeight",
    "overlayColor",
  ],
  motion: ["pauseOnHover", "reverseRows", "speed"],
  button: ["buttonBg", "buttonColor"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
