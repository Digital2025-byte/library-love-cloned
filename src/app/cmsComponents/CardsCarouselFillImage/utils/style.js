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

export function resolveFillImageStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_FILL_IMAGE_STYLE, ...style },
    DEFAULT_FILL_IMAGE_STYLE
  );
}

export const DEFAULT_FILL_IMAGE_STYLE = {
  showTitle: true,
  showDescription: true,
  showArrows: true,
  showSectionBg: true,
  showCardImage: true,
  showCardTitle: true,
  showCardDescription: true,
  showOverlay: true,
  showButton: true,
  sectionBg: "200",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  cardRadius: "lg",
  cardTitleColor: "white",
  cardBodyColor: "white",
  overlayColor: "foreground",
  buttonBg: "white",
  buttonText: "white",
  buttonOnFill: "primary-1",
  navColor: "primary-1",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  cardBodyFontWeight: "normal",
  cardTitleFontWeight: "semibold",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export const FILL_IMAGE_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showArrows",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: [
    "titleAlign",
    "titleColor",
    "titleFontWeight",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  cards: [
    "showCardImage",
    "showCardTitle",
    "showCardDescription",
    "showOverlay",
    "cardRadius",
    "cardTitleColor",
    "cardTitleFontWeight",
    "cardBodyColor",
    "cardBodyFontWeight",
    "overlayColor",
  ],
  button: [
    "showButton",
    "buttonBg",
    "buttonText",
    "buttonTextFontWeight",
    "buttonOnFill",
  ],
  nav: ["navColor"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
