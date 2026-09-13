import OppositeScrollContainer from "./OppositeScrollContainer";
import OppositeScrollPanel from "./OppositeScrollPanel";
import { getOppositeScrollCarouselContent } from "../utils/helpers";
import { resolveOppositeScrollStyle } from "../utils/style";

export default function ImageCarouselsWithOppositeScrollDirectionsSection({
  lang = "en",
  dir,
  data,
  style,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveOppositeScrollStyle(style);
  const content = getOppositeScrollCarouselContent(data, lang);

  return (
    <OppositeScrollContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <OppositeScrollPanel
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </OppositeScrollContainer>
  );
}
