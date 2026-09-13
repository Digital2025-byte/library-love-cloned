import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";
import {
  BACKGROUND_IMAGE_STYLE_RESET_KEYS,
  DEFAULT_BACKGROUND_IMAGE_STYLE,
  resolveBackgroundImageStyle,
} from "@/app/cmsComponents/shared/backgroundImage";

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
  { value: "right", label: "End" },
];

export const VERTICAL_ALIGN_OPTIONS = [
  { value: "top", label: "Top" },
  { value: "center", label: "Center" },
  { value: "bottom", label: "Bottom" },
];

export const HEIGHT_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "tall", label: "Tall" },
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
  right: "text-end",
};

export const TITLE_JUSTIFY_CLASS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export const TITLE_ITEMS_CLASS = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

export const BANNER_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-4 sm:py-5",
  default: "py-6 sm:py-8 lg:py-10",
  loose: "py-10 sm:py-12 lg:py-16",
};

export const VERTICAL_ALIGN_CLASS = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

export const HEIGHT_CLASS = {
  compact: "min-h-52 md:min-h-64 lg:min-h-72",
  default: "min-h-62.5 md:min-h-80 lg:min-h-103.75",
  tall: "min-h-72 md:min-h-96 lg:min-h-[32rem]",
};

export const DEFAULT_BANNER_WITH_CTA_STYLE = {
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: true,
  showHeroImage: true,
  showOverlay: true,
  sectionBg: "100",
  sectionPadding: "default",
  titleAlign: "left",
  verticalAlign: "center",
  bannerHeight: "default",
  titleColor: "white",
  descriptionColor: "white",
  overlayColor: "primary-1",
  bannerRadius: "lg",
  buttonBg: "primary-2",
  buttonText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKGROUND_IMAGE_STYLE,
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveBannerWithCtaStyle(style = {}) {
  return resolveBackgroundImageStyle(
    resolveBacklinkStyle(
      { ...DEFAULT_BANNER_WITH_CTA_STYLE, ...style },
      DEFAULT_BANNER_WITH_CTA_STYLE
    ),
    DEFAULT_BANNER_WITH_CTA_STYLE
  );
}

export const BANNER_WITH_CTA_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "titleAlign",
    "verticalAlign",
    "bannerHeight",
  ],
  title: ["titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  banner: [
    "showHeroImage",
    ...BACKGROUND_IMAGE_STYLE_RESET_KEYS,
    "showOverlay",
    "overlayColor",
    "bannerRadius",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
