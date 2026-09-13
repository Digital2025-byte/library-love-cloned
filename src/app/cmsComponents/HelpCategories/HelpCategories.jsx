"use client";

import HelpCategoriesPanel from "./components/HelpCategoriesPanel";
import { getHelpCategoriesContent } from "./utils/helpers";
import { resolveHelpCategoriesStyle } from "./utils/style";

export default function HelpCategories({ lang = "en", data, style }) {
  const content = getHelpCategoriesContent(data, lang);
  const resolvedStyle = resolveHelpCategoriesStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <HelpCategoriesPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
