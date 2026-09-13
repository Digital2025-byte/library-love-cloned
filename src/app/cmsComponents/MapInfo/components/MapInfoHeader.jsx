import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_MAP_INFO_STYLE, TITLE_ALIGN_CLASS } from "../utils/style";

export default function MapInfoHeader({
  title,
  description,
  style = DEFAULT_MAP_INFO_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;

  if (!showHeading && !showCopy) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className={`p-2 pt-4 ${alignClass}`}>
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} font-bold`}
          style={{ color: getThemeColorCss(style.titleColor, "main"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}
      {showCopy ? (
        <p
          className={`${typography.sectionDescription} mb-3 mt-2 px-0.5`}
          style={{ color: getThemeColorCss(style.descriptionColor, "main"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
