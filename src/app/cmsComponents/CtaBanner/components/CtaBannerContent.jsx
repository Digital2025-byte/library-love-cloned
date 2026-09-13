import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_CTA_BANNER_STYLE,
  TITLE_ALIGN_CLASS,
  TITLE_ITEMS_CLASS,
  TITLE_JUSTIFY_CLASS,
} from "../utils/style";
import CtaBannerButton from "./CtaBannerButton";

export default function CtaBannerContent({
  content,
  style = DEFAULT_CTA_BANNER_STYLE,
}) {
  const showHeading = style.showTitle && content.title;
  const showCopy = style.showDescription && content.description;
  const showCta = style.showButton && content.ctaLabel;
  const alignKey =
    style.titleAlign in TITLE_ALIGN_CLASS ? style.titleAlign : "left";
  const alignClass = TITLE_ALIGN_CLASS[alignKey];
  const justifyClass = TITLE_JUSTIFY_CLASS[alignKey];
  const itemsClass = TITLE_ITEMS_CLASS[alignKey];
  const titleCss = getThemeColorCss(style.titleColor, "50");
  const descriptionCss = getThemeColorCss(style.descriptionColor, "50");

  if (!showHeading && !showCopy && !showCta) {
    return null;
  }

  return (
    <div className={`flex w-full ${justifyClass}`}>
      <div
        className={`flex w-full max-w-xl flex-col gap-4 md:gap-6 ${alignClass} ${itemsClass}`}
      >
        {showHeading ? (
          <h2
            className={`${typography.sectionTitle} m-0 leading-tight`}
            style={{
              color: titleCss,
              fontWeight: getFontWeightValue(style.titleFontWeight),
            }}
          >
            {content.title}
          </h2>
        ) : null}

        {showCopy ? (
          <p
            className={`${typography.sectionDescription} m-0 leading-relaxed`}
            style={{
              color: descriptionCss,
              fontWeight: getFontWeightValue(style.descriptionFontWeight),
            }}
          >
            {content.description}
          </p>
        ) : null}

        {showCta ? (
          <CtaBannerButton
            label={content.ctaLabel}
            href={content.ctaHref}
            style={style}
          />
        ) : null}
      </div>
    </div>
  );
}
