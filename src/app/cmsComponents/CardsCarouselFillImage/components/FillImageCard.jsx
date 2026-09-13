"use client";

import Image from "next/image";
import AnimatedCTAButton from "@/components/ui/AnimatedCTAButton";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { withCampaignPath } from "@/utils/withCampaignPath";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { getImageUrl, isUsableImageSrc } from "../utils/helpers";
import { CARD_RADIUS_CLASS } from "../utils/style";

export default function FillImageCard({
  card,
  lang = "en",
  cId,
  style,
  titleParts,
  bodyParts,
}) {
  if (!card) {
    return null;
  }

  const imageSrc = getImageUrl(card?.image?.fileUrl || card?.imageUrl);
  const title = card?.title || "";
  const description = card?.description || "";
  const buttonLabel =
    card?.buttonText || (lang === "ar" ? "اعرف المزيد" : "Learn More");
  const buttonLink = card?.buttonLink || "#";
  const canShowImage = style.showCardImage && isUsableImageSrc(imageSrc);
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const overlayCss = getThemeColorCss(style.overlayColor, "foreground");
  const pillCss = getThemeColorCss(style.buttonBg, "white");
  const labelCss = getThemeColorCss(style.buttonText, "white");
  const onFillCss = getThemeColorCss(style.buttonOnFill, "primary-1");
  const showCopy =
    (style.showCardTitle && title) ||
    (style.showCardDescription && description) ||
    (style.showButton && buttonLabel);

  return (
    <article
      data-fill-card
      className="m-0 flex w-full p-0"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`group relative h-95 w-full overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg md:h-105 ${radiusClass}`}
      >
        {canShowImage ? (
          <Image
            src={imageSrc}
            alt={card?.image?.alt || title || "Card image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 34vw"
            loading="lazy"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gray-300 ${radiusClass}`}
          >
            {style.showCardImage ? (
              <span className="text-sm text-gray-500">No image</span>
            ) : null}
          </div>
        )}

        {style.showOverlay ? (
          <div
            className={`pointer-events-none absolute inset-0 ${radiusClass}`}
            style={{
              backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${overlayCss} 90%, transparent) 0%, color-mix(in srgb, ${overlayCss} 55%, transparent) 45%, color-mix(in srgb, ${overlayCss} 15%, transparent) 100%)`,
            }}
            aria-hidden
          />
        ) : null}

        {showCopy ? (
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col px-6 pb-7 pt-10 sm:px-7 sm:pb-8 md:px-8 md:pb-8">
            {style.showCardTitle && title ? (
              <h3
                className="mb-2 line-clamp-2 text-lg font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] sm:mb-3 sm:text-xl md:text-2xl"
                style={{
                  color: getThemeColorCss(style.cardTitleColor, "white"),
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
                className="mb-4 line-clamp-3 text-sm font-normal leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] sm:mb-5 sm:text-base md:text-[0.95rem] md:leading-relaxed"
                style={{
                  color: getThemeColorCss(style.cardBodyColor, "white"),
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
              <div className="mt-auto min-h-15 w-fit max-w-full overflow-visible">
                <AnimatedCTAButton
                  lang={lang}
                  href={withCampaignPath(buttonLink, cId)}
                  label={buttonLabel}
                  gapClassName="gap-5"
                  arrowColor={onFillCss}
                  textColor={labelCss}
                  bgColor={pillCss}
                  bgFillColor={pillCss}
                  textFillColor={onFillCss}
                  arrowFillColor={onFillCss}
                  mobileBgColor={pillCss}
                  mobileTextColor={onFillCss}
                  mobileArrowColor={onFillCss}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
