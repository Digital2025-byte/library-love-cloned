"use client";

import CarouselItemPanel from "./components/CarouselItemPanel";
import { getCarouselItemContent } from "./utils/helpers";
import { resolveCarouselItemStyle } from "./utils/style";

/**
 * CarouselItem — destinations carousel (3-up desktop / 1-up mobile).
 */
export default function CarouselItem({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getCarouselItemContent(data, lang);
  const resolvedStyle = resolveCarouselItemStyle(style);

  if (!content) {
    return null;
  }

  return (
    <CarouselItemPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      posParams={posParams}
      cId={cId}
    />
  );
}
