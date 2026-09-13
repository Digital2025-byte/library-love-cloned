export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const ITEM_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
];

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
  { value: "right", label: "End" },
];

export const TITLE_ALIGN_CLASS = {
  left: "text-start items-start",
  center: "text-center items-center",
  right: "text-end items-end",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-4 md:py-6",
  default: "py-6 md:py-10",
  loose: "py-10 md:py-16",
};

export const ITEM_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-xl",
};

export const DEFAULT_FAQ_EXPLORER_STYLE = {
  showTitle: true,
  showBrowse: true,
  showItemBg: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "700",
  activeTabColor: "primary-1",
  inactiveTabColor: "600",
  itemBg: "background",
  itemRadius: "lg",
  questionColor: "700",
  answerColor: "600",
  iconColor: "700",
  browseBg: "secondary",
  browseText: "btn",
  titleFontWeight: "semibold",
  questionFontWeight: "medium",
};

export function resolveFaqExplorerStyle(style = {}) {
  return { ...DEFAULT_FAQ_EXPLORER_STYLE, ...style };
}

export const FAQ_EXPLORER_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "titleAlign",
    "titleColor",
    "titleFontWeight",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "activeTabColor",
    "inactiveTabColor",
  ],
  items: [
    "showItemBg",
    "itemBg",
    "itemRadius",
    "questionColor",
    "questionFontWeight",
    "answerColor",
    "iconColor",
  ],
  browse: ["showBrowse", "browseBg", "browseText"],
};
