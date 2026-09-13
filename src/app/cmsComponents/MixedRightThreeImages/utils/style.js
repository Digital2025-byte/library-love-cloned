import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
];

export const IMAGE_SIDE_OPTIONS = [
  { value: "right", label: "Right" },
  { value: "left", label: "Left" },
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
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 md:py-8 lg:py-10",
  default: "py-8 md:py-12 lg:py-14",
  loose: "py-12 md:py-16 lg:py-20",
};

export const DEFAULT_MIXED_THREE_IMAGES_STYLE = {
  showTitle: true,
  showDescription: true,
  showPrimary: true,
  showSecondary: true,
  showLargeImage: true,
  showSmallImages: true,
  showSectionBg: true,
  sectionBg: "primary-800",
  sectionPadding: "default",
  imageSide: "right",
  titleAlign: "left",
  titleColor: "white",
  descriptionColor: "white",
  imageRadius: "full",
  primaryBg: "primary-2",
  primaryText: "white",
  secondaryText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  primaryTextFontWeight: "semibold",
  secondaryTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveMixedThreeImagesStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_MIXED_THREE_IMAGES_STYLE, ...style },
    DEFAULT_MIXED_THREE_IMAGES_STYLE
  );
}

export const MIXED_THREE_IMAGES_LAYOUT_CLASS = {
  left: {
    content: "order-1 lg:order-2 lg:col-start-2 lg:row-start-1",
    small: "order-2 lg:order-3 lg:col-start-2 lg:row-start-2",
    feature:
      "order-3 aspect-[16/10] h-auto lg:order-1 lg:col-start-1 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-[34rem]",
  },
  right: {
    content: "order-1 lg:col-start-1 lg:row-start-1",
    small: "order-2 lg:order-3 lg:col-start-1 lg:row-start-2",
    feature:
      "order-3 aspect-[16/10] h-auto lg:order-2 lg:col-start-2 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-[34rem]",
  },
};

export const MIXED_THREE_IMAGES_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "imageSide",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  images: ["showLargeImage", "showSmallImages", "imageRadius"],
  button: ["showPrimary", "showSecondary", "primaryBg", "primaryText", "primaryTextFontWeight", "secondaryText", "secondaryTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
