export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const SECTION_PADDING_CLASS = {
  tight: "py-3",
  default: "py-5",
  loose: "py-8",
};

export const DEFAULT_FORM_FOOTER_STYLE = {
  showFollow: true,
  showDescription: true,
  showSocial: true,
  showContact: true,
  showCopyright: true,
  showSectionBg: true,
  sectionBg: "main",
  sectionPadding: "default",
  titleColor: "50",
  descriptionColor: "50",
  linkColor: "50",
  copyrightColor: "main",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
};

export function resolveFormFooterStyle(style = {}) {
  return {
    ...DEFAULT_FORM_FOOTER_STYLE,
    ...style,
  };
}

export const FORM_FOOTER_STYLE_RESET_KEYS = {
  layout: [
    "showFollow",
    "showDescription",
    "showSocial",
    "showContact",
    "showCopyright",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  copy: ["titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight", "linkColor", "copyrightColor"],
};
