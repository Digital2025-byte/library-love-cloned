import MixedImageTile from "./MixedImageTile";
import {
  DEFAULT_MIXED_THREE_IMAGES_STYLE,
  IMAGE_RADIUS_CLASS,
} from "@/app/cmsComponents/MixedRightThreeImages/utils/style";

export default function MixedThreeImagesFeature({
  image,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  style = DEFAULT_MIXED_THREE_IMAGES_STYLE,
}) {
  const radiusClass =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.full;

  return (
    <MixedImageTile
      image={image}
      className={`${radiusClass} ${className}`.trim()}
      sizes={sizes}
      priority={priority}
    />
  );
}
