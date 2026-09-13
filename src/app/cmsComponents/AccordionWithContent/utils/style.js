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

export const BUTTON_POSITION_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
  { value: "right", label: "End" },
];

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const BUTTON_VARIANT_OPTIONS = [
  { value: "primary", label: "Solid" },
  { value: "outline", label: "Outline" },
];

export const BUTTON_WIDTH_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "full", label: "Full" },
];

export const TITLE_ALIGN_CLASS = {
  left: "text-start",
  center: "text-center",
};

export const ITEM_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-sm",
  lg: "rounded-lg",
  full: "rounded-2xl",
};

export const ITEM_GAP_CLASS = {
  tight: "gap-2",
  default: "gap-3 sm:gap-4",
  loose: "gap-5 sm:gap-6",
};

export const ITEM_PADDING_CLASS = {
  tight: "px-3 py-3",
  default: "px-4 py-4 sm:px-5 sm:py-5 md:px-6",
  loose: "px-6 py-6",
};

export const DEFAULT_ACCORDION_STYLE = {
  showTitleDescription: true,
  showDescription: true,
  showButton: true,
  showSectionBg: true,
  sectionBg: "100",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  itemLook: "filled",
  showItemBg: true,
  itemBg: "white",
  itemRadius: "lg",
  itemGap: "default",
  itemPadding: "default",
  itemTitleColor: "800",
  itemOpenColor: "primary-1",
  itemBodyColor: "700",
  buttonPosition: "center",
  buttonVariant: "primary",
  buttonWidth: "auto",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  itemTitleFontWeight: "semibold",
  itemBodyFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveAccordionStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_ACCORDION_STYLE, ...style },
    DEFAULT_ACCORDION_STYLE
  );
}

export const ACCORDION_STYLE_RESET_KEYS = {
  layout: [
    "showTitleDescription",
    "showDescription",
    "showButton",
    "showSectionBg",
    "sectionBg",
  ],
  title: [
    "titleAlign",
    "titleColor",
    "titleFontWeight",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  items: [
    "itemLook",
    "showItemBg",
    "itemBg",
    "itemRadius",
    "itemGap",
    "itemPadding",
    "itemTitleColor",
    "itemTitleFontWeight",
    "itemOpenColor",
    "itemBodyColor",
    "itemBodyFontWeight",
  ],
  button: ["buttonPosition", "buttonVariant", "buttonWidth"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
