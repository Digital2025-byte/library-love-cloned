export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const SECTION_PADDING_CLASS = {
  tight: "py-4 md:py-6",
  default: "py-6 md:py-10",
  loose: "py-10 md:py-16",
};

export const DEFAULT_TRACK_REQUEST_STYLE = {
  showTitle: true,
  showSubtitle: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  titleColor: "700",
  subtitleColor: "600",
  buttonBg: "primary-1",
  buttonText: "50",
  titleFontWeight: "semibold",
  buttonFontWeight: "medium",
};

export function resolveTrackRequestStyle(style = {}) {
  return { ...DEFAULT_TRACK_REQUEST_STYLE, ...style };
}

export const TRACK_REQUEST_STYLE_RESET_KEYS = {
  layout: ["showSectionBg", "sectionBg", "sectionPadding"],
  text: [
    "showTitle",
    "titleColor",
    "titleFontWeight",
    "showSubtitle",
    "subtitleColor",
  ],
  button: ["buttonBg", "buttonText", "buttonFontWeight"],
};
