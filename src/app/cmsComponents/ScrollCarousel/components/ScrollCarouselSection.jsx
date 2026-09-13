import ScrollCarouselContainer from "./ScrollCarouselContainer";
import ScrollCarouselPanel from "./ScrollCarouselPanel";
import { getScrollCarouselContent } from "../utils/helpers";
import { resolveScrollCarouselStyle } from "../utils/style";

export default function ScrollCarouselSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveScrollCarouselStyle(style);
  const content = getScrollCarouselContent(data, lang);

  return (
    <ScrollCarouselContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <ScrollCarouselPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </ScrollCarouselContainer>
  );
}
