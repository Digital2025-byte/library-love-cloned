"use client";

import TwoColumnPanel from "./components/TwoColumnPanel";
import { getTwoColumnIntroContent } from "./utils/helpers";
import { resolveTwoColumnIntroStyle } from "./utils/style";

export default function TwoColumnIntroWithTwoImage({
  lang = "en",
  data,
  style,
  cId,
}) {
  const content = getTwoColumnIntroContent(data, lang);
  const resolvedStyle = resolveTwoColumnIntroStyle(style, data);

  if (!content.hasContent) {
    return null;
  }

  return (
    <TwoColumnPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
