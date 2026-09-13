import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
];

export const OPEN_ON_OPTIONS = [
  { value: "click", label: "Click" },
  { value: "hover", label: "Hover" },
];

export const TITLE_ALIGN_CLASS = {
  left: "text-start",
  center: "text-center",
};

export function resolveCarouselImageTextStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE, ...style },
    DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE
  );
}

export const DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE = {
  showTitle: true,
  showSectionBg: true,
  showItemTitle: true,
  showItemDescription: true,
  grayscaleInactive: true,
  openOn: "click",
  sectionBg: "secondary-2",
  titleAlign: "center",
  titleColor: "white",
  showOverlay: true,
  overlayColor: "secondary-2",
  showPanelBg: true,
  panelColor: "main",
  showCardBg: true,
  cardBg: "secondary-2",
  itemTitleColor: "white",
  itemBodyColor: "white",
  titleFontWeight: "semibold",
  itemTitleFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export const CAROUSEL_IMAGE_TEXT_STYLE_RESET_KEYS = {
  layout: ["showTitle", "showSectionBg", "sectionBg"],
  title: ["titleAlign", "titleColor", "titleFontWeight"],
  cards: [
    "showItemTitle",
    "showItemDescription",
    "grayscaleInactive",
    "openOn",
    "showCardBg",
    "cardBg",
    "showOverlay",
    "overlayColor",
    "showPanelBg",
    "panelColor",
    "itemTitleColor", "itemTitleFontWeight",
    "itemBodyColor",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
