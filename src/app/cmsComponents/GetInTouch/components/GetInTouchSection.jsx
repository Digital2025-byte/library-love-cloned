import GetInTouchContainer from "./GetInTouchContainer";
import GetInTouchPanel from "./GetInTouchPanel";
import { getGetInTouchContent } from "../utils/helpers";
import { resolveGetInTouchStyle } from "../utils/style";

export default function GetInTouchSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveGetInTouchStyle(style);
  const content = getGetInTouchContent(data, lang);

  return (
    <GetInTouchContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <GetInTouchPanel content={content} style={resolvedStyle} />
      ) : null}
    </GetInTouchContainer>
  );
}
