import CarouselItemContainer from "./CarouselItemContainer";
import CarouselItemPanel from "./CarouselItemPanel";
import { getCarouselItemContent } from "../utils/helpers";
import { resolveCarouselItemStyle } from "../utils/style";

export default function CarouselItemSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveCarouselItemStyle(style);
  const content = getCarouselItemContent(data, lang);

  return (
    <CarouselItemContainer lang={lang} dir={dir} className={className}>
      {content ? (
        <CarouselItemPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          posParams={posParams}
          cId={cId}
        />
      ) : null}
    </CarouselItemContainer>
  );
}
