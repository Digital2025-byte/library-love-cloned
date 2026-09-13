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

export const IMAGE_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-2xl sm:rounded-3xl",
  lg: "rounded-3xl sm:rounded-4xl",
  full: "rounded-4xl",
};

export const OVERLAY_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl sm:rounded-2xl",
  lg: "rounded-2xl sm:rounded-3xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-6 sm:py-8 lg:py-10",
  default: "py-10 sm:py-14 lg:py-16",
  loose: "py-14 sm:py-16 lg:py-20",
};

export const DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE = {
  showTitle: true,
  showDescription: true,
  showSectionLabel: true,
  showSubSections: true,
  showImages: true,
  showCta: true,
  showSectionBg: true,
  sectionBg: "secondary-100",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "600",
  labelColor: "secondary-2",
  itemTitleColor: "secondary-2",
  itemBodyColor: "600",
  dividerColor: "600",
  imageRadius: "lg",
  buttonBg: "primary-1",
  buttonText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  itemTitleFontWeight: "semibold",
  buttonTextFontWeight: "semibold",
  labelFontWeight: "medium",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveTwoColumnWithSubSectionsStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE, ...style },
    DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE
  );
}

export const TWO_COLUMN_SUB_SECTIONS_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionLabel",
    "showSubSections",
    "showCta",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: [
    "titleAlign",
    "titleColor", "titleFontWeight",
    "descriptionColor", "descriptionFontWeight",
    "labelColor", "labelFontWeight",
  ],
  items: ["itemTitleColor", "itemTitleFontWeight", "itemBodyColor", "dividerColor"],
  images: ["showImages", "imageRadius"],
  button: ["showCta", "buttonBg", "buttonText", "buttonTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
