"use client";

import CarouselImageText6Panel from "./components/CarouselImageText6Panel";
import { getCarouselImageText6Content } from "./utils/helpers";
import { resolveCarouselImageTextStyle } from "./utils/style";

export default function CarouselImageText6({ lang = "en", data, style }) {
  const content = getCarouselImageText6Content(data, lang);
  const resolvedStyle = resolveCarouselImageTextStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <CarouselImageText6Panel lang={lang} content={content} style={resolvedStyle} />
  );
}
