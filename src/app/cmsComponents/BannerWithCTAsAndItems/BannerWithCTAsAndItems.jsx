"use client";

import BannerWithCTAsAndItemsPanel from "./components/BannerWithCTAsAndItemsPanel";
import { getBannerWithCTAsAndItemsContent } from "./utils/helpers";
import { resolveBannerWithCTAsStyle } from "./utils/style";

export default function BannerWithCTAsAndItems({
  lang = "en",
  data,
  style,
  posParams,
  cId,
}) {
  const content = getBannerWithCTAsAndItemsContent(data, lang, posParams, cId);
  const resolvedStyle = resolveBannerWithCTAsStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <BannerWithCTAsAndItemsPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
