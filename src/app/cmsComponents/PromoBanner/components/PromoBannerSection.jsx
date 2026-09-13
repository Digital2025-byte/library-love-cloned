import PromoBannerContainer from "./PromoBannerContainer";
import PromoBannerPanel from "./PromoBannerPanel";
import { getPromoBannerContent } from "../utils/helpers";
import { resolvePromoBannerStyle } from "../utils/style";

export default function PromoBannerSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolvePromoBannerStyle(style);
  const content = getPromoBannerContent(data, lang);

  return (
    <PromoBannerContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <PromoBannerPanel lang={lang} content={content} style={resolvedStyle} />
      ) : null}
    </PromoBannerContainer>
  );
}
