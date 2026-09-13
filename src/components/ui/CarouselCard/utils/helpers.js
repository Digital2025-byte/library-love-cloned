import { MAX_VISIBLE_STACK } from "./constants";

export function getStackLayout(stackIndex) {
  const safeStackIndex =
    typeof stackIndex === "number" && !Number.isNaN(stackIndex)
      ? stackIndex
      : 0;

  const isPast = safeStackIndex < 0;
  const rawIndex = Math.max(safeStackIndex, 0);
  const clampedIndex = Math.min(rawIndex, MAX_VISIBLE_STACK - 1);
  const hidden = isPast || clampedIndex >= MAX_VISIBLE_STACK;

  const translateX = -clampedIndex * 60;
  const translateY = clampedIndex * 8;
  const scale = 1 - clampedIndex * 0.08;
  const opacity = hidden ? 0 : 1 - clampedIndex * 0.15;

  const baseTransform = {
    x: translateX,
    y: translateY,
    scale,
    opacity,
    rotateZ: 0,
  };

  const calculatedZIndex = 40 - (safeStackIndex < 0 ? 0 : safeStackIndex);
  const safeZIndex =
    typeof calculatedZIndex === "number" && !Number.isNaN(calculatedZIndex)
      ? calculatedZIndex
      : 40;

  return {
    hidden,
    baseTransform,
    safeZIndex,
  };
}

export function getOriginLabel(subtitle) {
  return subtitle && String(subtitle).trim()
    ? String(subtitle).trim()
    : "From Dam";
}

export function getImageSrc(imageUrl) {
  return typeof imageUrl === "string"
    ? imageUrl
    : imageUrl?.src || imageUrl?.[0] || "";
}

export function getFlightsHref(posParams, lang, IATACode) {
  return `/${posParams}/${lang}/flight-schedule${
    IATACode ? `?to=${IATACode}` : ""
  }`;
}
