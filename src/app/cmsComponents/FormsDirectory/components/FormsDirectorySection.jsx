import FormsDirectoryContainer from "./FormsDirectoryContainer";
import FormsDirectoryPanel from "./FormsDirectoryPanel";
import { getFormsDirectoryContent } from "../utils/helpers";
import { resolveFormsDirectoryStyle } from "../utils/style";

export default function FormsDirectorySection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveFormsDirectoryStyle(style);
  const content = getFormsDirectoryContent(data, lang);

  return (
    <FormsDirectoryContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <FormsDirectoryPanel content={content} style={resolvedStyle} />
      ) : null}
    </FormsDirectoryContainer>
  );
}
