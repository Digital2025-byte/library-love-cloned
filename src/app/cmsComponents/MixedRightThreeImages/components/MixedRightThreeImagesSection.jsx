import MixedRightThreeImagesContainer from "./MixedRightThreeImagesContainer";
import MixedRightThreeImagesPanel from "./MixedRightThreeImagesPanel";
import { getMixedRightThreeImagesContent } from "../utils/helpers";
import { resolveMixedThreeImagesStyle } from "../utils/style";

export default function MixedRightThreeImagesSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveMixedThreeImagesStyle(style);
  const content = getMixedRightThreeImagesContent(data, lang);

  return (
    <MixedRightThreeImagesContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <MixedRightThreeImagesPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </MixedRightThreeImagesContainer>
  );
}
