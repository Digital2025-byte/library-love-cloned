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
  lg: "rounded-[1.25rem]",
  full: "rounded-3xl",
};

export const CARD_RADIUS_TOP_CLASS = {
  none: "rounded-t-none",
  sm: "rounded-t-xl",
  lg: "rounded-t-[1.25rem]",
  full: "rounded-t-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6 lg:py-8",
  default: "py-8 sm:py-10 lg:py-12",
  loose: "py-12 sm:py-14 lg:py-16",
};

export function resolveRelatedContentStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_RELATED_CONTENT_STYLE, ...style },
    DEFAULT_RELATED_CONTENT_STYLE
  );
}

export const DEFAULT_RELATED_CONTENT_STYLE = {
  showTitle: true,
  showDescription: false,
  showArrows: true,
  showCardImage: true,
  showCardTitle: true,
  showCardDescription: true,
  showButton: true,
  sectionBg: "50",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  cardBg: "white",
  cardRadius: "lg",
  cardTitleColor: "secondary-2",
  cardBodyColor: "600",
  buttonBg: "primary-1",
  buttonText: "primary-1",
  buttonOnFill: "white",
  navColor: "primary-1",
  navTrack: "200",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  cardBodyFontWeight: "normal",
  cardTitleFontWeight: "semibold",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export const RELATED_CONTENT_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showArrows",
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
    "cardBg",
    "cardRadius",
    "cardTitleColor",
    "cardTitleFontWeight",
    "cardBodyColor",
    "cardBodyFontWeight",
  ],
  button: [
    "showButton",
    "buttonBg",
    "buttonText",
    "buttonTextFontWeight",
    "buttonOnFill",
  ],
  nav: ["navColor", "navTrack"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
