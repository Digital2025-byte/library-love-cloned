"use client";

import GetInTouchPanel from "./components/GetInTouchPanel";
import { getGetInTouchContent } from "./utils/helpers";
import { resolveGetInTouchStyle } from "./utils/style";

export default function GetInTouch({ lang = "en", data, style }) {
  const content = getGetInTouchContent(data, lang);
  const resolvedStyle = resolveGetInTouchStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <GetInTouchPanel content={content} style={resolvedStyle} />;
}
