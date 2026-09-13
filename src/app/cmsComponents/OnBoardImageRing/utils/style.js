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
  left: "",
  center: "items-center text-center md:flex-col md:items-center",
};

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "pt-4 sm:pt-6",
  default: "pt-8 sm:pt-12 lg:pt-16",
  loose: "pt-12 sm:pt-16 lg:pt-20",
};

export const CARD_GAP_VALUE = {
  tight: 0,
  default: 4,
  loose: 20,
};

export const DEFAULT_ON_BOARD_IMAGE_RING_STYLE = {
  showTitle: true,
  showDescription: true,
  showSectionBg: true,
  showCaptions: true,
  showOverlay: true,
  showCardImage: true,
  sectionBg: "primary-800",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "50",
  descriptionColor: "50",
  cardRadius: "none",
  cardGap: "default",
  captionColor: "white",
  overlayColor: "foreground",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveOnBoardImageRingStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_ON_BOARD_IMAGE_RING_STYLE, ...style },
    DEFAULT_ON_BOARD_IMAGE_RING_STYLE
  );
}

export const ON_BOARD_IMAGE_RING_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  cards: [
    "showCardImage",
    "showCaptions",
    "showOverlay",
    "cardRadius",
    "cardGap",
    "captionColor",
    "overlayColor",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
