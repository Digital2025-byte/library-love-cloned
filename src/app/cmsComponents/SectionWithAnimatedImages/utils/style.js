import {
  BACKLINK_STYLE_RESET_KEYS,
  DEFAULT_BACKLINK_STYLE,
  resolveBacklinkStyle,
} from "@/app/cmsComponents/shared/backlinks";

export const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Start" },
  { value: "center", label: "Center" },
];

export const SPACING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
];

export const FALL_DURATION_OPTIONS = [
  { value: "fast", label: "Fast" },
  { value: "default", label: "Default" },
  { value: "slow", label: "Slow" },
];

export const FALL_DURATION_SECONDS = {
  fast: 4,
  default: 6,
  slow: 9,
};

export const SPAWN_INTERVAL_OPTIONS = [
  { value: "frequent", label: "Frequent" },
  { value: "default", label: "Default" },
  { value: "sparse", label: "Sparse" },
];

/** Base delay + random jitter between spawn waves (ms). */
export const SPAWN_INTERVAL_MS = {
  frequent: { base: 1500, jitter: 1000 },
  default: { base: 2500, jitter: 1500 },
  sparse: { base: 4000, jitter: 2000 },
};

export const CARDS_PER_SPAWN_OPTIONS = [
  { value: "one", label: "One at a time" },
  { value: "mixed", label: "One or two" },
  { value: "two", label: "Two at a time" },
];

export const FALLING_CARD_SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
];

export const FALLING_CARD_SIZE_CLASS = {
  small: "h-28 w-20 overflow-hidden rounded-3xl bg-background shadow-lg md:h-36 md:w-28 lg:h-40 lg:w-32",
  default:
    "h-36 w-28 overflow-hidden rounded-4xl bg-background shadow-xl md:h-48 md:w-36 lg:h-52 lg:w-40",
  large:
    "h-44 w-32 overflow-hidden rounded-4xl bg-background shadow-xl md:h-56 md:w-44 lg:h-64 lg:w-48",
};

export const FALLING_CARD_IMAGE_SIZE = {
  small: { width: 128, height: 160 },
  default: { width: 160, height: 208 },
  large: { width: 192, height: 256 },
};

export const TITLE_ALIGN_CLASS = {
  left: "text-start",
  center: "text-center",
};

export const SECTION_PADDING_CLASS = {
  tight: "py-10 md:py-12 lg:py-16",
  default: "py-16 md:py-20 lg:py-24",
  loose: "py-20 md:py-24 lg:py-28",
};

export const DEFAULT_ANIMATED_IMAGES_STYLE = {
  showTitle: true,
  showDescription: true,
  showCta: true,
  showImages: true,
  showSectionBg: true,
  sectionBg: "primary-100",
  sectionPadding: "default",
  titleAlign: "center",
  titleColor: "primary-1",
  descriptionColor: "primary-1",
  buttonBg: "primary-2",
  buttonText: "white",
  titleFontWeight: "semibold",
  descriptionFontWeight: "normal",
  buttonTextFontWeight: "semibold",
  fallDuration: "default",
  spawnInterval: "default",
  cardsPerSpawn: "mixed",
  fallingCardSize: "default",
  ...DEFAULT_BACKLINK_STYLE,
};

export function resolveAnimatedImagesStyle(style = {}) {
  return resolveBacklinkStyle(
    { ...DEFAULT_ANIMATED_IMAGES_STYLE, ...style },
    DEFAULT_ANIMATED_IMAGES_STYLE
  );
}

export function resolveFallingCardsSettings(style = {}) {
  const resolved = resolveAnimatedImagesStyle(style);
  const interval =
    SPAWN_INTERVAL_MS[resolved.spawnInterval] ?? SPAWN_INTERVAL_MS.default;

  return {
    fallDuration:
      FALL_DURATION_SECONDS[resolved.fallDuration] ??
      FALL_DURATION_SECONDS.default,
    spawnBaseMs: interval.base,
    spawnJitterMs: interval.jitter,
    cardsPerSpawn: resolved.cardsPerSpawn || "mixed",
    cardSizeClass:
      FALLING_CARD_SIZE_CLASS[resolved.fallingCardSize] ??
      FALLING_CARD_SIZE_CLASS.default,
    imageSize:
      FALLING_CARD_IMAGE_SIZE[resolved.fallingCardSize] ??
      FALLING_CARD_IMAGE_SIZE.default,
  };
}

export const ANIMATED_IMAGES_STYLE_RESET_KEYS = {
  layout: [
    "showTitle",
    "showDescription",
    "showSectionBg",
    "sectionBg",
    "sectionPadding",
  ],
  title: [
    "titleAlign",
    "titleColor",
    "titleFontWeight",
    "descriptionColor",
    "descriptionFontWeight",
  ],
  images: [
    "showImages",
    "fallDuration",
    "spawnInterval",
    "cardsPerSpawn",
    "fallingCardSize",
  ],
  button: ["showCta", "buttonBg", "buttonText", "buttonTextFontWeight"],
  links: [...BACKLINK_STYLE_RESET_KEYS],
};
