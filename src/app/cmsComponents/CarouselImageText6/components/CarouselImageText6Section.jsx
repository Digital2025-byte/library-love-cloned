import CarouselImageText6Container from "./CarouselImageText6Container";
import CarouselImageText6Panel from "./CarouselImageText6Panel";
import { getCarouselImageText6Content } from "../utils/helpers";
import { resolveCarouselImageTextStyle } from "../utils/style";

export default function CarouselImageText6Section({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveCarouselImageTextStyle(style);
  const content = getCarouselImageText6Content(data, lang);

  return (
    <CarouselImageText6Container lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <CarouselImageText6Panel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </CarouselImageText6Container>
  );
}
