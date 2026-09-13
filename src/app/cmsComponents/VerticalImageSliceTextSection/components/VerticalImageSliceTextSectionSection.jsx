import VerticalImageSliceContainer from "./VerticalImageSliceContainer";
import VerticalImageSlicePanel from "./VerticalImageSlicePanel";
import { getVerticalImageSliceContent } from "../utils/helpers";
import { resolveVerticalImageSliceStyle } from "../utils/style";

export default function VerticalImageSliceTextSectionSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveVerticalImageSliceStyle(style);
  const content = getVerticalImageSliceContent(data, lang);

  return (
    <VerticalImageSliceContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <VerticalImageSlicePanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </VerticalImageSliceContainer>
  );
}
