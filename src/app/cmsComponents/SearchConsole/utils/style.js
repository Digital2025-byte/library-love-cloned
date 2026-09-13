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

export const GRADIENT_DIRECTION_OPTIONS = [
  { value: "topRight", label: "Top corner" },
  { value: "right", label: "Side" },
  { value: "bottom", label: "Down" },
];

export const PANEL_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-4 md:py-6",
  default: "py-6 md:py-10",
  loose: "py-10 md:py-16",
};

export const PANEL_PADDING_CLASS = {
  tight: "px-4 py-4 sm:px-8 sm:py-5",
  default: "px-4 py-5 sm:px-10 md:px-14 sm:py-8",
  loose: "px-6 py-8 sm:px-12 md:px-16 sm:py-12",
};

export function gradientCss(fromCss, toCss, direction, isRtl) {
  const dir =
    direction === "bottom"
      ? "to bottom"
      : direction === "right"
      ? isRtl
        ? "to left"
        : "to right"
      : isRtl
      ? "to top left"
      : "to top right";
  return `linear-gradient(${dir}, ${fromCss} 35%, ${toCss} 100%)`;
}

export const DEFAULT_SEARCH_CONSOLE_STYLE = {
  showLabel: true,
  showSubmit: true,
  showSearchIcon: true,
  showPopular: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  panelPadding: "default",
  panelRadius: "lg",
  gradientFrom: "primary-1",
  gradientTo: "secondary-2",
  gradientDirection: "topRight",
  labelColor: "50",
  inputBg: "background",
  inputTextColor: "700",
  submitBg: "secondary",
  submitTextColor: "700",
  popularLabelColor: "50",
  chipTextColor: "50",
  chipBorderColor: "50",
  labelFontWeight: "semibold",
  submitFontWeight: "semibold",
};

export function resolveSearchConsoleStyle(style = {}) {
  return { ...DEFAULT_SEARCH_CONSOLE_STYLE, ...style };
}

export const SEARCH_CONSOLE_STYLE_RESET_KEYS = {
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "panelPadding",
    "panelRadius",
  ],
  panel: [
    "gradientFrom",
    "gradientTo",
    "gradientDirection",
  ],
  field: [
    "showLabel",
    "labelColor",
    "labelFontWeight",
    "showSearchIcon",
    "inputBg",
    "inputTextColor",
    "showSubmit",
    "submitBg",
    "submitTextColor",
    "submitFontWeight",
  ],
  popular: [
    "showPopular",
    "popularLabelColor",
    "chipTextColor",
    "chipBorderColor",
  ],
};
