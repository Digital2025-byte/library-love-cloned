import Image from "next/image";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
  IMAGE_RADIUS_CLASS,
  OVERLAY_RADIUS_CLASS,
} from "../utils/style";

export default function SubSectionsMedia({
  mainImage,
  mainImageAlt,
  overlayImage,
  overlayImageAlt,
  style = DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
}) {
  const canShowMain = isUsableImageSrc(mainImage);
  const canShowOverlay = isUsableImageSrc(overlayImage);
  const mainRadius =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.lg;
  const overlayRadius =
    OVERLAY_RADIUS_CLASS[style.imageRadius] ?? OVERLAY_RADIUS_CLASS.lg;

  if (!canShowMain) {
    return null;
  }

  return (
    <div className="relative w-full pb-[14%] lg:w-[52%] lg:pb-[12%] ">
      <div className="relative w-[88%]">
        <div
          className={`relative aspect-4/3 w-full overflow-hidden ${mainRadius}`}
        >
          <Image
            src={mainImage}
            alt={mainImageAlt}
            fill
            priority
            quality={75}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 48vw"
          />
        </div>

        {canShowOverlay ? (
          <div
            className={`absolute -bottom-[10%] -end-[8%] z-10 aspect-square w-[42%] overflow-hidden shadow-2xl ring-1 ring-black/5 ${overlayRadius}`}
          >
            <Image
              src={overlayImage}
              alt={overlayImageAlt}
              fill
              quality={75}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 40vw, 20vw"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
