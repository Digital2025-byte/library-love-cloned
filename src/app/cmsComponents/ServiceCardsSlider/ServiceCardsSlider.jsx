"use client";

import ServiceCardsSliderPanel from "./components/ServiceCardsSliderPanel";
import { getServiceCardsSliderContent } from "./utils/helpers";
import { resolveServiceCardsStyle } from "./utils/style";

export default function ServiceCardsSlider({
  lang = "en",
  data,
  style,
  posParams,
  cId,
}) {
  const content = getServiceCardsSliderContent(data, lang, posParams, cId);
  const resolvedStyle = resolveServiceCardsStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <ServiceCardsSliderPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
