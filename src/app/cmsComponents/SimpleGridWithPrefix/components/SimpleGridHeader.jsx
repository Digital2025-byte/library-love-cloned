import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_SIMPLE_GRID_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function SimpleGridHeader({
  title,
  description,
  links = [],
  style = DEFAULT_SIMPLE_GRID_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;

  if (!showHeading && !showCopy) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className={`mb-4 ${alignClass}`}>
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} mb-2 font-bold`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}
      {showCopy ? (
        <p
          className={`${typography.sectionDescription} px-1`}
          style={{ color: getThemeColorCss(style.descriptionColor, "primary-1"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
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
    </div>
  );
}
