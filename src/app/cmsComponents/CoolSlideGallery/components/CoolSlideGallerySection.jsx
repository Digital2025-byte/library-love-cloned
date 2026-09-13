import CoolSlideGalleryContainer from "./CoolSlideGalleryContainer";
import CoolSlideGalleryPanel from "./CoolSlideGalleryPanel";
import { getCoolSlideGalleryContent } from "../utils/helpers";
import { resolveCoolSlideGalleryStyle } from "../utils/style";

export default function CoolSlideGallerySection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveCoolSlideGalleryStyle(style);
  const content = getCoolSlideGalleryContent(data, lang);

  return (
    <CoolSlideGalleryContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <CoolSlideGalleryPanel
          content={content}
          style={resolvedStyle}
        />
      ) : null}
    </CoolSlideGalleryContainer>
  );
}
