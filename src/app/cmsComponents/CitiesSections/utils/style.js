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
  sm: "rounded-[12px]",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-8 lg:py-12",
  default: "py-12 lg:py-20",
  loose: "py-16 lg:py-24",
};

export const DEFAULT_CITIES_SECTIONS_STYLE = {
  showTitle: true,
  showDescription: true,
  showCta: true,
  showImages: true,
  showSectionBg: true,
  sectionBg: "primary-800",
  sectionPadding: "default",
  imageSide: "right",
  titleAlign: "left",
  titleColor: "primary-100",
  descriptionColor: "white",
  imageRadius: "sm",
  buttonBg: "primary-2",
  buttonText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveCitiesSectionsStyle(style = {}, { side } = {}) {
  return resolveBacklinkStyle(
    {
      ...DEFAULT_CITIES_SECTIONS_STYLE,
      ...style,
      ...(side != null ? { imageSide: side } : {}),
    },
    DEFAULT_CITIES_SECTIONS_STYLE
  );
}

export const CITIES_SECTIONS_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "imageSide",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  images: ["showImages", "imageRadius"],
  button: ["showCta", "buttonBg", "buttonText", "buttonTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
