import { getThemeColorCss } from "@/styles/themeColors";
import { isUsableImageSrc } from "../utils/helpers";
import {
  BANNER_RADIUS_CLASS,
  DEFAULT_CTA_BANNER_STYLE,
  HEIGHT_CLASS,
  VERTICAL_ALIGN_CLASS,
} from "../utils/style";
import CtaBannerContent from "./CtaBannerContent";

/** Mobile wash — holds the colour to 40% then fades (source ltr/rtl base). */
function washMobile(overlayCss, isRtl) {
  const to = isRtl ? "to left" : "to right";
  return `linear-gradient(${to}, ${overlayCss} 0%, ${overlayCss} 40%, color-mix(in srgb, ${overlayCss} 0%, transparent) 100%)`;
}

/** Desktop wash — lighter 2-stop fade from the edge (source md: variant). */
function washDesktop(overlayCss, isRtl) {
  const to = isRtl ? "to left" : "to right";
  return `linear-gradient(${to}, ${overlayCss} 0%, color-mix(in srgb, ${overlayCss} 0%, transparent) 100%)`;
}

export default function CtaBannerPanel({
  lang = "en",
  content,
  style = DEFAULT_CTA_BANNER_STYLE,
}) {
  const isRtl = lang === "ar";
  const overlayCss = getThemeColorCss(style.overlayColor, "primary-1");
  const heroSrc =
    style.showHeroImage && isUsableImageSrc(content.backgroundImage)
      ? content.backgroundImage
      : "";
  const radiusClass =
    BANNER_RADIUS_CLASS[style.bannerRadius] ?? BANNER_RADIUS_CLASS.lg;
  const verticalClass =
    VERTICAL_ALIGN_CLASS[style.verticalAlign] ?? VERTICAL_ALIGN_CLASS.center;
  const heightClass = HEIGHT_CLASS[style.bannerHeight] ?? HEIGHT_CLASS.default;

  return (
    <div
      className={`relative flex w-full overflow-hidden bg-cover bg-center bg-no-repeat px-5 py-8 sm:px-12 md:px-20 md:py-16 ${heightClass} ${verticalClass} ${radiusClass}`}
      aria-label={content.imageAlt || content.title || undefined}
      style={{
        backgroundImage: heroSrc ? `url(${heroSrc})` : undefined,
        backgroundColor: heroSrc ? undefined : overlayCss,
      }}
    >
      {style.showOverlay ? (
        <>
          <div
            className="absolute inset-0 z-[1] md:hidden"
            style={{ backgroundImage: washMobile(overlayCss, isRtl) }}
            aria-hidden
          />
          <div
            className="absolute inset-0 z-[1] hidden md:block"
            style={{ backgroundImage: washDesktop(overlayCss, isRtl) }}
            aria-hidden
          />
        </>
      ) : null}
      <div className="relative z-[2] w-full">
        <CtaBannerContent content={content} style={style} />
      </div>
    </div>
  );
}
