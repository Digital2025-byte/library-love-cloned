"use client";

import PhotoTileGridPanel from "./components/PhotoTileGridPanel";
import { getPhotoTileGridContent } from "./utils/helpers";
import { resolvePhotoTileGridStyle } from "./utils/style";

export default function PhotoTileGrid({ lang = "en", data, style, cId }) {
  const content = getPhotoTileGridContent(data, lang);
  const resolvedStyle = resolvePhotoTileGridStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <PhotoTileGridPanel
      lang={lang}
      content={content}
      style={resolvedStyle}
      cId={cId}
    />
  );
}
