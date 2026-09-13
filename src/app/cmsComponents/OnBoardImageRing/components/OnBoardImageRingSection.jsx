import OnBoardImageRingContainer from "./OnBoardImageRingContainer";
import OnBoardImageRingPanel from "./OnBoardImageRingPanel";
import { getOnBoardImageRingContent } from "../utils/helpers";
import { resolveOnBoardImageRingStyle } from "../utils/style";

export default function OnBoardImageRingSection({
  lang = "en",
  dir,
  data,
  style,
  imageGap,
  className = "",
}) {
  const resolvedStyle = resolveOnBoardImageRingStyle(style);
  const content = getOnBoardImageRingContent(data, lang);

  return (
    <OnBoardImageRingContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <OnBoardImageRingPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          imageGap={imageGap}
        />
      ) : null}
    </OnBoardImageRingContainer>
  );
}
