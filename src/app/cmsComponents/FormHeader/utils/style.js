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
  tight: "py-2",
  default: "py-4",
  loose: "py-8",
};

export const DEFAULT_FORM_HEADER_STYLE = {
  showBanner: true,
  showPromo: true,
  showTitle: true,
  showDescription: true,
  showCta: true,
  showSectionBg: false,
  sectionBg: "white",
  sectionPadding: "default",
  titleAlign: "center",
  titleColor: "main",
  descriptionColor: "main",
  ctaBg: "primary-1",
  ctaText: "50",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
};

export function resolveFormHeaderStyle(style = {}) {
  return {
    ...DEFAULT_FORM_HEADER_STYLE,
    ...style,
  };
}

export const FORM_HEADER_STYLE_RESET_KEYS = {
  layout: [
    "showBanner",
    "showPromo",
    "showTitle",
    "showDescription",
    "showCta",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  button: ["ctaBg", "ctaText"],
};
