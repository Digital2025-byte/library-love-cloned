import LiveChatBannerContainer from "./LiveChatBannerContainer";
import LiveChatBannerPanel from "./LiveChatBannerPanel";
import { getLiveChatBannerContent } from "../utils/helpers";
import { resolveLiveChatBannerStyle } from "../utils/style";

export default function LiveChatBannerSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  className = "",
}) {
  const resolvedStyle = resolveLiveChatBannerStyle(style);
  const content = getLiveChatBannerContent(data, lang, posParams);

  return (
    <LiveChatBannerContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <LiveChatBannerPanel content={content} style={resolvedStyle} />
      ) : null}
    </LiveChatBannerContainer>
  );
}
