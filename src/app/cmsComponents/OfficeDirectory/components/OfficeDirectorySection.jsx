import OfficeDirectoryContainer from "./OfficeDirectoryContainer";
import OfficeDirectoryPanel from "./OfficeDirectoryPanel";
import { getOfficeDirectoryContent } from "../utils/helpers";
import { resolveOfficeDirectoryStyle } from "../utils/style";

export default function OfficeDirectorySection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveOfficeDirectoryStyle(style);
  const content = getOfficeDirectoryContent(data, lang);

  return (
    <OfficeDirectoryContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <OfficeDirectoryPanel content={content} style={resolvedStyle} />
      ) : null}
    </OfficeDirectoryContainer>
  );
}
