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

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const TITLE_ALIGN_CLASS = {
  left: "text-start",
  center: "text-center",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-6 sm:py-8 md:py-10 lg:py-12",
  default: "py-8 sm:py-12 md:py-16 lg:py-20",
  loose: "py-12 sm:py-16 md:py-20 lg:py-24",
};

export const DEFAULT_VERTICAL_IMAGE_SLICE_STYLE = {
  showTitle: true,
  showDescription: true,
  showImage: true,
  showSectionBg: true,
  sectionBg: "100",
  sectionPadding: "default",
  imageSide: "right",
  titleAlign: "left",
  titleColor: "secondary-2",
  highlightColor: "primary-2",
  descriptionColor: "700",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  highlightFontWeight: "bold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveVerticalImageSliceStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_VERTICAL_IMAGE_SLICE_STYLE, ...style },
    DEFAULT_VERTICAL_IMAGE_SLICE_STYLE
  );
}

export const VERTICAL_IMAGE_SLICE_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "imageSide",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "highlightColor", "highlightFontWeight", "descriptionColor", "descriptionFontWeight"],
  images: ["showImage"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
