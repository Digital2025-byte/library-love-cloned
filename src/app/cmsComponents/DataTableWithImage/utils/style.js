export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
];

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Small" },
  { value: "lg", label: "Rounded" },
  { value: "full", label: "Pill" },
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

export const TABLE_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 lg:py-8",
  default: "py-8 lg:py-12",
  loose: "py-12 lg:py-16",
};

export const DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE = {
  showTitle: true,
  showDescription: true,
  showTable: true,
  showImage: true,
  showSectionBg: true,
  sectionBg: "100",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "primary-1",
  tableBg: "white",
  headerColor: "700",
  cellColor: "700",
  stripeColor: "primary-2",
  tableRadius: "sm",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
};

export function resolveDataTableWithImageStyle(style = {}) {
  return {
    ...DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE,
    ...style,
  };
}

export const DATA_TABLE_WITH_IMAGE_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showTable",
    "showImage",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  table: [
    "tableBg",
    "headerColor",
    "cellColor",
    "stripeColor",
    "tableRadius",
  ],
};
