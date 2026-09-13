import HeaderWithThreeImageContainer from "./HeaderWithThreeImageContainer";
import HeaderWithThreeImagePanel from "./HeaderWithThreeImagePanel";
import { getHeaderWithThreeImageContent } from "../utils/helpers";
import { resolveHeaderWithThreeImageStyle } from "../utils/style";

export default function HeaderWithThreeImageSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveHeaderWithThreeImageStyle(style);
  const content = getHeaderWithThreeImageContent(data, lang);

  return (
    <HeaderWithThreeImageContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      {content.hasContent ? (
        <HeaderWithThreeImagePanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </HeaderWithThreeImageContainer>
  );
}
