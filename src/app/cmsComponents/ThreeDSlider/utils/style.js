export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const HEIGHT_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "tall", label: "Tall" },
];

export const WHEEL_SPEED_OPTIONS = [
  { value: "slow", label: "Slow" },
  { value: "default", label: "Default" },
  { value: "fast", label: "Fast" },
];

export const DRAG_SPEED_OPTIONS = [
  { value: "gentle", label: "Gentle" },
  { value: "default", label: "Default" },
  { value: "snappy", label: "Snappy" },
];

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const HEIGHT_CLASS = {
  compact: "h-[60vh] min-h-[420px]",
  default: "h-[85vh] min-h-[560px]",
  tall: "h-screen min-h-[640px]",
};

export const WHEEL_SPEED_VALUE = {
  slow: 0.01,
  default: 0.03,
  fast: 0.06,
};

export const DRAG_SPEED_VALUE = {
  gentle: -0.08,
  default: -0.15,
  snappy: -0.25,
};

export function resolveThreeDSliderStyle(style = {}) {
  return {
    ...DEFAULT_THREE_D_SLIDER_STYLE,
    ...style,
  };
}

export const DEFAULT_THREE_D_SLIDER_STYLE = {
  showCardImage: true,
  showCardTitle: true,
  showNumber: true,
  showOverlay: true,
  showSectionBg: true,
  sectionBg: "foreground",
  sectionHeight: "default",
  cardRadius: "lg",
  cardTitleColor: "white",
  numberColor: "white",
  overlayColor: "foreground",
  wheelSpeed: "default",
  dragSpeed: "default",
  cardTitleFontWeight: "semibold",
  numberFontWeight: "bold",
};

export const THREE_D_SLIDER_STYLE_RESET_KEYS = {
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionHeight",
  ],
  cards: [
    "showCardImage",
    "showCardTitle",
    "showNumber",
    "showOverlay",
    "cardRadius",
    "cardTitleColor", "cardTitleFontWeight",
    "numberColor", "numberFontWeight",
    "overlayColor",
  ],
  motion: ["wheelSpeed", "dragSpeed"],
};
