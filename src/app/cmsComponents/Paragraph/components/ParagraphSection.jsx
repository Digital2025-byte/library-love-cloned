import Paragraph from "../Paragraph";
import ParagraphContainer from "./ParagraphContainer";
import { resolveParagraphStyle } from "../utils/style";

export default function ParagraphSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveParagraphStyle(style);

  return (
    <ParagraphContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <Paragraph lang={lang} data={data} style={resolvedStyle} />
    </ParagraphContainer>
  );
}
