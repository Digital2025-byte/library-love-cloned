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
  tight: "py-6 sm:py-8 lg:py-10",
  default: "py-10 sm:py-12 lg:py-16",
  loose: "py-14 sm:py-16 lg:py-20",
};

export const DEFAULT_TEXT_WITH_BLOB_STYLE = {
  showTitle: true,
  showDescription: true,
  showImage: true,
  showSectionBg: true,
  sectionBg: "100",
  sectionPadding: "default",
  imageSide: "right",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveTextWithBlobStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_TEXT_WITH_BLOB_STYLE, ...style },
    DEFAULT_TEXT_WITH_BLOB_STYLE
  );
}

export const TEXT_WITH_BLOB_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "imageSide",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  images: ["showImage"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
