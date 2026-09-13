/**
 * Shared background / hero image display tokens.
 * Spread into component DEFAULT_*_STYLE and resolve with resolveBackgroundImageStyle.
 */

export const IMAGE_FIT_OPTIONS = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "fill", label: "Stretch" },
];

export const IMAGE_POSITION_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

/** CSS background-size values */
export const IMAGE_FIT_CSS = {
  cover: "cover",
  contain: "contain",
  fill: "100% 100%",
};

/** CSS background-position / object-position values */
export const IMAGE_POSITION_CSS = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
};

/** Tailwind object-* utilities for next/image */
export const IMAGE_FIT_OBJECT_CLASS = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
};

export const IMAGE_POSITION_OBJECT_CLASS = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

export const DEFAULT_BACKGROUND_IMAGE_STYLE = {
  imageFit: "cover",
  imagePosition: "center",
};

export const BACKGROUND_IMAGE_STYLE_RESET_KEYS = [
  "imageFit",
  "imagePosition",
];

export function resolveBackgroundImageStyle(
  style = {},
  defaults = DEFAULT_BACKGROUND_IMAGE_STYLE
) {
  const merged = { ...defaults, ...style };
  return {
    ...merged,
    imageFit: IMAGE_FIT_CSS[merged.imageFit] ? merged.imageFit : "cover",
    imagePosition: IMAGE_POSITION_CSS[merged.imagePosition]
      ? merged.imagePosition
      : "center",
  };
}
