import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_HERO_MASK,
  DEFAULT_PAGE_HERO_STYLE,
  IMAGE_RADIUS_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

function maskStyle(mask) {
  return {
    WebkitMaskImage: `url(${mask})`,
    maskImage: `url(${mask})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

export default function PageHeroPanel({
  content,
  style = DEFAULT_PAGE_HERO_STYLE,
}) {
  const showTitle = style.showTitle && content.title;
  const showSubtitle = style.showSubtitle && content.subtitle;
  const heroSrc =
    style.showImage && isUsableImageSrc(content.image) ? content.image : "";
  const mask =
    heroSrc && style.showMask
      ? isUsableImageSrc(content.mask)
        ? content.mask
        : DEFAULT_HERO_MASK
      : "";
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const radiusClass =
    IMAGE_RADIUS_CLASS[style.imageRadius] ?? IMAGE_RADIUS_CLASS.lg;
  const titleCss = getThemeColorCss(style.titleColor, "primary-1");
  const subtitleCss = getThemeColorCss(style.subtitleColor, "700");

  if (!showTitle && !showSubtitle && !heroSrc) {
    return null;
  }

  const imageOrderClass =
    style.imageSide === "left" ? "md:order-1" : "md:order-2";
  const textOrderClass =
    style.imageSide === "left" ? "md:order-2" : "md:order-1";

  const textBlock = (
    <div
      className={`flex flex-1 flex-col gap-2 md:gap-4 ${
        heroSrc ? textOrderClass : ""
      } ${alignClass}`}
    >
      {showTitle ? (
        <h1
          className={`${typography.pageTitle} leading-tight m-0`}
          style={{
            color: titleCss,
            fontWeight: getFontWeightValue(style.titleFontWeight),
          }}
        >
          {content.title}
        </h1>
      ) : null}
      {showSubtitle ? (
        <p
          className={`${typography.sectionDescription} m-0`}
          style={{
            color: subtitleCss,
            fontWeight: getFontWeightValue(style.subtitleFontWeight),
          }}
        >
          {content.subtitle}
        </p>
      ) : null}
    </div>
  );

  if (!heroSrc) {
    return textBlock;
  }

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10 lg:gap-14">
      <div className={`shrink-0 md:w-1/2 lg:w-[54%] ${imageOrderClass}`}>
        <img
          src={heroSrc}
          alt={content.imageAlt || ""}
          className={`w-full h-auto object-cover object-[center_20%] aspect-[380/180] ${radiusClass} ${
            mask ? "md:hidden" : ""
          }`}
        />
        {mask ? (
          <div
            className="hidden md:block w-full aspect-[573/330] rtl:-scale-x-100"
            style={maskStyle(mask)}
          >
            <div
              className="w-full h-full bg-cover bg-[position:center_20%] rtl:-scale-x-100"
              style={{ backgroundImage: `url(${heroSrc})` }}
              role="img"
              aria-label={content.imageAlt || ""}
            />
          </div>
        ) : null}
      </div>
      {textBlock}
    </div>
  );
}
