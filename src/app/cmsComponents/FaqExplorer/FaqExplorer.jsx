"use client";

import FaqExplorerPanel from "./components/FaqExplorerPanel";
import { getFaqExplorerContent } from "./utils/helpers";
import { resolveFaqExplorerStyle } from "./utils/style";

export default function FaqExplorer({ lang = "en", data, style }) {
  const content = getFaqExplorerContent(data, lang);
  const resolvedStyle = resolveFaqExplorerStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <FaqExplorerPanel content={content} style={resolvedStyle} />;
}
