"use client";

import TextBlobPanel from "./components/TextBlobPanel";
import { getTextWithBlobContent } from "./utils/helpers";
import { resolveTextWithBlobStyle } from "./utils/style";

export default function TextWithBlobImage({ lang = "en", data, style }) {
  const content = getTextWithBlobContent(data, lang);
  const resolvedStyle = resolveTextWithBlobStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <TextBlobPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
