import TextBlobContent from "./TextBlobContent";
import TextBlobMedia from "./TextBlobMedia";
import { DEFAULT_TEXT_WITH_BLOB_STYLE } from "../utils/style";

export default function TextBlobPanel({
  lang = "en",
  content,
  style = DEFAULT_TEXT_WITH_BLOB_STYLE,
}) {
  const isRtl = lang === "ar";
  const imagesOnRight = style.imageSide !== "left";
  const textOrder = imagesOnRight ? "order-1" : "order-1 lg:order-2";
  const imageOrder = imagesOnRight ? "order-2" : "order-2 lg:order-1";

  return (
    <div
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className={textOrder}>
        <TextBlobContent
          title={content.title}
          description={content.description}
          links={content.links}
          style={style}
        />
      </div>
      {style.showImage ? (
        <div className={imageOrder}>
          <TextBlobMedia
            imageSrc={content.imageSrc}
            imageAlt={content.imageAlt}
          />
        </div>
      ) : null}
    </div>
  );
}
