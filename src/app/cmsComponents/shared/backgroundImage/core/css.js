import {
  IMAGE_FIT_CSS,
  IMAGE_FIT_OBJECT_CLASS,
  IMAGE_POSITION_CSS,
  IMAGE_POSITION_OBJECT_CLASS,
} from "./style";

/**
 * Inline styles for CSS background-image layers (div backgrounds).
 */
export function getBackgroundDisplayStyle(style = {}) {
  const fit = IMAGE_FIT_CSS[style.imageFit] ?? IMAGE_FIT_CSS.cover;
  const position =
    IMAGE_POSITION_CSS[style.imagePosition] ?? IMAGE_POSITION_CSS.center;

  return {
    backgroundSize: fit,
    backgroundPosition: position,
    backgroundRepeat: "no-repeat",
  };
}

/**
 * Inline styles for next/image (or any replaced element using object-fit).
 */
export function getObjectFitStyle(style = {}) {
  const fit = style.imageFit === "fill" ? "fill" : style.imageFit || "cover";
  const objectFit =
    fit === "contain" || fit === "fill" || fit === "cover" ? fit : "cover";
  const objectPosition =
    IMAGE_POSITION_CSS[style.imagePosition] ?? IMAGE_POSITION_CSS.center;

  return { objectFit, objectPosition };
}

/**
 * Tailwind classes for next/image object-fit / object-position.
 */
export function getObjectFitClass(style = {}) {
  const fitClass =
    IMAGE_FIT_OBJECT_CLASS[style.imageFit] ?? IMAGE_FIT_OBJECT_CLASS.cover;
  const positionClass =
    IMAGE_POSITION_OBJECT_CLASS[style.imagePosition] ??
    IMAGE_POSITION_OBJECT_CLASS.center;
  return `${fitClass} ${positionClass}`;
}
