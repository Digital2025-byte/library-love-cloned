"use client";

import AnimatedImagesPanel from "./components/AnimatedImagesPanel";
import { getSectionWithAnimatedImagesContent } from "./utils/helpers";
import { resolveAnimatedImagesStyle } from "./utils/style";

export default function SectionWithAnimatedImages({
  lang = "en",
  data,
  style,
  cId,
}) {
  const content = getSectionWithAnimatedImagesContent(data, lang);
  const resolvedStyle = resolveAnimatedImagesStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <AnimatedImagesPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
