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

export const DEFAULT_OFFICE_DIRECTORY_STYLE = {
  showPin: true,
  showDashedLine: true,
  showWeekend: true,
  showButtons: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  activeTabColor: "primary-1",
  inactiveTabColor: "600",
  pinBg: "secondary-700",
  pinColor: "700",
  lineColor: "secondary-700",
  nameColor: "700",
  rowColor: "800",
  linkColor: "800",
  dividerColor: "200",
  buttonColor: "primary-1",
  nameFontWeight: "semibold",
};

export function resolveOfficeDirectoryStyle(style = {}) {
  return { ...DEFAULT_OFFICE_DIRECTORY_STYLE, ...style };
}

export const OFFICE_DIRECTORY_STYLE_RESET_KEYS = {
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "activeTabColor",
    "inactiveTabColor",
  ],
  items: [
    "showPin",
    "showDashedLine",
    "showWeekend",
    "pinBg",
    "pinColor",
    "lineColor",
    "nameColor",
    "nameFontWeight",
    "rowColor",
    "linkColor",
    "dividerColor",
  ],
  buttons: ["showButtons", "buttonColor"],
};
