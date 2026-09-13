"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import AnimatedCTAButton from "@/components/ui/AnimatedCTAButton";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { withCampaignPath } from "@/utils/withCampaignPath";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { getImageUrl, isUsableImageSrc } from "../utils/helpers";
import { CARD_RADIUS_CLASS, CARD_RADIUS_TOP_CLASS } from "../utils/style";

export default function CarouselCard({
  card,
  lang = "en",
  cId,
  style,
  titleParts,
  bodyParts,
}) {
  const { t } = useTranslation();

  if (!card) {
    return null;
  }

  const imageSrc = getImageUrl(card?.image?.fileUrl || card?.imageUrl);
  const imageWidth = Number(card?.image?.width) || 0;
  const imageHeight = Number(card?.image?.height) || 0;
  const title = card?.title || "";
  const description = card?.description || "";
  const buttonLabel = card?.buttonText || t("relatedContentCarousel.learnMore");
  const buttonLink = card?.buttonLink || "#";
  const isRtl = lang === "ar";
  const canShowImage = style.showCardImage && isUsableImageSrc(imageSrc);
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const radiusTopClass =
    CARD_RADIUS_TOP_CLASS[style.cardRadius] ?? CARD_RADIUS_TOP_CLASS.lg;
  const pillCss = getThemeColorCss(style.buttonBg, "primary-1");
  const labelCss = getThemeColorCss(style.buttonText, "primary-1");
  const onFillCss = getThemeColorCss(style.buttonOnFill, "white");

  return (
    <article className="h-full w-full" dir={isRtl ? "rtl" : "ltr"}>
      <div
        className={`flex h-full w-full flex-col overflow-visible border border-200 shadow-sm ${radiusClass}`}
        style={{ backgroundColor: getThemeColorCss(style.cardBg, "white") }}
      >
        {canShowImage ? (
          <div
            className={`relative w-full shrink-0 overflow-hidden ${radiusTopClass}`}
          >
            {imageWidth > 0 && imageHeight > 0 ? (
              <Image
                src={imageSrc}
                alt={card?.image?.alt || title || ""}
                width={imageWidth}
                height={imageHeight}
                className="h-auto w-full"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imageSrc}
                  alt={card?.image?.alt || title || ""}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ) : style.showCardImage ? (
          <div
            className={`relative aspect-[4/3] w-full shrink-0 bg-surface-1 ${radiusTopClass}`}
            aria-hidden
          />
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {style.showCardTitle && title ? (
            <h3
              className={`${typography.itemTitle} mb-2 font-semibold leading-snug`}
              style={{
                color: getThemeColorCss(style.cardTitleColor, "secondary-2"),
                fontWeight: getFontWeightValue(style.cardTitleFontWeight),
              }}
            >
              <LinkedText
                text={title}
                parts={titleParts}
                links={card.links}
                style={style}
                enabled={style.showLinks !== false}
              />
            </h3>
          ) : null}

          {style.showCardDescription && description ? (
            <p
              className={`${typography.itemDescription} mb-5 leading-relaxed`}
              style={{
                color: getThemeColorCss(style.cardBodyColor, "600"),
                fontWeight: getFontWeightValue(style.cardBodyFontWeight),
              }}
            >
              <LinkedText
                text={description}
                parts={bodyParts}
                links={card.links}
                style={style}
                enabled={style.showLinks !== false}
              />
            </p>
          ) : null}

          {style.showButton && buttonLabel ? (
            <div className="mt-auto flex w-full justify-end overflow-visible">
              <AnimatedCTAButton
                lang={lang}
                href={withCampaignPath(buttonLink, cId)}
                label={buttonLabel}
                arrowColor={onFillCss}
                textColor={labelCss}
                bgColor={pillCss}
                bgFillColor={pillCss}
                textFillColor={onFillCss}
                arrowFillColor={onFillCss}
                mobileTextColor={onFillCss}
                mobileArrowColor={onFillCss}
                mobileBgColor={pillCss}
              />
            </div>
          ) : (
            <div className="mt-auto" />
          )}
        </div>
      </div>
    </article>
  );
}
