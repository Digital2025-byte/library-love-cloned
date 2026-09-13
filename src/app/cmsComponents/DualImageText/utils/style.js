import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
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

export const DEFAULT_DUAL_IMAGE_TEXT_STYLE = {
  showTitle: true,
  showDescription: true,
  showSectionBg: true,
  sectionBg: "100",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  underlineFirstWord: false,
  blueLayer: false,
  animate: false,
  showExploreButton: false,
  showFirstSection: false,
  showExtraImage: false,
  buttonBg: "primary-2",
  buttonText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveDualImageTextStyle(style = {}) {
  const merged = {
    ...DEFAULT_DUAL_IMAGE_TEXT_STYLE,
    ...style,
  };

  if (style.bgColor && !style.sectionBg) {
    merged.sectionBg = String(style.bgColor).replace(/^bg-/, "");
  }

  return resolveBacklinkStyle(merged, DEFAULT_DUAL_IMAGE_TEXT_STYLE);
}

export const DUAL_IMAGE_TEXT_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "showFirstSection",
    "animate",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight", "underlineFirstWord"],
  images: ["blueLayer", "showExtraImage"],
  button: ["showExploreButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
