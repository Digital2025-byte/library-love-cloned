"use client";

import ThreeDSliderPanel from "./components/ThreeDSliderPanel";
import { getThreeDSliderContent } from "./utils/helpers";
import { resolveThreeDSliderStyle } from "./utils/style";

/**
 * Lightswind 3D slider — destination cards in a full-width section.
 */
export default function ThreeDSlider({ lang = "en", data, style }) {
  const content = getThreeDSliderContent(data, lang);
  const resolvedStyle = resolveThreeDSliderStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <ThreeDSliderPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
