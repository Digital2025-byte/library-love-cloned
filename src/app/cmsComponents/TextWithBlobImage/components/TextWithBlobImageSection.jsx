import TextBlobContainer from "./TextBlobContainer";
import TextBlobPanel from "./TextBlobPanel";
import { getTextWithBlobContent } from "../utils/helpers";
import { resolveTextWithBlobStyle } from "../utils/style";

export default function TextWithBlobImageSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveTextWithBlobStyle(style);
  const content = getTextWithBlobContent(data, lang);

  return (
    <TextBlobContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <TextBlobPanel lang={lang} content={content} style={resolvedStyle} />
      ) : null}
    </TextBlobContainer>
  );
}
