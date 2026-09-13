import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";
import {
  BACKGROUND_IMAGE_STYLE_RESET_KEYS,
  DEFAULT_BACKGROUND_IMAGE_STYLE,
  resolveBackgroundImageStyle,
} from "@/app/cmsComponents/shared/backgroundImage";

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

export const DEFAULT_HEADER_WITH_CITY_INFO_STYLE = {
  showTitle: true,
  showDescription: true,
  showCityCard: true,
  showHeroImage: true,
  showOverlay: true,
  showCardHeading: true,
  showCardDescription: true,
  showNextFlight: true,
  titleAlign: "left",
  titleColor: "white",
  descriptionColor: "white",
  overlayColor: "main",
  cardRadius: "lg",
  cardHeadingColor: "white",
  cardBodyColor: "white",
  tileLabelColor: "white",
  tileValueColor: "white",
  nextFlightColor: "primary-100",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  cardHeadingFontWeight: "semibold",
  cardBodyFontWeight: "normal",
  tileLabelFontWeight: "medium",
  tileValueFontWeight: "semibold",
  nextFlightFontWeight: "semibold",
  ...DEFAULT_BACKGROUND_IMAGE_STYLE,
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveHeaderWithCityInfoStyle(style = {}) {
  return resolveBackgroundImageStyle(
    resolveBacklinkStyle(
      { ...DEFAULT_HEADER_WITH_CITY_INFO_STYLE, ...style },
      DEFAULT_HEADER_WITH_CITY_INFO_STYLE
    ),
    DEFAULT_HEADER_WITH_CITY_INFO_STYLE
  );
}

export const HEADER_WITH_CITY_INFO_STYLE_RESET_KEYS = {
  layout: ["showTitle", "showDescription", "showCityCard"],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight"],
  banner: [
    "showHeroImage",
    ...BACKGROUND_IMAGE_STYLE_RESET_KEYS,
    "showOverlay",
    "overlayColor",
  ],
  card: [
    "showCardHeading",
    "showCardDescription",
    "showNextFlight",
    "cardRadius",
    "cardHeadingColor", "cardHeadingFontWeight",
    "cardBodyColor", "cardBodyFontWeight",
    "tileLabelColor", "tileLabelFontWeight",
    "tileValueColor", "tileValueFontWeight",
    "nextFlightColor", "nextFlightFontWeight",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
