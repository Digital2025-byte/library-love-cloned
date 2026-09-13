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

export const DEFAULT_SERVICE_BENEFITS_STYLE = {
  showTitle: true,
  showDescription: true,
  showIcons: true,
  showBackgroundImage: true,
  showOverlay: true,
  showSectionBg: true,
  sectionBg: "100",
  sectionPadding: "default",
  titleAlign: "center",
  titleColor: "white",
  descriptionColor: "white",
  itemTitleColor: "white",
  overlayColor: "secondary-2",
  cardRadius: "sm",
  iconBg: "background",
  iconColor: "primary-1",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  itemTitleFontWeight: "semibold",
  ...DEFAULT_BACKLINK_STYLE,
  ...DEFAULT_BACKGROUND_IMAGE_STYLE,
};

export function resolveServiceBenefitsStyle(style = {}) {
  return resolveBackgroundImageStyle(
    resolveBacklinkStyle(
      { ...DEFAULT_SERVICE_BENEFITS_STYLE, ...style },
      DEFAULT_SERVICE_BENEFITS_STYLE
    ),
    DEFAULT_SERVICE_BENEFITS_STYLE
  );
}

export const SERVICE_BENEFITS_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: ["titleAlign", "titleColor", "titleFontWeight"],
  items: [
    "showDescription",
    "showIcons",
    "itemTitleColor", "itemTitleFontWeight",
    "descriptionColor", "descriptionFontWeight",
    "iconBg",
    "iconColor",
  ],
  banner: [
    "showBackgroundImage",
    "showOverlay",
    "overlayColor",
    "cardRadius",
    ...BACKGROUND_IMAGE_STYLE_RESET_KEYS,
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
