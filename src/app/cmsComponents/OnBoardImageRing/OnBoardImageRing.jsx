"use client";

import OnBoardImageRingPanel from "./components/OnBoardImageRingPanel";
import { getOnBoardImageRingContent } from "./utils/helpers";
import { resolveOnBoardImageRingStyle } from "./utils/style";

export default function OnBoardImageRing({
  lang = "en",
  data,
  style,
  imageGap,
}) {
  const content = getOnBoardImageRingContent(data, lang);
  const resolvedStyle = resolveOnBoardImageRingStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <OnBoardImageRingPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      imageGap={imageGap}
    />
  );
}
