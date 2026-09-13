import SearchConsoleContainer from "./SearchConsoleContainer";
import SearchConsolePanel from "./SearchConsolePanel";
import { getSearchConsoleContent } from "../utils/helpers";
import { resolveSearchConsoleStyle } from "../utils/style";

export default function SearchConsoleSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveSearchConsoleStyle(style);
  const content = getSearchConsoleContent(data, lang);

  return (
    <SearchConsoleContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <SearchConsolePanel lang={lang} content={content} style={resolvedStyle} />
      ) : null}
    </SearchConsoleContainer>
  );
}
