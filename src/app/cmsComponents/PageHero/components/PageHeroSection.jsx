import PageHeroContainer from "./PageHeroContainer";
import PageHeroPanel from "./PageHeroPanel";
import { getPageHeroContent } from "../utils/helpers";
import { resolvePageHeroStyle } from "../utils/style";

export default function PageHeroSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolvePageHeroStyle(style);
  const content = getPageHeroContent(data, lang);

  return (
    <PageHeroContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <PageHeroPanel content={content} style={resolvedStyle} />
      ) : null}
    </PageHeroContainer>
  );
}
