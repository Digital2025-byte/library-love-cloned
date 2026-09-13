import { getThemeColorCss } from "@/styles/themeColors";
import { getBackgroundDisplayStyle } from "@/app/cmsComponents/shared/backgroundImage";
import { isUsableImageSrc } from "../utils/helpers";
import {
  BANNER_RADIUS_CLASS,
  DEFAULT_BANNER_WITH_CTA_STYLE,
  HEIGHT_CLASS,
  SECTION_PADDING_CLASS,
  VERTICAL_ALIGN_CLASS,
} from "../utils/style";
import BannerWithCtaContent from "./BannerWithCtaContent";

function titleWash(overlayCss) {
  return `linear-gradient(90deg, color-mix(in srgb, ${overlayCss} 92%, transparent) 0%, color-mix(in srgb, ${overlayCss} 85%, transparent) 20%, color-mix(in srgb, ${overlayCss} 60%, transparent) 45%, color-mix(in srgb, ${overlayCss} 20%, transparent) 70%, transparent 100%)`;
}

export default function BannerWithCtaPanel({
  lang = "en",
  content,
  style = DEFAULT_BANNER_WITH_CTA_STYLE,
}) {
  const overlayCss = getThemeColorCss(style.overlayColor, "primary-1");
  const heroSrc =
    style.showHeroImage && isUsableImageSrc(content.backgroundImage)
      ? content.backgroundImage
      : "";
  const radiusClass =
    BANNER_RADIUS_CLASS[style.bannerRadius] ?? BANNER_RADIUS_CLASS.lg;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ?? SECTION_PADDING_CLASS.default;
  const verticalClass =
    VERTICAL_ALIGN_CLASS[style.verticalAlign] ?? VERTICAL_ALIGN_CLASS.center;
  const heightClass =
    HEIGHT_CLASS[style.bannerHeight] ?? HEIGHT_CLASS.default;
  const backgroundLayers = [
    style.showOverlay ? titleWash(overlayCss) : null,
    heroSrc ? `url(${heroSrc})` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={`flex w-full ${heightClass} ${verticalClass} ${paddingClass} ${radiusClass}`}
      aria-label={content.imageAlt || content.title || undefined}
      style={{
        backgroundImage: backgroundLayers || undefined,
        ...getBackgroundDisplayStyle(style),
        backgroundColor: heroSrc ? undefined : overlayCss,
      }}
    >
      <BannerWithCtaContent content={content} style={style} />
    </div>
  );
}
