"use client";

import LiveChatBannerPanel from "./components/LiveChatBannerPanel";
import { getLiveChatBannerContent } from "./utils/helpers";
import { resolveLiveChatBannerStyle } from "./utils/style";

export default function LiveChatBanner({ lang = "en", data, style, posParams }) {
  const content = getLiveChatBannerContent(data, lang, posParams);
  const resolvedStyle = resolveLiveChatBannerStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <LiveChatBannerPanel content={content} style={resolvedStyle} />;
}
