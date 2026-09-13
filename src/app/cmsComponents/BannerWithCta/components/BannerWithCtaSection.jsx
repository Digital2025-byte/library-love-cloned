import BannerWithCtaContainer from "./BannerWithCtaContainer";
import BannerWithCtaPanel from "./BannerWithCtaPanel";
import { getBannerWithCtaContent } from "../utils/helpers";
import { resolveBannerWithCtaStyle } from "../utils/style";

export default function BannerWithCtaSection({
  lang = "en",
  dir,
  data,
  style,
  posParams,
  className = "",
}) {
  const resolvedStyle = resolveBannerWithCtaStyle(style);
  const content = getBannerWithCtaContent(data, lang, posParams);

  return (
    <BannerWithCtaContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <BannerWithCtaPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </BannerWithCtaContainer>
  );
}
