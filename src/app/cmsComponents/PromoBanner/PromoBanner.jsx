"use client";

import PromoBannerPanel from "./components/PromoBannerPanel";
import { getPromoBannerContent } from "./utils/helpers";
import { resolvePromoBannerStyle } from "./utils/style";

export default function PromoBanner({ lang = "en", data, style }) {
  const content = getPromoBannerContent(data, lang);
  const resolvedStyle = resolvePromoBannerStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <PromoBannerPanel lang={lang} content={content} style={resolvedStyle} />;
}
