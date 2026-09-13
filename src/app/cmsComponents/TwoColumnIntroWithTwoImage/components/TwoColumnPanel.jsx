import TwoColumnContent from "./TwoColumnContent";
import TwoColumnMedia from "./TwoColumnMedia";
import { DEFAULT_TWO_COLUMN_INTRO_STYLE } from "../utils/style";

export default function TwoColumnPanel({
  lang = "en",
  content,
  style = DEFAULT_TWO_COLUMN_INTRO_STYLE,
  cId,
}) {
  const isRtl = lang === "ar";
  const imagesOnRight = style.imageSide !== "left";

  return (
    <section
      className={`flex flex-col items-center gap-10 lg:gap-3 ${
        imagesOnRight ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <TwoColumnContent
        title={content.title}
        description={content.description}
        links={content.links}
        ctaButton={content.ctaButton}
        ctaHref={content.ctaHref}
        style={style}
        cId={cId}
      />
      {style.showMainImage || style.showOverlayImage ? (
        <TwoColumnMedia
          mainImage={content.mainImage}
          mainImageAlt={content.mainImageAlt}
          overlayImage={content.overlayImage}
          overlayImageAlt={content.overlayImageAlt}
          style={style}
        />
      ) : null}
    </section>
  );
}
