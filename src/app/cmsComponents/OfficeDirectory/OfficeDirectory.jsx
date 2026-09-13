"use client";

import OfficeDirectoryPanel from "./components/OfficeDirectoryPanel";
import { getOfficeDirectoryContent } from "./utils/helpers";
import { resolveOfficeDirectoryStyle } from "./utils/style";

export default function OfficeDirectory({ lang = "en", data, style }) {
  const content = getOfficeDirectoryContent(data, lang);
  const resolvedStyle = resolveOfficeDirectoryStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return <OfficeDirectoryPanel content={content} style={resolvedStyle} />;
}
