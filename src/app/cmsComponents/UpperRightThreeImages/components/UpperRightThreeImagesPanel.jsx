import PageContentContainer from "@/components/layout/PageContentContainer";
import MixedImageTile from "@/app/cmsComponents/shared/MixedThreeImages/MixedImageTile";
import MixedThreeImagesCtas from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesCtas";
import UpperRightThreeImagesContent from "./UpperRightThreeImagesContent";
import UpperRightThreeImagesSmallPair from "./UpperRightThreeImagesSmallPair";

export default function UpperRightThreeImagesPanel({
  lang = "en",
  cId,
  title = "",
  description = "",
  primaryCta,
  secondaryCta,
  largeImage,
  smallImageOne,
  smallImageTwo,
  /** "right" = large left / smalls right; "left" = smalls left / large right */
  side = "right",
}) {
  const isRtl = lang === "ar";
  const smallsOnLeft = side === "left";

  const largeTile = (
    <MixedImageTile
      image={largeImage}
      className="h-full rounded-3xl"
      sizes="66vw"
      priority
    />
  );

  const smallPair = (
    <UpperRightThreeImagesSmallPair
      smallImageOne={smallImageOne}
      smallImageTwo={smallImageTwo}
    />
  );

  return (
    <div className="w-full" dir={isRtl ? "rtl" : "ltr"}>
      <PageContentContainer>
        <div className="rounded-3xl bg-primary-1 p-4 sm:rounded-4xl sm:p-5 lg:p-6 xl:p-8">
          {/* Mobile: large → title → description → small1 → small2 → CTAs */}
          <div className="flex flex-col gap-4 lg:hidden">
            <MixedImageTile
              image={largeImage}
              className="aspect-[16/10] w-full rounded-2xl"
              sizes="100vw"
              priority
            />

            <UpperRightThreeImagesContent
              title={title}
              description={description}
            />

            <MixedImageTile
              image={smallImageOne}
              className="aspect-[16/10] w-full rounded-2xl"
              sizes="100vw"
            />
            <MixedImageTile
              image={smallImageTwo}
              className="aspect-[16/10] w-full rounded-2xl"
              sizes="100vw"
            />

            <MixedThreeImagesCtas
              lang={lang}
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
              fullWidth
              className="mt-1"
            />
          </div>

          {/* Desktop: mosaic (flipped by `side`) + content below */}
          <div className="hidden lg:block">
            <div
              className={`grid h-[280px] gap-5 xl:h-[340px] 2xl:h-[380px] ${
                smallsOnLeft
                  ? "grid-cols-[1fr_2fr]"
                  : "grid-cols-[2fr_1fr]"
              }`}
            >
              {smallsOnLeft ? (
                <>
                  {smallPair}
                  {largeTile}
                </>
              ) : (
                <>
                  {largeTile}
                  {smallPair}
                </>
              )}
            </div>

            <div className="mt-8">
              <UpperRightThreeImagesContent
                title={title}
                description={description}
              />
              <MixedThreeImagesCtas
                lang={lang}
                primaryCta={primaryCta}
                secondaryCta={secondaryCta}
                className="mt-6"
              />
            </div>
          </div>
        </div>
      </PageContentContainer>
    </div>
  );
}
