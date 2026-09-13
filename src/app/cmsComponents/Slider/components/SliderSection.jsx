import SliderContainer from "./SliderContainer";
import SliderPanel from "./SliderPanel";
import { getSliderContent } from "../utils/helpers";
import { resolveSliderStyle } from "../utils/style";

export default function SliderSection({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveSliderStyle(style);
  const content = getSliderContent(data, lang);

  return (
    <SliderContainer lang={lang} className={className}>
      {content.hasContent ? (
        <SliderPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          posParams={posParams}
          cId={cId}
        />
      ) : null}
    </SliderContainer>
  );
}
