import Image from "next/image";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { getObjectFitClass } from "@/app/cmsComponents/shared/backgroundImage";
import ServiceBenefitItem from "./ServiceBenefitItem";
import { isUsableImageSrc } from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_SERVICE_BENEFITS_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function ServiceBenefitsPanel({
  mainTitle,
  backgroundImage,
  benefits = [],
  itemLinkParts = null,
  style = DEFAULT_SERVICE_BENEFITS_STYLE,
}) {
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.sm;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.center;
  const canShowImage =
    style.showBackgroundImage && isUsableImageSrc(backgroundImage);
  const overlayColor = getThemeColorCss(style.overlayColor, "secondary-2");

  return (
    <div
      className={`relative w-full overflow-hidden md:min-h-64 lg:min-h-72 ${radiusClass}`}
    >
      {canShowImage ? (
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          quality={75}
          className={getObjectFitClass(style)}
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      ) : null}

      {style.showOverlay ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `color-mix(in srgb, ${overlayColor} 70%, transparent)`,
          }}
          aria-hidden
        />
      ) : null}

      <div className="relative z-10 mb-4 flex h-full flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 md:mb-0 md:px-8 md:py-12 lg:px-14 lg:py-14">
        {style.showTitle && mainTitle ? (
          <h2
            className={`${typography.sectionTitle} font-semibold ${alignClass}`}
            style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {mainTitle}
          </h2>
        ) : null}

        {benefits.length ? (
          <div className="mt-8 flex flex-col gap-8 sm:mt-9 sm:gap-9 md:mt-10 md:grid md:grid-cols-3 md:items-start md:gap-5 lg:mt-12 lg:gap-10 xl:gap-12">
            {benefits.map((benefit, index) => (
              <ServiceBenefitItem
                key={`${benefit?.title || "benefit"}-${index}`}
                title={benefit?.title}
                description={benefit?.description}
                titleParts={itemLinkParts?.[index]?.titleParts}
                bodyParts={itemLinkParts?.[index]?.bodyParts}
                icon={benefit?.icon}
                style={style}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
