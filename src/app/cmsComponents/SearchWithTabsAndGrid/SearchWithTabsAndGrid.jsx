"use client";

import SearchWithTabsAndGridPanel from "./components/SearchWithTabsAndGridPanel";
import { useSearchWithTabsAndGrid } from "./hooks/useSearchWithTabsAndGrid";
import { getSearchWithTabsAndGridContent } from "./utils/helpers";
import { resolveSearchGridStyle } from "./utils/style";

export default function SearchWithTabsAndGrid({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const content = getSearchWithTabsAndGridContent(data, lang);
  const resolvedStyle = resolveSearchGridStyle(style);
  const search = useSearchWithTabsAndGrid({
    sights: content.sights,
    tags: content.tags,
    allLabel: content.allLabel,
  });

  if (!content.hasContent) {
    return null;
  }

  return (
    <SearchWithTabsAndGridPanel
      lang={lang}
      posParams={posParams}
      cId={cId}
      content={content}
      search={search}
      style={resolvedStyle}
    />
  );
}
