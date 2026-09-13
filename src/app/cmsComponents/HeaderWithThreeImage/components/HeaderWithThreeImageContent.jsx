import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
  TITLE_ALIGN_CLASS,
  TITLE_ITEMS_CLASS,
  TITLE_JUSTIFY_CLASS,
} from "../utils/style";

export default function HeaderWithThreeImageContent({
  lang = "en",
  content,
  style = DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE,
  cId,
}) {
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeftIcon : ArrowRightIcon;
  const title = content.title;
  const description = content.description;
  const links = content.links || [];
  const buttonLabel = content.buttonText;
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;
  const showCta = style.showButton && buttonLabel;

  if (!showHeading && !showCopy && !showCta) {
    return null;
  }

  const alignKey =
    style.titleAlign in TITLE_ALIGN_CLASS ? style.titleAlign : "left";
  const isCenter = alignKey === "center";
  const alignClass = TITLE_ALIGN_CLASS[alignKey];
  const justifyClass = TITLE_JUSTIFY_CLASS[alignKey];
  const itemsClass = TITLE_ITEMS_CLASS[alignKey];
  const pillCss = getThemeColorCss(style.buttonBg, "primary-2");
  const labelCss = getThemeColorCss(style.buttonText, "white");

  return (
    <PageContentContainer
      className={`relative z-10 flex w-full ${justifyClass}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className={`flex max-w-xl flex-col py-6 sm:py-8 ${alignClass} ${itemsClass}`}
      >
        {showHeading ? (
          <h1
            className={`${typography.pageTitle} mt-2 font-semibold`}
            style={{ color: getThemeColorCss(style.titleColor, "50"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {title}
          </h1>
        ) : null}
        {showCopy ? (
          <p
            className={`${typography.sectionDescription} mt-2 max-w-sm leading-relaxed ${
              isCenter
                ? "text-center"
                : alignKey === "right"
                  ? "text-end"
                  : "text-justify"
            }`}
            style={{ color: getThemeColorCss(style.descriptionColor, "50"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
          >
            <LinkedText
              text={description}
              links={links}
              style={style}
              enabled={style.showLinks !== false}
            />
          </p>
        ) : null}
        {showCta ? (
          <div className="mt-5 sm:mt-6">
            <Button
              label={buttonLabel}
              href={content.ctaHref || undefined}
              cId={cId}
              variant="primary"
              icon={<ArrowIcon size={20} weight="regular" aria-hidden />}
              iconPosition="end"
              className="min-w-[140px] sm:min-w-[160px]"
              style={{
                backgroundColor: pillCss,
                borderColor: pillCss,
                color: labelCss,
                fontWeight: getFontWeightValue(style.buttonTextFontWeight),
              }}
            />
          </div>
        ) : null}
      </div>
    </PageContentContainer>
  );
}
