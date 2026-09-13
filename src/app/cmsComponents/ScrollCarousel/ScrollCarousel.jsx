"use client";

import ScrollCarouselPanel from "./components/ScrollCarouselPanel";
import { getScrollCarouselContent } from "./utils/helpers";
import { resolveScrollCarouselStyle } from "./utils/style";

export default function ScrollCarousel({ lang = "en", data, style }) {
  const content = getScrollCarouselContent(data, lang);
  const resolvedStyle = resolveScrollCarouselStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <ScrollCarouselPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
