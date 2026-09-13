import ThreeDSliderContainer from "./ThreeDSliderContainer";
import ThreeDSliderPanel from "./ThreeDSliderPanel";
import { getThreeDSliderContent } from "../utils/helpers";
import { resolveThreeDSliderStyle } from "../utils/style";

export default function ThreeDSliderSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveThreeDSliderStyle(style);
  const content = getThreeDSliderContent(data, lang);

  return (
    <ThreeDSliderContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <ThreeDSliderPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </ThreeDSliderContainer>
  );
}
