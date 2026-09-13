import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_HEADER_WITH_CITY_INFO_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";
import CityInfoCard from "./CityInfoCard";

export default function HeaderWithCityInfoPanel({
  lang = "en",
  content,
  style = DEFAULT_HEADER_WITH_CITY_INFO_STYLE,
}) {
  const isRtl = lang === "ar";
  const heroSrc =
    style.showHeroImage && isUsableImageSrc(content.backgroundImage)
      ? content.backgroundImage
      : "";
  const overlayCss = style.showOverlay
    ? getThemeColorCss(style.overlayColor, "main")
    : undefined;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const showHeading = style.showTitle && content.title;
  const showCountry = style.showDescription && content.countryName;

  return (
    <CustomBackgroundImage
      imageUrl={heroSrc}
      className="min-h-[75vh]"
      transition={{ duration: 5, ease: "easeInOut" }}
      specialGradient={style.showOverlay}
      overlayColor={overlayCss}
      lang={lang}
      imageFit={style.imageFit}
      imagePosition={style.imagePosition}
    >
      <section
        className="relative flex min-h-[75vh] w-full items-end"
        dir={isRtl ? "rtl" : "ltr"}
        aria-label={content.imageAlt || content.title || undefined}
        style={
          heroSrc
            ? undefined
            : { backgroundColor: getThemeColorCss(style.overlayColor, "main") }
        }
      >
        <PageContentContainer className="w-full pb-40 pt-20 lg:pb-16 lg:pt-28">
          <div className="flex w-full flex-col justify-between gap-10 md:flex-row md:items-center md:gap-8">
            {showHeading || showCountry ? (
              <div className={`flex max-w-xl flex-col justify-end ${alignClass}`}>
                {showHeading ? (
                  <h1
                    className={`${typography.sectionTitle} font-semibold leading-tight`}
                    style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight),
                    }}
                  >
                    {content.title}
                  </h1>
                ) : null}
                {showCountry ? (
                  <p
                    className={`${typography.sectionDescription} mt-2 font-normal`}
                    style={{ color: getThemeColorCss(style.descriptionColor, "white"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
                    }}
                  >
                    {content.countryName}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="hidden md:block" />
            )}

            {style.showCityCard && content.hasCityCard ? (
              <div className="hidden shrink-0 items-end justify-start md:flex md:justify-end">
                <CityInfoCard lang={lang} content={content} style={style} />
              </div>
            ) : null}
          </div>
        </PageContentContainer>
      </section>
    </CustomBackgroundImage>
  );
}
