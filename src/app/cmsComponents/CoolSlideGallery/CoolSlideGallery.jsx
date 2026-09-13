"use client";

import CoolSlideGalleryPanel from "./components/CoolSlideGalleryPanel";
import CoolSlideGalleryContainer from "./components/CoolSlideGalleryContainer";
import { getCoolSlideGalleryContent } from "./utils/helpers";
import { resolveCoolSlideGalleryStyle } from "./utils/style";

export default function CoolSlideGallery({ lang = "en", data, style }) {
  const content = getCoolSlideGalleryContent(data, lang);
  const resolvedStyle = resolveCoolSlideGalleryStyle(style);

  if (!content.hasContent) {
    return null;
  }

  return (
    <CoolSlideGalleryContainer lang={lang} style={resolvedStyle}>
      <CoolSlideGalleryPanel
        content={content}
        style={resolvedStyle}
      />
    </CoolSlideGalleryContainer>
  );
}
