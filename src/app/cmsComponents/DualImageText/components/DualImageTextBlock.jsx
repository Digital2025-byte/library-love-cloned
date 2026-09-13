import Image from "next/image";
import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_EXTRA_IMAGE_POSITION,
  imageSrc,
  isUsableImageSrc,
  resolveExtraImagePosition,
} from "../utils/helpers";
import DualImageTextTitle from "./DualImageTextTitle";
import {
  DEFAULT_DUAL_IMAGE_TEXT_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function DualImageTextBlock({
  item,
  titleParts,
  bodyParts,
  reverse = false,
  priority = false,
  extraImageUrl = "",
  extraImageAlt = "",
  extraImagePosition = DEFAULT_EXTRA_IMAGE_POSITION,
  exploreButtonLabel = "Explore more",
  exploreButtonHref = "explore",
  cId,
  style = DEFAULT_DUAL_IMAGE_TEXT_STYLE,
}) {
  if (!item?.title && !item?.description && !item?.imageUrl) {
    return null;
  }

  const shadowClass = reverse
    ? "shadow-[-10px_-10px_0_0_var(--color-main)]"
    : "shadow-[10px_10px_0_0_var(--color-main)]";

  const buttonLabel = item.buttonText || exploreButtonLabel;
  const buttonHref = item.ctaHref || exploreButtonHref;
  const hasExtraImage =
    style.showExtraImage && isUsableImageSrc(extraImageUrl);
  const { overlayStyle } = resolveExtraImagePosition(extraImagePosition);
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const buttonBg = getThemeColorCss(style.buttonBg, "primary-2");
  const buttonText = getThemeColorCss(style.buttonText, "white");
  const mainSrc = imageSrc(item.imageUrl);
  const extraSrc = imageSrc(extraImageUrl);
  const showLinks = style.showLinks !== false;

  return (
    <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div
        className={`relative w-full overflow-visible ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {isUsableImageSrc(mainSrc) ? (
          <Image
            src={mainSrc}
            alt={item.imageAlt || item.title || "Section image"}
            width={1000}
            height={750}
            className={`relative z-0 aspect-4/3 h-auto w-full object-cover ${
              style.blueLayer ? shadowClass : "rounded-2xl"
            }`}
            priority={priority}
            quality={75}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}

        {hasExtraImage ? (
          <div className="absolute z-10" style={overlayStyle}>
            <Image
              src={extraSrc}
              alt={extraImageAlt || item.imageAlt || "Detail image"}
              width={640}
              height={480}
              className="aspect-4/3 h-auto w-full rounded-2xl object-cover shadow-md"
              quality={75}
              sizes="(max-width: 1024px) 45vw, 20vw"
            />
          </div>
        ) : null}
      </div>

      <div
        className={`flex flex-col justify-center ${alignClass} ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {style.showTitle ? (
          <DualImageTextTitle
            text={item.title}
            titleParts={titleParts}
            underlineFirstWord={style.underlineFirstWord}
            style={style}
          />
        ) : null}
        {style.showDescription
          ? (item.descriptions?.length
              ? item.descriptions
              : item.description
                ? [item.description]
                : []
            ).map((paragraph, index) => (
              <p
                key={`${item.title}-p-${index}`}
                className={`${typography.sectionDescription} mt-4 leading-relaxed wrap-break-word text-start lg:mt-6 lg:text-justify`}
                style={{ color: getThemeColorCss(style.descriptionColor, "700"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
                }}
              >
                <LinkedText
                  text={paragraph}
                  parts={index === 0 ? bodyParts : undefined}
                  links={index === 0 ? undefined : item.links || []}
                  style={style}
                  enabled={showLinks}
                />
              </p>
            ))
          : null}
        {style.showExploreButton && buttonLabel ? (
          <div className="mt-5 sm:mt-6">
            <Button
              label={buttonLabel}
              href={buttonHref}
              cId={cId}
              variant="primary"
              style={{
                backgroundColor: buttonBg,
                borderColor: buttonBg,
                color: buttonText,
                fontWeight: getFontWeightValue(style.buttonTextFontWeight),
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
