import Button from "@/components/ui/Button";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { TITLE_ALIGN_JUSTIFY, TITLE_ALIGN_TEXT } from "../utils/style";

export default function SliderSlideContent({
  lang = "en",
  title = "",
  subtitle = "",
  description = "",
  descriptionParts,
  buttonText = "",
  ctaHref = "",
  posParams = "gb",
  cId,
  style,
}) {
  const isRtl = lang === "ar";
  const resolvedHref = ctaHref
    ? String(ctaHref).startsWith("/")
      ? ctaHref
      : `/${posParams}/${lang}/${String(ctaHref).replace(/^\//, "")}`
    : "";

  const canShowSubtitle =
    style.showSlideText && style.showSubtitleText && subtitle;
  const canShowTitle = style.showSlideText && style.showTitleText && title;
  const canShowDescription =
    style.showSlideText && style.showDescriptionText && description;
  const showCopy = canShowSubtitle || canShowTitle || canShowDescription;
  const showCta = style.showButton && buttonText && resolvedHref;
  const showLinks = style.showLinks !== false;
  const alignJustify =
    TITLE_ALIGN_JUSTIFY[style.titleAlign] ?? TITLE_ALIGN_JUSTIFY.left;
  const alignText = TITLE_ALIGN_TEXT[style.titleAlign] ?? TITLE_ALIGN_TEXT.left;

  if (!showCopy && !showCta) {
    return null;
  }

  return (
    <div
      className={`flex w-full pb-6 sm:pb-8 md:pb-12 lg:pb-16 ${alignJustify}`}
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={`w-full max-w-lg ${alignText}`}
      >
        {canShowSubtitle ? (
          <p
            className={`${typography.sectionDescription} font-medium`}
            style={{ color: getThemeColorCss(style.subtitleColor, "white"), fontWeight: getFontWeightValue(style.subtitleFontWeight) }}
          >
            {subtitle}
          </p>
        ) : null}

        {canShowTitle ? (
          <h1
            className={`${typography.sectionTitle} mt-1 font-bold leading-tight sm:mt-2 md:mt-3`}
            style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {title}
          </h1>
        ) : null}

        {canShowDescription ? (
          <p
            className={`${typography.sectionDescription} mt-2 sm:mt-3`}
            style={{ color: getThemeColorCss(style.descriptionColor, "white"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
          >
            <LinkedText
              text={description}
              parts={descriptionParts}
              style={style}
              enabled={showLinks}
            />
          </p>
        ) : null}

        {showCta ? (
          <div className="pointer-events-auto mt-4 sm:mt-5 md:mt-6">
            <Button
              label={buttonText}
              href={resolvedHref}
              cId={cId}
              variant={style.buttonVariant}
              className={`slider-hero-cta slider-hero-cta-${style.buttonVariant} min-w-[120px] sm:min-w-[140px] md:min-w-[180px]`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
