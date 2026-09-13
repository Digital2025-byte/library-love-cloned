import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_BANNER_WITH_CTAS_STYLE,
  HEIGHT_CLASS,
  TITLE_JUSTIFY_CLASS,
  VERTICAL_ALIGN_CLASS,
} from "../utils/style";
import BannerWithCTAsAndItemsContent from "./BannerWithCTAsAndItemsContent";

export default function BannerWithCTAsAndItemsPanel({
  lang = "en",
  content,
  style = DEFAULT_BANNER_WITH_CTAS_STYLE,
  cId,
}) {
  const heroSrc =
    style.showHeroImage && isUsableImageSrc(content.backgroundImage)
      ? content.backgroundImage
      : "";
  const overlayCss = style.showOverlay
    ? getThemeColorCss(style.overlayColor, "main")
    : undefined;
  const sectionBgCss = getThemeColorCss(style.sectionBg, "main");
  const heightClass =
    HEIGHT_CLASS[style.bannerHeight] ?? HEIGHT_CLASS.default;
  const verticalClass =
    VERTICAL_ALIGN_CLASS[style.verticalAlign] ?? VERTICAL_ALIGN_CLASS.center;
  const alignKey =
    style.titleAlign in TITLE_JUSTIFY_CLASS ? style.titleAlign : "left";
  const justifyClass = TITLE_JUSTIFY_CLASS[alignKey];

  const fallbackBg = style.showSectionBg
    ? sectionBgCss
    : heroSrc
      ? undefined
      : getThemeColorCss(style.overlayColor, "main");

  return (
    <CustomBackgroundImage
      imageUrl={heroSrc}
      desktopGradient={style.showOverlay}
      overlayColor={overlayCss}
      lang={lang}
      imageFit={style.imageFit}
      imagePosition={style.imagePosition}
      className={`w-full ${heightClass}`}
      style={fallbackBg ? { backgroundColor: fallbackBg } : undefined}
    >
      <PageContentContainer
        className={`flex w-full ${heightClass} ${verticalClass} ${justifyClass}`}
        aria-label={content.imageAlt || content.title || undefined}
      >
        <BannerWithCTAsAndItemsContent
          content={content}
          style={style}
          cId={cId}
        />
      </PageContentContainer>
    </CustomBackgroundImage>
  );
}
