"use client";

import DualImageTextPanel from "./components/DualImageTextPanel";
import {
  DEFAULT_EXTRA_IMAGE_POSITION,
  getDualImageTextContent,
} from "./utils/helpers";
import { resolveDualImageTextStyle } from "./utils/style";

export default function DualImageText({
  lang = "en",
  data,
  style,
  extraImagePositions = [
    DEFAULT_EXTRA_IMAGE_POSITION,
    DEFAULT_EXTRA_IMAGE_POSITION,
  ],
  cId,
}) {
  const resolvedStyle = resolveDualImageTextStyle(style);
  const content = getDualImageTextContent(data, lang);

  if (!content.hasContent) {
    return null;
  }

  return (
    <DualImageTextPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      extraImagePositions={extraImagePositions}
      cId={cId}
    />
  );
}
