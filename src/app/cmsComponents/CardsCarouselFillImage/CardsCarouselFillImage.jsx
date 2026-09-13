"use client";

import CardsCarouselFillImagePanel from "./components/CardsCarouselFillImagePanel";
import { getCardsCarouselFillImageContent } from "./utils/helpers";
import { resolveFillImageStyle } from "./utils/style";

export default function CardsCarouselFillImage({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getCardsCarouselFillImageContent(data, lang, posParams);
  const resolvedStyle = resolveFillImageStyle(style);

  if (!content.hasContent || !content.cards.length) {
    return null;
  }

  return (
    <CardsCarouselFillImagePanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
