import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { isUsableImageSrc } from "../utils/helpers";
import {
  BANNER_RADIUS_CLASS,
  DEFAULT_PROMO_BANNER_STYLE,
  HEIGHT_CLASS,
  resolveColor,
} from "../utils/style";

function navyWash(css, isRtl) {
  const to = isRtl ? "to left" : "to right";
  return `linear-gradient(${to}, ${css} 0%, color-mix(in srgb, ${css} 80%, transparent) 42%, color-mix(in srgb, ${css} 0%, transparent) 100%)`;
}

export default function PromoBannerPanel({
  lang = "en",
  content,
  style = DEFAULT_PROMO_BANNER_STYLE,
}) {
  const isRtl = lang === "ar";
  const radiusClass =
    BANNER_RADIUS_CLASS[style.bannerRadius] ?? BANNER_RADIUS_CLASS.lg;
  const heightClass = HEIGHT_CLASS[style.bannerHeight] ?? HEIGHT_CLASS.default;
  const overlayCss = resolveColor(style.overlayColor, "secondary-2");
  const heroSrc = isUsableImageSrc(content.image) ? content.image : "";

  return (
    <div
      className={`relative flex w-full items-center overflow-hidden px-5 py-8 sm:px-10 md:px-14 md:py-12 ${heightClass} ${radiusClass}`}
    >
      {heroSrc ? (
        <img
          src={heroSrc}
          alt={content.imageAlt || ""}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}
      {style.showOverlay ? (
        <div
          className="absolute inset-0 z-[1]"
          style={{ backgroundImage: navyWash(overlayCss, isRtl) }}
          aria-hidden
        />
      ) : null}

      <div className="relative z-[2] flex max-w-xl flex-col gap-3 md:gap-5">
        {style.showTitle && content.title ? (
          <h2
            className={`${typography.sectionTitle} m-0`}
            style={{
              color: getThemeColorCss(style.titleColor, "50"),
              fontWeight: getFontWeightValue(style.titleFontWeight),
            }}
          >
            {content.title}
          </h2>
        ) : null}
        {style.showDescription && content.description ? (
          <p
            className={`${typography.sectionDescription} m-0 leading-relaxed`}
            style={{
              color: getThemeColorCss(style.descriptionColor, "50"),
              fontWeight: getFontWeightValue(style.descriptionFontWeight),
            }}
          >
            {content.description}
          </p>
        ) : null}
        {style.showButton && content.ctaLabel ? (
          <Button
            label={content.ctaLabel}
            href={content.ctaHref === "#" ? undefined : content.ctaHref}
            style={{
              backgroundColor: getThemeColorCss(style.buttonBg, "secondary"),
              borderColor: getThemeColorCss(style.buttonBg, "secondary"),
              color: getThemeColorCss(style.buttonText, "btn"),
              fontWeight: getFontWeightValue(style.buttonFontWeight),
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
