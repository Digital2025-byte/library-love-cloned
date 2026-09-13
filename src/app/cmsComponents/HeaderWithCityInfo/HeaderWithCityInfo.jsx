"use client";

import HeaderWithCityInfoPanel from "./components/HeaderWithCityInfoPanel";
import { getHeaderWithCityInfoContent } from "./utils/helpers";
import { resolveHeaderWithCityInfoStyle } from "./utils/style";

export default function HeaderWithCityInfo({ lang = "en", data, style }) {
  const content = getHeaderWithCityInfoContent(data, lang);
  const resolvedStyle = resolveHeaderWithCityInfoStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <HeaderWithCityInfoPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
