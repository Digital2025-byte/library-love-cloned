"use client";

import SearchConsolePanel from "./components/SearchConsolePanel";
import { getSearchConsoleContent } from "./utils/helpers";
import { resolveSearchConsoleStyle } from "./utils/style";

export default function SearchConsole({ lang = "en", data, style }) {
  const content = getSearchConsoleContent(data, lang);
  const resolvedStyle = resolveSearchConsoleStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <SearchConsolePanel lang={lang} content={content} style={resolvedStyle} />
  );
}
