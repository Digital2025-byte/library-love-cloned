"use client";

import SplitWithImagePanel from "./components/SplitWithImagePanel";
import { getSplitWithImageContent } from "./utils/helpers";
import { resolveSplitWithImageStyle } from "./utils/style";

export default function SplitWithImage({ lang = "en", data, style }) {
  const content = getSplitWithImageContent(data, lang);
  const resolvedStyle = resolveSplitWithImageStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <SplitWithImagePanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
