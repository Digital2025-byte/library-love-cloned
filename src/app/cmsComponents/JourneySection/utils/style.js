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

export const COLUMNS_OPTIONS = [
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
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

export const PANEL_PADDING_CLASS = {
  tight: "px-4 py-4 sm:px-6 sm:py-6",
  default: "px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12",
  loose: "px-6 py-10 sm:px-12 sm:py-14 md:px-16 md:py-16",
};

export const PANEL_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-3xl",
};

export const COLUMNS_CLASS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export const COLUMN_GAP_CLASS = {
  tight: "gap-4 lg:gap-6",
  default: "gap-6 lg:gap-10",
  loose: "gap-8 lg:gap-14",
};

export const DEFAULT_JOURNEY_SECTION_STYLE = {
  showHeader: true,
  showTitle: true,
  showSubtitle: true,
  showIcon: true,
  showPanelBg: true,
  showSectionBg: false,
  sectionBg: "100",
  sectionPadding: "default",
  panelPadding: "default",
  panelRadius: "lg",
  panelBg: "background",
  columns: "4",
  columnGap: "default",
  titleAlign: "left",
  titleColor: "700",
  subtitleColor: "600",
  iconBg: "100",
  iconColor: "700",
  stepTitleColor: "700",
  linkColor: "primary-1",
  titleFontWeight: "bold",
  stepTitleFontWeight: "semibold",
};

export function resolveJourneySectionStyle(style = {}) {
  return { ...DEFAULT_JOURNEY_SECTION_STYLE, ...style };
}

export const JOURNEY_SECTION_STYLE_RESET_KEYS = {
  header: [
    "showHeader",
    "showTitle",
    "showSubtitle",
    "titleAlign",
    "titleColor",
    "titleFontWeight",
    "subtitleColor",
  ],
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "showPanelBg",
    "panelBg",
    "panelPadding",
    "panelRadius",
    "columns",
    "columnGap",
  ],
  steps: [
    "showIcon",
    "iconBg",
    "iconColor",
    "stepTitleColor",
    "stepTitleFontWeight",
    "linkColor",
  ],
};
