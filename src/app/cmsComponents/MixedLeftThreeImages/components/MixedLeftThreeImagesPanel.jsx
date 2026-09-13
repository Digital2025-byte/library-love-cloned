import PageContentContainer from "@/components/layout/PageContentContainer";
import MixedThreeImagesContent from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesContent";
import MixedThreeImagesCtas from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesCtas";
import MixedThreeImagesFeature from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesFeature";
import MixedThreeImagesSmallImages from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesSmallImages";

export default function MixedLeftThreeImagesPanel({
  lang = "en",
  title,
  description,
  links = [],
  primaryCta,
  secondaryCta,
  largeImage,
  smallImageOne,
  smallImageTwo,
}) {
  const isRtl = lang === "ar";

  return (
    <div className="w-full" dir={isRtl ? "rtl" : "ltr"}>
      <PageContentContainer>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-6 xl:gap-8">
          <MixedThreeImagesContent
            lang={lang}
            title={title}
            description={description}
            links={links}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
            className="order-1 lg:order-2 lg:col-start-2 lg:row-start-1"
          />

          <MixedThreeImagesSmallImages
            smallImageOne={smallImageOne}
            smallImageTwo={smallImageTwo}
            className="order-2 lg:order-3 lg:col-start-2 lg:row-start-2"
          />

          <MixedThreeImagesFeature
            image={largeImage}
            className="order-3 aspect-[16/10] h-auto rounded-2xl sm:rounded-3xl lg:order-1 lg:col-start-1 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-[34rem]"
            priority
          />

          <MixedThreeImagesCtas
            lang={lang}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
            fullWidth
            className="order-4 lg:hidden"
          />
        </div>
      </PageContentContainer>
    </div>
  );
}
