import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function SubSectionsHeader({
  sectionLabel,
  title,
  description,
  links = [],
  style = DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
}) {
  const showLabel = style.showSectionLabel && sectionLabel;
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const showLinks = style.showLinks !== false;

  if (!showLabel && !showHeading && !showCopy) {
    return null;
  }

  return (
    <div className={`space-y-3 sm:space-y-4 ${alignClass}`}>
      {showLabel ? (
        <p
          className={`${typography.caption} font-medium`}
          style={{ color: getThemeColorCss(style.labelColor, "secondary-2"), fontWeight: getFontWeightValue(style.labelFontWeight) }}
        >
          <LinkedText
            text={sectionLabel}
            links={links}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}

      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} font-medium italic`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          <LinkedText
            text={title}
            links={links}
            style={style}
            enabled={showLinks}
          />
        </h2>
      ) : null}

      {showCopy ? (
        <p
          className={`${typography.sectionDescription} font-normal`}
          style={{ color: getThemeColorCss(style.descriptionColor, "600"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
          }}
        >
          <LinkedText
            text={description}
            links={links}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </div>
  );
}
