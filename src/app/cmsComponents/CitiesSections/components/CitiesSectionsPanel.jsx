import Button from "@/components/ui/Button";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import CitiesSectionsImages from "./CitiesSectionsImages";
import CitiesSectionsText from "./CitiesSectionsText";
import {
  DEFAULT_CITIES_SECTIONS_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function CitiesSectionsPanel({
  lang = "en",
  cId,
  content,
  style = DEFAULT_CITIES_SECTIONS_STYLE,
}) {
  const isRtl = lang === "ar";
  const imagesOnRight = style.imageSide !== "left";
  const textOrder = imagesOnRight ? "order-1" : "order-1 lg:order-2";
  const imagesOrder = imagesOnRight ? "order-2" : "order-2 lg:order-1";
  const showMobileCta =
    style.showCta && content.isCTA && content.ctaLabel && content.ctaHref;
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const buttonBg = getThemeColorCss(style.buttonBg, "primary-2");
  const buttonText = getThemeColorCss(style.buttonText, "white");

  return (
    <section
      className="relative"
      dir={isRtl ? "rtl" : "ltr"}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "primary-800"),
            }
          : undefined
      }
    >
      <PageContentContainer className={paddingClass}>
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className={`${textOrder} min-h-0`}>
            <CitiesSectionsText
              content={content}
              style={style}
              cId={cId}
            />
          </div>

          {style.showImages ? (
            <div className={imagesOrder}>
              <CitiesSectionsImages content={content} style={style} />
            </div>
          ) : null}

          {showMobileCta ? (
            <div className="order-3 lg:hidden">
              <Button
                label={content.ctaLabel}
                href={content.ctaHref}
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
      </PageContentContainer>
    </section>
  );
}
