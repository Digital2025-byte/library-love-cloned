export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const SECTION_PADDING_CLASS = {
  tight: "py-6 md:py-10",
  default: "py-8 md:py-14",
  loose: "py-12 md:py-20",
};

export const DEFAULT_GET_IN_TOUCH_STYLE = {
  showTitle: true,
  showImage: true,
  showLabel: true,
  showPhone: true,
  showHours: true,
  showNote: true,
  showSectionBg: true,
  sectionBg: "200",
  sectionPadding: "default",
  titleColor: "700",
  labelColor: "700",
  phoneColor: "primary-1",
  hoursColor: "700",
  noteColor: "700",
  titleFontWeight: "bold",
  phoneFontWeight: "bold",
};

export function resolveGetInTouchStyle(style = {}) {
  return { ...DEFAULT_GET_IN_TOUCH_STYLE, ...style };
}

export const GET_IN_TOUCH_STYLE_RESET_KEYS = {
  layout: ["showSectionBg", "sectionBg", "sectionPadding"],
  content: [
    "showTitle",
    "titleColor",
    "titleFontWeight",
    "showImage",
    "showLabel",
    "labelColor",
    "showPhone",
    "phoneColor",
    "phoneFontWeight",
    "showHours",
    "hoursColor",
    "showNote",
    "noteColor",
  ],
};
