import FullHeightHeaderWithTextContainer from "./FullHeightHeaderWithTextContainer";
import FullHeightHeaderWithTextPanel from "./FullHeightHeaderWithTextPanel";
import { getFullHeightHeaderWithTextContent } from "../utils/helpers";
import { resolveFullHeightHeaderStyle } from "../utils/style";

export default function FullHeightHeaderWithTextSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveFullHeightHeaderStyle(style);
  const content = getFullHeightHeaderWithTextContent(data, lang, posParams);

  return (
    <FullHeightHeaderWithTextContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      {content.hasContent ? (
        <FullHeightHeaderWithTextPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </FullHeightHeaderWithTextContainer>
  );
}
