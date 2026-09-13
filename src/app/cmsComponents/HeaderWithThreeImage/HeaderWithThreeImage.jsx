"use client";

import HeaderWithThreeImagePanel from "./components/HeaderWithThreeImagePanel";
import { getHeaderWithThreeImageContent } from "./utils/helpers";
import { resolveHeaderWithThreeImageStyle } from "./utils/style";

export default function HeaderWithThreeImage({ lang = "en", data, style }) {
  const content = getHeaderWithThreeImageContent(data, lang);
  const resolvedStyle = resolveHeaderWithThreeImageStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <HeaderWithThreeImagePanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
