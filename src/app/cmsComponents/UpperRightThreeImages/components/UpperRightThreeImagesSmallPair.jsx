import MixedImageTile from "@/app/cmsComponents/shared/MixedThreeImages/MixedImageTile";

/** Two equal stacked images — height follows the parent mosaic row. */
export default function UpperRightThreeImagesSmallPair({
  smallImageOne,
  smallImageTwo,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 sm:gap-4 lg:gap-5">
      <MixedImageTile
        image={smallImageOne}
        className="min-h-0 flex-1 rounded-2xl sm:rounded-3xl"
        sizes="(max-width: 1024px) 100vw, 28vw"
      />
      <MixedImageTile
        image={smallImageTwo}
        className="min-h-0 flex-1 rounded-2xl sm:rounded-3xl"
        sizes="(max-width: 1024px) 100vw, 28vw"
      />
    </div>
  );
}
