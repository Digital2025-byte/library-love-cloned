"use client";

import MixedRightThreeImagesPanel from "./components/MixedRightThreeImagesPanel";
import { getMixedRightThreeImagesContent } from "./utils/helpers";
import { resolveMixedThreeImagesStyle } from "./utils/style";

export default function MixedRightThreeImages({ lang = "en", data, style }) {
  const content = getMixedRightThreeImagesContent(data, lang);
  const resolvedStyle = resolveMixedThreeImagesStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <MixedRightThreeImagesPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
