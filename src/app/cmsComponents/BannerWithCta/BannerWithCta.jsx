"use client";

import BannerWithCtaPanel from "./components/BannerWithCtaPanel";
import { getBannerWithCtaContent } from "./utils/helpers";
import { resolveBannerWithCtaStyle } from "./utils/style";

export default function BannerWithCta({
  lang = "en",
  data,
  style,
  posParams,
}) {
  const content = getBannerWithCtaContent(data, lang, posParams);
  const resolvedStyle = resolveBannerWithCtaStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <BannerWithCtaPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
