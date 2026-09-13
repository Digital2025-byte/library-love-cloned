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

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const TITLE_ALIGN_CLASS = {
  left: "text-start",
  center: "text-center",
};

export const BANNER_RADIUS_CLASS = {
  none: "md:rounded-none",
  sm: "md:rounded-xl",
  lg: "md:rounded-2xl",
  full: "md:rounded-3xl",
};

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-5 sm:py-6 lg:py-8",
  default: "py-8 sm:py-12 lg:py-16",
  loose: "py-12 sm:py-16 lg:py-20",
};

export const DEFAULT_DESTINATION_SHOWCASE_STYLE = {
  showTitle: true,
  showDescription: true,
  showViewAll: true,
  showSectionBg: true,
  showHeroImage: true,
  showOverlay: true,
  showDestinationName: true,
  showDestinationDescription: true,
  showCards: true,
  showCardOverlay: true,
  showButton: true,
  showArrows: true,
  showDots: true,
  sectionBg: "50",
  sectionPadding: "default",
  titleAlign: "left",
  titleColor: "primary-1",
  descriptionColor: "700",
  viewAllColor: "secondary-2",
  bannerRadius: "sm",
  overlayColor: "main",
  destNameColor: "50",
  destBodyColor: "50",
  cardRadius: "lg",
  cardOverlayColor: "main",
  buttonBg: "primary-2",
  buttonText: "white",
  navColor: "50",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonTextFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
  ...DEFAULT_BACKGROUND_IMAGE_STYLE,
};

export function resolveDestinationShowcaseStyle(style = {}) {
  return resolveBackgroundImageStyle(
    resolveBacklinkStyle(
      { ...DEFAULT_DESTINATION_SHOWCASE_STYLE, ...style },
      DEFAULT_DESTINATION_SHOWCASE_STYLE
    ),
    DEFAULT_DESTINATION_SHOWCASE_STYLE
  );
}

export const DESTINATION_SHOWCASE_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showViewAll",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight", "descriptionColor", "descriptionFontWeight", "viewAllColor"],
  banner: [
    "showHeroImage",
    "showOverlay",
    "showDestinationName",
    "showDestinationDescription",
    "bannerRadius",
    "overlayColor",
    "destNameColor",
    "destBodyColor",
    ...BACKGROUND_IMAGE_STYLE_RESET_KEYS,
  ],
  cards: [
    "showCards",
    "showCardOverlay",
    "cardRadius",
    "cardOverlayColor",
  ],
  button: ["showButton", "buttonBg", "buttonText", "buttonTextFontWeight"],
  nav: ["showArrows", "showDots", "navColor"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
