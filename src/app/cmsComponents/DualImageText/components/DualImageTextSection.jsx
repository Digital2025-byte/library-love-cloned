import DualImageTextContainer from "./DualImageTextContainer";
import DualImageTextPanel from "./DualImageTextPanel";
import {
  DEFAULT_EXTRA_IMAGE_POSITION,
  getDualImageTextContent,
} from "../utils/helpers";
import { resolveDualImageTextStyle } from "../utils/style";

export default function DualImageTextSection({
  lang = "en",
  dir,
  data,
  style,
  extraImagePositions = [
    DEFAULT_EXTRA_IMAGE_POSITION,
    DEFAULT_EXTRA_IMAGE_POSITION,
  ],
  cId,
  className = "",
}) {
  const resolvedStyle = resolveDualImageTextStyle(style);
  const content = getDualImageTextContent(data, lang);

  return (
    <DualImageTextContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <DualImageTextPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
          extraImagePositions={extraImagePositions}
          cId={cId}
        />
      ) : null}
    </DualImageTextContainer>
  );
}
