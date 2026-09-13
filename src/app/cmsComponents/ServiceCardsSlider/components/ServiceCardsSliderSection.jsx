import ServiceCardsSliderContainer from "./ServiceCardsSliderContainer";
import ServiceCardsSliderPanel from "./ServiceCardsSliderPanel";
import { getServiceCardsSliderContent } from "../utils/helpers";
import { resolveServiceCardsStyle } from "../utils/style";

export default function ServiceCardsSliderSection({
  lang = "en",
  dir,
  data,
  style,
  posParams,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveServiceCardsStyle(style);
  const content = getServiceCardsSliderContent(data, lang, posParams, cId);

  return (
    <ServiceCardsSliderContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <ServiceCardsSliderPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </ServiceCardsSliderContainer>
  );
}
