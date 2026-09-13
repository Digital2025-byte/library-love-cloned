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
  sm: "rounded-md",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const IMAGE_RADIUS_CLASS = {
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

export const DEFAULT_MEALS_TABBED_STYLE = {
  showTitle: true,
  showTabs: true,
  showImage: true,
  showNotes: true,
  showSectionBg: true,
  showItemTitle: true,
  showItemDescription: true,
  sectionBg: "white",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  tabActive: "primary-1",
  tabIdle: "500",
  tabBorder: "surface-2",
  accordionRadius: "sm",
  headerBg: "primary-1",
  headerText: "white",
  bodyBg: "100",
  groupTitleColor: "primary-1",
  itemTitleColor: "primary-1",
  groupItemTitleColor: "primary-2",
  itemBodyColor: "600",
  itemBg: "white",
  stripeColor: "primary-2",
  notesColor: "primary-1",
  imageRadius: "full",
  titleFontWeight: "semibold",
  itemTitleFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveMealsTabbedStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_MEALS_TABBED_STYLE, ...style },
    DEFAULT_MEALS_TABBED_STYLE
  );
}

export const MEALS_TABBED_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showTabs",
    "showImage",
    "showNotes",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight"],
  tabs: ["tabActive", "tabIdle", "tabBorder"],
  accordion: [
    "accordionRadius",
    "headerBg",
    "headerText",
    "bodyBg",
    "groupTitleColor",
    "showItemTitle",
    "showItemDescription",
    "itemTitleColor", "itemTitleFontWeight",
    "groupItemTitleColor",
    "itemBodyColor",
    "itemBg",
    "stripeColor",
  ],
  notes: ["notesColor"],
  image: ["imageRadius"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
