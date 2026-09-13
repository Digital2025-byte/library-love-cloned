"use client";

import FormsDirectoryPanel from "./components/FormsDirectoryPanel";
import { getFormsDirectoryContent } from "./utils/helpers";
import { resolveFormsDirectoryStyle } from "./utils/style";

export default function FormsDirectory({ lang = "en", data, style }) {
  const content = getFormsDirectoryContent(data, lang);
  const resolvedStyle = resolveFormsDirectoryStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <FormsDirectoryPanel content={content} style={resolvedStyle} />;
}
