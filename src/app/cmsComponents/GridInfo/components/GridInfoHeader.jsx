import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_GRID_INFO_STYLE,
  TITLE_ALIGN_CLASS,
  TITLE_ITEMS_CLASS,
} from "../utils/style";

export default function GridInfoHeader({
  title,
  description,
  style = DEFAULT_GRID_INFO_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;

  if (!showHeading && !showCopy) {
    return null;
  }

  const alignKey =
    style.titleAlign in TITLE_ALIGN_CLASS ? style.titleAlign : "left";
  const alignClass = TITLE_ALIGN_CLASS[alignKey];
  const itemsClass = TITLE_ITEMS_CLASS[alignKey];

  return (
    <div className={`mb-4 flex w-full flex-col ${alignClass} ${itemsClass}`}>
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} mb-4 font-bold`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}
      {showCopy ? (
        <p
          className={`${typography.sectionDescription} max-w-3xl`}
          style={{ color: getThemeColorCss(style.descriptionColor, "primary-1"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
