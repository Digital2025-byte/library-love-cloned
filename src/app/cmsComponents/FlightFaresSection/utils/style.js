export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
];

export const COLUMNS_ORDER_OPTIONS = [
  { value: "stack-tall-wide", label: "Stack · Tall · Wide" },
  { value: "tall-stack-wide", label: "Tall · Stack · Wide" },
  { value: "stack-wide-tall", label: "Stack · Wide · Tall" },
  { value: "wide-stack-tall", label: "Wide · Stack · Tall" },
  { value: "tall-wide-stack", label: "Tall · Wide · Stack" },
  { value: "wide-tall-stack", label: "Wide · Tall · Stack" },
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

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6 lg:py-8",
  default: "py-8 sm:py-10 lg:py-12",
  loose: "py-12 sm:py-14 lg:py-16",
};

const FEATURED_COLUMN_DEFS = {
  stack: {
    tracks: ["1.4fr"],
    cells: [
      { index: 0, row: 1, colOffset: 0, colSpan: 1, rowSpan: 1 },
      { index: 1, row: 2, colOffset: 0, colSpan: 1, rowSpan: 1 },
    ],
  },
  tall: {
    tracks: ["1.7fr"],
    cells: [
      { index: 2, row: 1, colOffset: 0, colSpan: 1, rowSpan: 2 },
    ],
  },
  wide: {
    tracks: ["1.1fr", "1.1fr"],
    cells: [
      { index: 3, row: 1, colOffset: 0, colSpan: 2, rowSpan: 1 },
      { index: 4, row: 2, colOffset: 0, colSpan: 1, rowSpan: 1 },
      { index: 5, row: 2, colOffset: 1, colSpan: 1, rowSpan: 1 },
    ],
  },
};

const DEFAULT_COLUMNS_ORDER = "stack-tall-wide";

export function parseColumnsOrder(value) {
  const parts = String(value || DEFAULT_COLUMNS_ORDER).split("-");
  const valid = parts.filter((part) => FEATURED_COLUMN_DEFS[part]);
  const unique = [...new Set(valid)];
  if (unique.length === 3) return unique;
  return DEFAULT_COLUMNS_ORDER.split("-");
}

export function buildFeaturedDesktopLayout(columnsOrder) {
  const order = parseColumnsOrder(columnsOrder);
  const tracks = [];
  const slots = [];
  let colStart = 1;

  order.forEach((key) => {
    const column = FEATURED_COLUMN_DEFS[key];
    const start = colStart;
    tracks.push(...column.tracks);

    column.cells.forEach((cell) => {
      const columnStart = start + cell.colOffset;
      slots.push({
        index: cell.index,
        gridColumn: `${columnStart} / span ${cell.colSpan}`,
        gridRow: `${cell.row} / span ${cell.rowSpan}`,
      });
    });

    colStart += column.tracks.length;
  });

  return {
    gridTemplateColumns: tracks.join(" "),
    slots,
  };
}

export const DEFAULT_FLIGHT_FARES_STYLE = {
  showTitle: true,
  showSectionBg: true,
  showImage: true,
  showOverlay: true,
  showTopBadge: true,
  showExtraBadge: true,
  showItemTitle: true,
  showSubtitle: true,
  sectionBg: "white",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  columnsOrder: DEFAULT_COLUMNS_ORDER,
  cardRadius: "lg",
  overlayColor: "secondary-2",
  itemTitleColor: "primary-3",
  subtitleColor: "white",
  badgeColor: "secondary-2",
  badgeText: "white",
  titleFontWeight: "semibold",
  subtitleFontWeight: "medium",
  itemTitleFontWeight: "semibold",
  badgeTextFontWeight: "medium",
};

export function resolveFlightFaresStyle(style = {}) {
  const {
    showNew,
    showOneWay,
    showBadge,
    showCity,
    showPrice,
    cityColor,
    priceColor,
    columnsLayout,
    ...rest
  } = style;

  const columnsOrder = COLUMNS_ORDER_OPTIONS.some(
    (option) => option.value === rest.columnsOrder
  )
    ? rest.columnsOrder
    : DEFAULT_FLIGHT_FARES_STYLE.columnsOrder;

  return {
    ...DEFAULT_FLIGHT_FARES_STYLE,
    ...rest,
    columnsOrder,
    showTopBadge:
      rest.showTopBadge !== undefined
        ? rest.showTopBadge
        : showOneWay !== undefined
          ? showOneWay
          : DEFAULT_FLIGHT_FARES_STYLE.showTopBadge,
    showExtraBadge:
      rest.showExtraBadge !== undefined
        ? rest.showExtraBadge
        : showBadge !== undefined
          ? showBadge
          : showNew !== undefined
            ? showNew
            : DEFAULT_FLIGHT_FARES_STYLE.showExtraBadge,
    showItemTitle:
      rest.showItemTitle !== undefined
        ? rest.showItemTitle
        : showCity !== undefined
          ? showCity
          : DEFAULT_FLIGHT_FARES_STYLE.showItemTitle,
    showSubtitle:
      rest.showSubtitle !== undefined
        ? rest.showSubtitle
        : showPrice !== undefined
          ? showPrice
          : DEFAULT_FLIGHT_FARES_STYLE.showSubtitle,
    itemTitleColor:
      rest.itemTitleColor || cityColor || DEFAULT_FLIGHT_FARES_STYLE.itemTitleColor,
    subtitleColor:
      rest.subtitleColor || priceColor || DEFAULT_FLIGHT_FARES_STYLE.subtitleColor,
  };
}

export const FLIGHT_FARES_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "titleAlign",
    "titleColor", "titleFontWeight",
    "columnsOrder",
  ],
  cards: [
    "showImage",
    "showOverlay",
    "showTopBadge",
    "showExtraBadge",
    "showItemTitle",
    "showSubtitle",
    "cardRadius",
    "overlayColor",
    "itemTitleColor", "itemTitleFontWeight",
    "subtitleColor", "subtitleFontWeight",
    "badgeColor",
    "badgeText", "badgeTextFontWeight",
  ],
};
