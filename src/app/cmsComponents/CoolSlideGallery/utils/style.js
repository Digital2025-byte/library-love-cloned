export const OVERLAY_POSITION_OPTIONS = [
  { value: "top-left", label: "Top start" },
  { value: "top-right", label: "Top end" },
  { value: "center", label: "Center" },
  { value: "bottom-left", label: "Bottom start" },
  { value: "bottom-right", label: "Bottom end" },
];

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
];

export const CARD_RADIUS_VALUE = {
  none: 0,
  sm: 5,
  lg: 12,
  full: 20,
};

export const GALLERY_EXTRAS = {
  cardWidth: 360,
  cardHeight: 420,
  tilt: 14,
  sideTilt: 6,
  gap: 8,
  dimOpacity: 55,
  showCounter: false,
  clickable: true,
  draggable: true,
  keyboardNavigation: true,
  autoplay: false,
  animationDuration: 0.6,
  easing: "smooth",
  maxVisible: 2,
  depth: 230,
  scaleStep: 0.15,
  perspective: 1500,
};

export const DEFAULT_COOL_SLIDE_GALLERY_STYLE = {
  showTitle: true,
  showSubtitle: true,
  showBadge: true,
  showArrows: true,
  showDots: true,
  showSectionBg: true,
  sectionBg: "foreground",
  titleColor: "white",
  subtitleColor: "white",
  chipBg: "white",
  chipText: "white",
  overlayColor: "foreground",
  arrowsColor: "white",
  dotsColor: "white",
  controlsBg: "white",
  overlayPosition: "bottom-left",
  cardRadius: "sm",
  titleFontWeight: "semibold",
  subtitleFontWeight: "medium",
  chipTextFontWeight: "medium",
};

export function resolveCoolSlideGalleryStyle(style = {}) {
  return {
    ...DEFAULT_COOL_SLIDE_GALLERY_STYLE,
    ...style,
  };
}

export const COOL_SLIDE_GALLERY_STYLE_RESET_KEYS = {
  layout: ["showSectionBg", "sectionBg", "cardRadius"],
  controls: [
    "showArrows",
    "showDots",
    "arrowsColor",
    "dotsColor",
    "controlsBg",
  ],
  overlay: [
    "showTitle",
    "showSubtitle",
    "showBadge",
    "titleColor", "titleFontWeight",
    "subtitleColor", "subtitleFontWeight",
    "chipBg",
    "chipText", "chipTextFontWeight",
    "overlayColor",
    "overlayPosition",
  ],
};
