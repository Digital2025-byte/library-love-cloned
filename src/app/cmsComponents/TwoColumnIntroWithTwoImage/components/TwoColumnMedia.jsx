import Image from "next/image";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_TWO_COLUMN_INTRO_STYLE,
  IMAGE_RADIUS_CLASS,
} from "../utils/style";

export default function TwoColumnMedia({
  mainImage,
  mainImageAlt,
  overlayImage,
  overlayImageAlt,
  style = DEFAULT_TWO_COLUMN_INTRO_STYLE,
}) {
  const radiusClass =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.lg;
  const showMain = style.showMainImage;
  const showOverlay = style.showOverlayImage && isUsableImageSrc(overlayImage);

  return (
    <div className="relative w-full">
      <div className="relative ms-auto w-full lg:w-[92%]">
        <div
          className={`relative aspect-16/10 w-full overflow-hidden shadow-md ${radiusClass}`}
        >
          {showMain && isUsableImageSrc(mainImage) ? (
            <Image
              src={mainImage}
              alt={mainImageAlt}
              fill
              priority
              quality={75}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="h-full w-full bg-background" />
          )}
        </div>

        {showOverlay ? (
          <div className="absolute start-[10%] -bottom-[10%] z-10 aspect-4/3 w-[46%] overflow-hidden rounded-3xl sm:start-[10%] sm:-bottom-[10%] sm:w-[44%]">
            <Image
              src={overlayImage}
              alt={overlayImageAlt}
              fill
              quality={75}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 42vw, 22vw"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
