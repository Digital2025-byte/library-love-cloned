import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_SPLIT_TEXT_ONLY_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

const TEXT_SHADOW =
  "0 1px 2px rgba(0, 0, 0, 0.45), 0 4px 18px rgba(0, 0, 0, 0.35)";

export default function SplitTextOnlyContent({
  title,
  description,
  links = [],
  style = DEFAULT_SPLIT_TEXT_ONLY_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;

  if (!showHeading && !showCopy) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className={`p-2 ${alignClass}`}>
      {showHeading ? (
        <h1
          className={`${typography.sectionTitle} font-semibold`}
          style={{
            color: getThemeColorCss(style.titleColor, "secondary-100"),
            fontWeight: getFontWeightValue(style.titleFontWeight),
            textShadow: TEXT_SHADOW,
          }}
        >
          {title}
        </h1>
      ) : null}

      {showCopy ? (
        <p
          className={`${typography.sectionDescription} mt-2 p-1 leading-relaxed max-w-2xl`}
          style={{
            color: getThemeColorCss(style.descriptionColor, "secondary-100"),
            fontWeight: getFontWeightValue(style.descriptionFontWeight),
            textShadow: TEXT_SHADOW,
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
