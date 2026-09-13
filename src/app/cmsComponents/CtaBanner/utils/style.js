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
  compact: "min-h-[220px] md:min-h-[300px]",
  default: "min-h-[220px] sm:min-h-[360px] md:min-h-[400px]",
  tall: "min-h-[300px] sm:min-h-[440px] md:min-h-[520px]",
};

export const DEFAULT_CTA_BANNER_STYLE = {
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: false,
  showHeroImage: true,
  showOverlay: true,
  sectionBg: "100",
  sectionPadding: "default",
  titleAlign: "left",
  verticalAlign: "center",
  bannerHeight: "default",
  titleColor: "50",
  descriptionColor: "50",
  overlayColor: "main",
  bannerRadius: "lg",
  buttonBg: "secondary",
  buttonText: "btn",
  titleFontWeight: "semibold",
  descriptionFontWeight: "medium",
  buttonTextFontWeight: "semibold",
};

export function resolveCtaBannerStyle(style = {}) {
  return { ...DEFAULT_CTA_BANNER_STYLE, ...style };
}

export const CTA_BANNER_STYLE_RESET_KEYS = {
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
  title: [
    "titleColor",
    "titleFontWeight",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  banner: [
    "showHeroImage",
    "showOverlay",
    "overlayColor",
    "bannerRadius",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
};
