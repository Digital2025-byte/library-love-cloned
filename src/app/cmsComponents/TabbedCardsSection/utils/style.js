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
  left: "items-start text-start",
  center: "items-center text-center",
};

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6 lg:py-8",
  default: "py-8 sm:py-10 lg:py-12",
  loose: "py-12 sm:py-14 lg:py-16",
};

export const CARD_GAP_CLASS = {
  tight: "gap-2 sm:gap-3",
  default: "gap-4",
  loose: "gap-6 sm:gap-8",
};

export const DEFAULT_TABBED_CARDS_STYLE = {
  showTitle: true,
  showDescription: true,
  showTabs: true,
  showSectionBg: true,
  showImage: true,
  showCardTitle: true,
  showCardDescription: true,
  showCardBg: true,
  sectionBg: "white",
  sectionPadding: "default",
  titleAlign: "center",
  titleColor: "primary-1",
  descriptionColor: "primary-1",
  tabTrack: "200",
  tabActiveBg: "primary-1",
  tabActiveText: "white",
  tabIdleText: "primary-1",
  cardRadius: "full",
  cardGap: "default",
  cardBg: "primary-1",
  nameColor: "secondary-2",
  bodyColor: "600",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  nameFontWeight: "semibold",
  bodyFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveTabbedCardsStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_TABBED_CARDS_STYLE, ...style },
    DEFAULT_TABBED_CARDS_STYLE
  );
}

export const TABBED_CARDS_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showTabs",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  tabs: ["tabTrack", "tabActiveBg", "tabActiveText", "tabIdleText"],
  cards: [
    "showImage",
    "showCardTitle",
    "showCardDescription",
    "showCardBg",
    "cardRadius",
    "cardGap",
    "cardBg",
    "nameColor", "nameFontWeight",
    "bodyColor", "bodyFontWeight",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
