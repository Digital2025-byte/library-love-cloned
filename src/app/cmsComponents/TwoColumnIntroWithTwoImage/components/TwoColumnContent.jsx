import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import TwoColumnCta from "./TwoColumnCta";
import {
  DEFAULT_TWO_COLUMN_INTRO_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function TwoColumnContent({
  title,
  description,
  links = [],
  ctaButton,
  ctaHref,
  style = DEFAULT_TWO_COLUMN_INTRO_STYLE,
  cId,
}) {
  const showTitle = style.showTitle && title;
  const showDescription = style.showDescription && description;
  const showCta = style.showCta && ctaButton;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  if (!showTitle && !showDescription && !showCta) {
    return null;
  }

  return (
    <div className={`flex w-full flex-col justify-center ${alignClass}`}>
      {showTitle ? (
        <h2
          className={`${typography.sectionTitle} font-semibold leading-snug wrap-break-word`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}

      {showDescription ? (
        <p
          className={`${typography.sectionDescription} mt-4 leading-relaxed wrap-break-word sm:mt-5 lg:mt-6`}
          style={{ color: getThemeColorCss(style.descriptionColor, "700"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
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
        <div className="mt-6 sm:mt-8">
          <TwoColumnCta
            label={ctaButton}
            href={ctaHref}
            cId={cId}
            style={style}
          />
        </div>
      ) : null}
    </div>
  );
}
