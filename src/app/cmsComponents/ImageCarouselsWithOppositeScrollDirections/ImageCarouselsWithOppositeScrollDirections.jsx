"use client";

import OppositeScrollPanel from "./components/OppositeScrollPanel";
import { getOppositeScrollCarouselContent } from "./utils/helpers";
import { resolveOppositeScrollStyle } from "./utils/style";

export default function ImageCarouselsWithOppositeScrollDirections({
  lang = "en",
  data,
  style,
  cId,
}) {
  const content = getOppositeScrollCarouselContent(data, lang);
  const resolvedStyle = resolveOppositeScrollStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <OppositeScrollPanel
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
