import CtaBannerContainer from "./CtaBannerContainer";
import CtaBannerPanel from "./CtaBannerPanel";
import { getCtaBannerContent } from "../utils/helpers";
import { resolveCtaBannerStyle } from "../utils/style";

export default function CtaBannerSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  className = "",
}) {
  const resolvedStyle = resolveCtaBannerStyle(style);
  const content = getCtaBannerContent(data, lang, posParams);

  return (
    <CtaBannerContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <CtaBannerPanel lang={lang} content={content} style={resolvedStyle} />
      ) : null}
    </CtaBannerContainer>
  );
}
