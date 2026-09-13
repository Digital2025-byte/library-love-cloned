import PageContentContainer from "@/components/layout/PageContentContainer";
import MixedThreeImagesContent from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesContent";
import MixedThreeImagesCtas from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesCtas";
import MixedThreeImagesFeature from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesFeature";
import MixedThreeImagesSmallImages from "@/app/cmsComponents/shared/MixedThreeImages/MixedThreeImagesSmallImages";
import { MIXED_THREE_IMAGES_LAYOUT_CLASS } from "../utils/style";

export default function MixedRightThreeImagesPanel({
  lang = "en",
  content,
  style,
}) {
  const isRtl = lang === "ar";
  const layout =
    MIXED_THREE_IMAGES_LAYOUT_CLASS[style.imageSide] ??
    MIXED_THREE_IMAGES_LAYOUT_CLASS.right;

  const copy = {
    lang,
    title: content.title,
    description: content.description,
    links: content.links || [],
    primaryCta: content.primaryCta,
    secondaryCta: content.secondaryCta,
    style,
  };

  return (
    <div className="w-full" dir={isRtl ? "rtl" : "ltr"}>
      <PageContentContainer>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-6 xl:gap-8">
          <MixedThreeImagesContent {...copy} className={layout.content} />

          {style.showSmallImages ? (
            <MixedThreeImagesSmallImages
              smallImageOne={content.smallImageOne}
              smallImageTwo={content.smallImageTwo}
              className={layout.small}
              style={style}
            />
          ) : null}

          {style.showLargeImage ? (
            <MixedThreeImagesFeature
              image={content.largeImage}
              className={layout.feature}
              style={style}
              priority
            />
          ) : null}

          <MixedThreeImagesCtas
            lang={lang}
            primaryCta={content.primaryCta}
            secondaryCta={content.secondaryCta}
            style={style}
            fullWidth
            className="order-4 lg:hidden"
          />
        </div>
      </PageContentContainer>
    </div>
  );
}
