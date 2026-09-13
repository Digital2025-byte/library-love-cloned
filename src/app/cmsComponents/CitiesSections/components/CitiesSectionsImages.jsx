import Image from "next/image";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_CITIES_SECTIONS_STYLE,
  IMAGE_RADIUS_CLASS,
} from "../utils/style";

export default function CitiesSectionsImages({
  content,
  style = DEFAULT_CITIES_SECTIONS_STYLE,
}) {
  const radiusClass =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.sm;
  const imageClassName = `aspect-[4/3] w-full ${radiusClass} object-cover shadow-md lg:aspect-[16/11]`;
  const alt1 = content.image1Alt || content.title || "City image 1";
  const alt2 = content.image2Alt || content.title || "City image 2";

  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      {isUsableImageSrc(content.image1) ? (
        <Image
          src={content.image1}
          alt={alt1}
          width={1200}
          height={900}
          className={imageClassName}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      ) : (
        <div className={`bg-surface-2 ${imageClassName}`} aria-hidden />
      )}
      {isUsableImageSrc(content.image2) ? (
        <Image
          src={content.image2}
          alt={alt2}
          width={1200}
          height={900}
          className={imageClassName}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      ) : (
        <div className={`bg-surface-2 ${imageClassName}`} aria-hidden />
      )}
    </div>
  );
}
