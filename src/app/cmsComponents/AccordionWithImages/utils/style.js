import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
];

export const ITEM_LOOK_OPTIONS = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
];

export const ITEM_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const IMAGE_POSITION_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
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

export const ITEM_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-sm",
  lg: "rounded-xl",
  full: "rounded-2xl",
};

export const ITEM_GAP_CLASS = {
  tight: "gap-2 sm:gap-4",
  default: "gap-3 sm:gap-4",
  loose: "gap-5 sm:gap-6",
};

export const ITEM_PADDING_CLASS = {
  tight: "p-3 sm:p-4",
  default: "p-4 sm:p-5",
  loose: "p-5 sm:p-6",
};

export const DEFAULT_ACCORDION_IMAGES_STYLE = {
  showTitleDescription: true,
  showDescription: true,
  showTitleBorder: true,
  showImagePanel: true,
  sectionBg: "background",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  itemLook: "filled",
  itemBg: "background",
  itemRadius: "none",
  itemGap: "tight",
  itemPadding: "tight",
  showItemDivider: true,
  itemTitleColor: "800",
  itemOpenColor: "primary-1",
  itemBodyColor: "700",
  imagePosition: "right",
  imageRadius: "lg",
  imageBg: "100",
  toggleBg: "primary-1",
  toggleBorder: "secondary-1",
  toggleIcon: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  itemTitleFontWeight: "semibold",
  itemBodyFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveAccordionImagesStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_ACCORDION_IMAGES_STYLE, ...style },
    DEFAULT_ACCORDION_IMAGES_STYLE
  );
}

export const ACCORDION_IMAGES_STYLE_RESET_KEYS = {
  layout: [
    "showTitleDescription",
    "showDescription",
    "showImagePanel",
    "sectionBg",
  ],
  title: [
    "titleAlign",
    "showTitleBorder",
    "titleColor",
    "titleFontWeight",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  items: [
    "itemLook",
    "itemBg",
    "itemRadius",
    "itemGap",
    "itemPadding",
    "showItemDivider",
    "itemTitleColor",
    "itemTitleFontWeight",
    "itemOpenColor",
    "itemBodyColor",
    "itemBodyFontWeight",
  ],
  image: ["imagePosition", "imageRadius", "imageBg"],
  toggle: ["toggleBg", "toggleBorder", "toggleIcon"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
