import SearchWithTabsAndGrid from "../SearchWithTabsAndGrid";
import SearchWithTabsAndGridContainer from "./SearchWithTabsAndGridContainer";
import { resolveSearchGridStyle } from "../utils/style";

export default function SearchWithTabsAndGridSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveSearchGridStyle(style);

  return (
    <SearchWithTabsAndGridContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      <SearchWithTabsAndGrid
        lang={lang}
        data={data}
        style={resolvedStyle}
        posParams={posParams}
        cId={cId}
      />
    </SearchWithTabsAndGridContainer>
  );
}
