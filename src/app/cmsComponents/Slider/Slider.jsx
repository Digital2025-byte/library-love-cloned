"use client";

import SliderPanel from "./components/SliderPanel";
import { getSliderContent } from "./utils/helpers";
import { resolveSliderStyle } from "./utils/style";

/**
 * Hero image Slider (react-slick).
 */
export default function Slider({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getSliderContent(data, lang);
  const resolvedStyle = resolveSliderStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <SliderPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      posParams={posParams}
      cId={cId}
    />
  );
}
