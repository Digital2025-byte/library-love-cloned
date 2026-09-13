import AnimatedImagesContainer from "./AnimatedImagesContainer";
import AnimatedImagesPanel from "./AnimatedImagesPanel";
import { getSectionWithAnimatedImagesContent } from "../utils/helpers";
import { resolveAnimatedImagesStyle } from "../utils/style";

export default function SectionWithAnimatedImagesSection({
  lang = "en",
  dir,
  data,
  style,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveAnimatedImagesStyle(style);
  const content = getSectionWithAnimatedImagesContent(data, lang);

  return (
    <AnimatedImagesContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <AnimatedImagesPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          cId={cId}
        />
      ) : null}
    </AnimatedImagesContainer>
  );
}
