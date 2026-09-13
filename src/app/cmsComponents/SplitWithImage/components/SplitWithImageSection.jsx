import SplitWithImageContainer from "./SplitWithImageContainer";
import SplitWithImagePanel from "./SplitWithImagePanel";
import { getSplitWithImageContent } from "../utils/helpers";
import { resolveSplitWithImageStyle } from "../utils/style";

export default function SplitWithImageSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveSplitWithImageStyle(style);
  const content = getSplitWithImageContent(data, lang);

  return (
    <SplitWithImageContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <SplitWithImagePanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </SplitWithImageContainer>
  );
}
