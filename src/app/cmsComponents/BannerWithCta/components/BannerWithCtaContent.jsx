import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_BANNER_WITH_CTA_STYLE,
  TITLE_ALIGN_CLASS,
  TITLE_ITEMS_CLASS,
  TITLE_JUSTIFY_CLASS,
} from "../utils/style";
import BannerWithCtaButton from "./BannerWithCtaButton";

export default function BannerWithCtaContent({
  content,
  style = DEFAULT_BANNER_WITH_CTA_STYLE,
}) {
  const title = content.title;
  const description = content.description;
  const links = content.links || [];
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;
  const showCta = style.showButton && content.ctaLabel;
  const alignKey =
    style.titleAlign in TITLE_ALIGN_CLASS ? style.titleAlign : "left";
  const alignClass = TITLE_ALIGN_CLASS[alignKey];
  const justifyClass = TITLE_JUSTIFY_CLASS[alignKey];
  const itemsClass = TITLE_ITEMS_CLASS[alignKey];
  const titleCss = getThemeColorCss(style.titleColor, "white");
  const descriptionCss = getThemeColorCss(style.descriptionColor, "white");

  if (!showHeading && !showCopy && !showCta) {
    return null;
  }

  return (
    <div className={`flex w-full ${justifyClass}`}>
      <div
        className={`flex w-full max-w-xl flex-col px-6 md:px-10 lg:px-14 ${alignClass} ${itemsClass}`}
      >
        {showHeading ? (
          <h2
            className={`${typography.sectionTitle} font-bold leading-tight`}
            style={{ color: titleCss, fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {title}
          </h2>
        ) : null}

        {showCopy ? (
          <p
            className={`${typography.sectionDescription} mt-3 max-w-145`}
            style={{
              color: `color-mix(in srgb, ${descriptionCss} 90%, transparent)`,
              fontWeight: getFontWeightValue(style.descriptionFontWeight),
            }}
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
          <BannerWithCtaButton
            label={content.ctaLabel}
            href={content.ctaHref}
            style={style}
          />
        ) : null}
      </div>
    </div>
  );
}
