import VerticalImageSliceImage from "./VerticalImageSliceImage";
import VerticalImageSliceText from "./VerticalImageSliceText";
import { DEFAULT_VERTICAL_IMAGE_SLICE_STYLE } from "../utils/style";

export default function VerticalImageSlicePanel({
  lang = "en",
  content,
  style = DEFAULT_VERTICAL_IMAGE_SLICE_STYLE,
}) {
  const isRtl = lang === "ar";
  const imagesOnRight = style.imageSide !== "left";
  const textOrder = imagesOnRight ? "lg:order-first" : "lg:order-last";
  const imageOrder = imagesOnRight
    ? "order-first overflow-hidden lg:order-last"
    : "order-first overflow-hidden lg:order-first";

  return (
    <div
      className="grid w-full grid-cols-1 items-center gap-6 overflow-visible lg:grid-cols-2"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className={textOrder}>
        <VerticalImageSliceText
          firstPart={content.firstPart}
          highlightPart={content.highlightPart}
          restPart={content.restPart}
          description={content.description}
          links={content.links}
          style={style}
        />
      </div>

      {style.showImage ? (
        <div className={imageOrder}>
          <VerticalImageSliceImage
            imageSrc={content.imageSrc}
            imageAlt={content.imageAlt}
          />
        </div>
      ) : null}
    </div>
  );
}
