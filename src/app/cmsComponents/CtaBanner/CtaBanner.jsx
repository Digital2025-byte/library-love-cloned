"use client";

import CtaBannerPanel from "./components/CtaBannerPanel";
import { getCtaBannerContent } from "./utils/helpers";
import { resolveCtaBannerStyle } from "./utils/style";

export default function CtaBanner({ lang = "en", data, style, posParams }) {
  const content = getCtaBannerContent(data, lang, posParams);
  const resolvedStyle = resolveCtaBannerStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <CtaBannerPanel lang={lang} content={content} style={resolvedStyle} />;
}
