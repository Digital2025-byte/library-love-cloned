import HeaderWithCityInfoContainer from "./HeaderWithCityInfoContainer";
import HeaderWithCityInfoPanel from "./HeaderWithCityInfoPanel";
import { getHeaderWithCityInfoContent } from "../utils/helpers";
import { resolveHeaderWithCityInfoStyle } from "../utils/style";

export default function HeaderWithCityInfoSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveHeaderWithCityInfoStyle(style);
  const content = getHeaderWithCityInfoContent(data, lang);

  return (
    <HeaderWithCityInfoContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      {content.hasContent ? (
        <HeaderWithCityInfoPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </HeaderWithCityInfoContainer>
  );
}
