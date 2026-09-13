import RelatedContentCarouselContainer from "./RelatedContentCarouselContainer";
import RelatedContentCarouselPanel from "./RelatedContentCarouselPanel";
import { getRelatedContentCarouselContent } from "../utils/helpers";
import { resolveRelatedContentStyle } from "../utils/style";

export default function RelatedContentCarouselSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveRelatedContentStyle(style);
  const content = getRelatedContentCarouselContent(data, lang, posParams);

  return (
    <RelatedContentCarouselContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent && content.cards.length ? (
        <RelatedContentCarouselPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </RelatedContentCarouselContainer>
  );
}
