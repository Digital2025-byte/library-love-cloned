import LocationDirectoryContainer from "./LocationDirectoryContainer";
import LocationDirectoryPanel from "./LocationDirectoryPanel";
import { getLocationDirectoryContent } from "../utils/helpers";
import { resolveLocationDirectoryStyle } from "../utils/style";

export default function LocationDirectorySection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveLocationDirectoryStyle(style);
  const content = getLocationDirectoryContent(data, lang);

  return (
    <LocationDirectoryContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <LocationDirectoryPanel
          lang={lang}
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </LocationDirectoryContainer>
  );
}
