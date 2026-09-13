"use client";

import FullHeightHeaderWithTextPanel from "./components/FullHeightHeaderWithTextPanel";
import { getFullHeightHeaderWithTextContent } from "./utils/helpers";
import { resolveFullHeightHeaderStyle } from "./utils/style";

export default function FullHeightHeaderWithText({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getFullHeightHeaderWithTextContent(data, lang, posParams);
  const resolvedStyle = resolveFullHeightHeaderStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <FullHeightHeaderWithTextPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
