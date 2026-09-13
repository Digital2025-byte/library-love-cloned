import TwoColumnContainer from "./TwoColumnContainer";
import TwoColumnPanel from "./TwoColumnPanel";
import { getTwoColumnIntroContent } from "../utils/helpers";
import { resolveTwoColumnIntroStyle } from "../utils/style";

export default function TwoColumnIntroWithTwoImageSection({
  lang = "en",
  dir,
  data,
  style,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveTwoColumnIntroStyle(style, data);
  const content = getTwoColumnIntroContent(data, lang);

  return (
    <TwoColumnContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <TwoColumnPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </TwoColumnContainer>
  );
}
