"use client";

import RelatedContentCarouselPanel from "./components/RelatedContentCarouselPanel";
import { getRelatedContentCarouselContent } from "./utils/helpers";
import { resolveRelatedContentStyle } from "./utils/style";

export default function RelatedContentCarousel({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getRelatedContentCarouselContent(data, lang, posParams);
  const resolvedStyle = resolveRelatedContentStyle(style);

  if (!content.hasContent || !content.cards.length) {
    return null;
  }

  return (
    <RelatedContentCarouselPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
