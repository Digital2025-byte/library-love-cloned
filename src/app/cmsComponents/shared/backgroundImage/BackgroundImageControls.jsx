"use client";

import { InspectorChoose } from "@/components/inspector";
import {
  DEFAULT_BACKGROUND_IMAGE_STYLE,
  IMAGE_FIT_OPTIONS,
  IMAGE_POSITION_OPTIONS,
} from "./core/style";

/**
 * Fit + position controls for background / hero images.
 * Render when the image toggle is on.
 */
export default function BackgroundImageControls({
  style = DEFAULT_BACKGROUND_IMAGE_STYLE,
  onChange,
  visible = true,
  fitLabel = "Image fit",
  positionLabel = "Image position",
  idPrefix = "bg-image",
}) {
  if (!visible) return null;

  const update = (key, value) => onChange({ ...style, [key]: value });

  return (
    <>
      <InspectorChoose
        label={fitLabel}
        name={`${idPrefix}-fit`}
        value={style.imageFit || "cover"}
        options={IMAGE_FIT_OPTIONS}
        onChange={(value) => update("imageFit", value)}
      />
      <InspectorChoose
        label={positionLabel}
        name={`${idPrefix}-position`}
        value={style.imagePosition || "center"}
        options={IMAGE_POSITION_OPTIONS}
        onChange={(value) => update("imagePosition", value)}
      />
    </>
  );
}
