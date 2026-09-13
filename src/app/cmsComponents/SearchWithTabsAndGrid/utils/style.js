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
  tight: "py-5 lg:py-8",
  default: "py-8 lg:py-12",
  loose: "py-12 lg:py-16",
};

export const DEFAULT_SEARCH_GRID_STYLE = {
  showTitle: true,
  showSearch: true,
  showTabs: true,
  showSectionBg: true,
  showCardImage: true,
  showCity: true,
  showName: true,
  showTag: true,
  showOverlay: true,
  showButtons: true,
  showArrows: true,
  showDots: true,
  sectionBg: "main",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "white",
  searchBg: "white",
  searchText: "white",
  chipColor: "white",
  chipActiveText: "main",
  cardRadius: "full",
  overlayColor: "900",
  cityColor: "white",
  nameColor: "white",
  tagColor: "white",
  primaryBg: "primary-2",
  primaryText: "white",
  secondaryText: "white",
  navColor: "white",
  dotColor: "primary-2",
  titleFontWeight: "semibold",
  nameFontWeight: "semibold",
  chipActiveTextFontWeight: "medium",
  primaryTextFontWeight: "semibold",
  secondaryTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveSearchGridStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_SEARCH_GRID_STYLE, ...style },
    DEFAULT_SEARCH_GRID_STYLE
  );
}

export const SEARCH_GRID_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showSearch",
    "showTabs",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight"],
  search: ["searchBg", "searchText"],
  tabs: ["chipColor", "chipActiveText", "chipActiveTextFontWeight"],
  cards: [
    "showCardImage",
    "showCity",
    "showName",
    "showTag",
    "showOverlay",
    "cardRadius",
    "overlayColor",
    "cityColor",
    "nameColor", "nameFontWeight",
    "tagColor",
  ],
  button: ["showButtons", "primaryBg", "primaryText", "primaryTextFontWeight", "secondaryText", "secondaryTextFontWeight"],
  nav: ["showArrows", "showDots", "navColor", "dotColor"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
