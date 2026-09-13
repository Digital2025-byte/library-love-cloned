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

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6 lg:py-8",
  default: "py-8 sm:py-12 lg:py-16",
  loose: "py-12 sm:py-16 lg:py-20",
};

export const CARD_GAP_CLASS = {
  tight: "gap-2 sm:gap-3",
  default: "gap-4",
  loose: "gap-6 sm:gap-8",
};

export const DEFAULT_SIMPLE_GRID_STYLE = {
  showTitle: true,
  showDescription: true,
  showSectionBg: true,
  showIcon: true,
  showPrefix: true,
  showChip: true,
  showUserName: true,
  showArrow: true,
  showCardBg: true,
  sectionBg: "surface-1",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "primary-1",
  cardRadius: "sm",
  cardGap: "default",
  cardBg: "white",
  nameColor: "secondary-2",
  chipBg: "secondary-100",
  chipText: "primary-2",
  userNameColor: "icon",
  arrowColor: "primary-1",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  nameFontWeight: "semibold",
  userNameFontWeight: "medium",
  chipTextFontWeight: "medium",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveSimpleGridStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_SIMPLE_GRID_STYLE, ...style },
    DEFAULT_SIMPLE_GRID_STYLE
  );
}

export const SIMPLE_GRID_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  cards: [
    "showIcon",
    "showPrefix",
    "showChip",
    "showUserName",
    "showArrow",
    "showCardBg",
    "cardRadius",
    "cardGap",
    "cardBg",
    "nameColor", "nameFontWeight",
    "chipBg",
    "chipText", "chipTextFontWeight",
    "userNameColor", "userNameFontWeight",
    "arrowColor",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
