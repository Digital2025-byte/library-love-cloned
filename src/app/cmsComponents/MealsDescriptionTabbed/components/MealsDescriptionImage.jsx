import Image from "next/image";
import { isUsableImageSrc } from "../utils/helpers";
import { DEFAULT_MEALS_TABBED_STYLE, IMAGE_RADIUS_CLASS } from "../utils/style";

export default function MealsDescriptionImage({
  image,
  tabKey = "",
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  if (!isUsableImageSrc(image?.fileUrl)) {
    return null;
  }

  const radiusClass =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.full;

  return (
    <div className="lg:sticky lg:top-24 lg:col-span-4">
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-surface-2 shadow-sm ${radiusClass}`}
      >
        <Image
          key={tabKey || image.fileUrl}
          src={image.fileUrl}
          alt={image.alt || ""}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 33vw"
          priority={false}
        />
      </div>
    </div>
  );
}
