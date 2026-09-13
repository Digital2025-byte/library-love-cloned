import MixedImageTile from "./MixedImageTile";
import {
  DEFAULT_MIXED_THREE_IMAGES_STYLE,
  IMAGE_RADIUS_CLASS,
} from "@/app/cmsComponents/MixedRightThreeImages/utils/style";

export default function MixedThreeImagesSmallImages({
  smallImageOne,
  smallImageTwo,
  className = "",
  style = DEFAULT_MIXED_THREE_IMAGES_STYLE,
}) {
  const radiusClass =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.full;

  return (
    <div
      className={`grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-5 ${className}`.trim()}
    >
      <MixedImageTile
        image={smallImageOne}
        className={`aspect-square ${radiusClass} lg:aspect-auto lg:h-full lg:min-h-[14rem]`}
        sizes="(max-width: 1024px) 50vw, 25vw"
      />
      <MixedImageTile
        image={smallImageTwo}
        className={`aspect-square ${radiusClass} lg:aspect-auto lg:h-full lg:min-h-[14rem]`}
        sizes="(max-width: 1024px) 50vw, 25vw"
      />
    </div>
  );
}
