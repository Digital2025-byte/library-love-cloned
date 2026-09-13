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
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const CARD_PADDING_CLASS = {
  tight: "px-2 py-3 sm:px-3 sm:py-4",
  default: "px-3 py-4 sm:px-4 sm:py-5",
  loose: "px-5 py-6 sm:px-6 sm:py-7",
};

export const CARD_GAP_CLASS = {
  tight: "gap-3 lg:gap-4",
  default: "gap-4 lg:gap-5",
  loose: "gap-6 lg:gap-8",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 md:py-8",
  default: "py-8 md:py-12",
  loose: "py-12 md:py-16",
};

export function resolveServiceCardsStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_SERVICE_CARDS_STYLE, ...style },
    DEFAULT_SERVICE_CARDS_STYLE
  );
}

export const DEFAULT_SERVICE_CARDS_STYLE = {
  showTitle: true,
  showDescription: true,
  showItemTitle: true,
  showItemDescription: true,
  showIcon: true,
  showArrow: true,
  sectionBg: "white",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "secondary-2",
  cardBg: "white",
  cardRadius: "lg",
  cardPadding: "default",
  cardGap: "default",
  iconBg: "100",
  itemTitleColor: "secondary-2",
  itemBodyColor: "icon",
  arrowColor: "icon",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  itemTitleFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export const SERVICE_CARDS_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  cards: [
    "showItemTitle",
    "showItemDescription",
    "showIcon",
    "showArrow",
    "cardBg",
    "cardRadius",
    "cardPadding",
    "cardGap",
    "iconBg",
    "itemTitleColor", "itemTitleFontWeight",
    "itemBodyColor",
    "arrowColor",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
