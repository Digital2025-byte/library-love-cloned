import Button from "@/components/ui/Button";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_CITIES_SECTIONS_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function CitiesSectionsText({
  content,
  style = DEFAULT_CITIES_SECTIONS_STYLE,
  cId,
}) {
  const showHeading = style.showTitle && content.title;
  const showCopy = style.showDescription && content.description;
  const showCta =
    style.showCta && content.isCTA && content.ctaLabel && content.ctaHref;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const buttonBg = getThemeColorCss(style.buttonBg, "primary-2");
  const buttonText = getThemeColorCss(style.buttonText, "white");
  const links = content.links || [];

  if (!showHeading && !showCopy && !showCta) {
    return null;
  }

  return (
    <div className={`lg:sticky lg:top-24 lg:self-start ${alignClass}`}>
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} font-semibold wrap-break-word`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-100"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {content.title}
        </h2>
      ) : null}

      {showCopy ? (
        <p
          className={`${typography.sectionDescription} mt-4 max-w-md leading-relaxed wrap-break-word`}
          style={{ color: getThemeColorCss(style.descriptionColor, "white"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
        >
          <LinkedText
            text={content.description}
            links={links}
            style={style}
            enabled={style.showLinks !== false}
          />
        </p>
      ) : null}

      {showCta ? (
        <div className="mt-6 hidden lg:block">
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
  );
}
