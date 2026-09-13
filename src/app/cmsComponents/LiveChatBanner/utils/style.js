export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const PANEL_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const SECTION_PADDING_CLASS = {
  tight: "py-3 md:py-4",
  default: "py-4 md:py-6",
  loose: "py-6 md:py-10",
};

export const PANEL_PADDING_CLASS = {
  tight: "px-4 py-4 md:px-6 md:py-4",
  default: "px-5 py-5 md:px-8 md:py-6",
  loose: "px-6 py-7 md:px-10 md:py-8",
};

export const PANEL_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const DEFAULT_LIVE_CHAT_BANNER_STYLE = {
  showIcon: true,
  showTitle: true,
  showDescription: true,
  showButton: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  panelPadding: "default",
  panelRadius: "lg",
  panelBg: "primary-1",
  panelBgOpacity: 10,
  iconColor: "700",
  titleColor: "700",
  descriptionColor: "800",
  buttonBg: "primary-1",
  buttonText: "50",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonFontWeight: "medium",
};

export function resolveLiveChatBannerStyle(style = {}) {
  return { ...DEFAULT_LIVE_CHAT_BANNER_STYLE, ...style };
}

export const OPACITY_OPTIONS = [
  { value: 10, label: "Soft" },
  { value: 20, label: "Medium" },
  { value: 100, label: "Solid" },
];

export const LIVE_CHAT_BANNER_STYLE_RESET_KEYS = {
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "panelPadding",
    "panelRadius",
    "panelBg",
    "panelBgOpacity",
  ],
  content: [
    "showIcon",
    "iconColor",
    "showTitle",
    "titleColor",
    "titleFontWeight",
    "showDescription",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonFontWeight"],
};
