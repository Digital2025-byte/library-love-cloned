"use client";

import TabbedCardsPanel from "./components/TabbedCardsPanel";
import { getTabbedCardsContent } from "./utils/helpers";
import { resolveTabbedCardsStyle } from "./utils/style";

export default function TabbedCardsSection({ lang = "en", data, style }) {
  const content = getTabbedCardsContent(data, lang);
  const resolvedStyle = resolveTabbedCardsStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <TabbedCardsPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
