import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-[28px]",
  full: "rounded-3xl",
};

export const DEFAULT_SCROLL_CAROUSEL_STYLE = {
  showTitle: true,
  showDescription: true,
  showCardImage: true,
  showOverlay: true,
  showProgress: true,
  showSectionBg: true,
  sectionBg: "foreground",
  titleColor: "white",
  descriptionColor: "white",
  cardRadius: "lg",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveScrollCarouselStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_SCROLL_CAROUSEL_STYLE, ...style },
    DEFAULT_SCROLL_CAROUSEL_STYLE
  );
}

export const SCROLL_CAROUSEL_STYLE_RESET_KEYS = {
  layout: [
    "showProgress",
    "showSectionBg",
    "sectionBg",
  ],
  cards: [
    "showCardImage",
    "showTitle",
    "showDescription",
    "showOverlay",
    "cardRadius",
    "titleColor", "titleFontWeight",
    "descriptionColor", "descriptionFontWeight",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
