import CardsCarouselFillImageContainer from "./CardsCarouselFillImageContainer";
import CardsCarouselFillImagePanel from "./CardsCarouselFillImagePanel";
import { getCardsCarouselFillImageContent } from "../utils/helpers";
import { resolveFillImageStyle } from "../utils/style";

export default function CardsCarouselFillImageSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveFillImageStyle(style);
  const content = getCardsCarouselFillImageContent(data, lang, posParams);

  return (
    <CardsCarouselFillImageContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent && content.cards.length ? (
        <CardsCarouselFillImagePanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </CardsCarouselFillImageContainer>
  );
}
