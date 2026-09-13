"use client";

import LocationDirectoryPanel from "./components/LocationDirectoryPanel";
import { getLocationDirectoryContent } from "./utils/helpers";
import { resolveLocationDirectoryStyle } from "./utils/style";

export default function LocationDirectory({ lang = "en", data, style }) {
  const content = getLocationDirectoryContent(data, lang);
  const resolvedStyle = resolveLocationDirectoryStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <LocationDirectoryPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
    />
  );
}
