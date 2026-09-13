import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

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

export const CARD_RADIUS_CLASS = {
  none: "rounded-none",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-8 md:py-10",
  default: "py-12 md:py-16",
  loose: "py-16 md:py-20",
};

export const CARD_GAP_CLASS = {
  tight: "gap-4 md:gap-5",
  default: "gap-6 md:gap-8",
  loose: "gap-8 md:gap-10",
};

export const DEFAULT_LEGAL_INFORMATION_CARDS_STYLE = {
  showIcon: true,
  showTitle: true,
  showDescription: true,
  showCta: true,
  showSectionBg: false,
  showCardBg: true,
  sectionBg: "white",
  sectionPadding: "default",
  cardRadius: "lg",
  cardGap: "default",
  cardBg: "primary-1",
  iconBg: "50",
  iconColor: "primary-1",
  titleColor: "primary-2",
  descriptionColor: "50",
  ctaColor: "50",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveLegalInformationCardsStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_LEGAL_INFORMATION_CARDS_STYLE, ...style },
    DEFAULT_LEGAL_INFORMATION_CARDS_STYLE
  );
}

export const LEGAL_INFORMATION_CARDS_STYLE_RESET_KEYS = {
  layout: [
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
    "cardGap",
  ],
  cards: [
    "showIcon",
    "showTitle",
    "showDescription",
    "showCta",
    "showCardBg",
    "cardRadius",
    "cardBg",
    "iconBg",
    "iconColor",
    "titleColor", "titleFontWeight",
    "descriptionColor", "descriptionFontWeight",
    "ctaColor",
  ],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
