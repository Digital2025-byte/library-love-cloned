"use client";

import VerticalImageSlicePanel from "./components/VerticalImageSlicePanel";
import { getVerticalImageSliceContent } from "./utils/helpers";
import { resolveVerticalImageSliceStyle } from "./utils/style";

export default function VerticalImageSliceTextSection({
  lang = "en",
  data,
  style,
}) {
  const content = getVerticalImageSliceContent(data, lang);
  const resolvedStyle = resolveVerticalImageSliceStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <VerticalImageSlicePanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
