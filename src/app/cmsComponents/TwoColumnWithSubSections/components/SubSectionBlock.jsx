import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE } from "../utils/style";

export default function SubSectionBlock({
  title,
  description,
  titleParts,
  bodyParts,
  style = DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
}) {
  if (!title && !description) {
    return null;
  }

  const showLinks = style.showLinks !== false;

  return (
    <div className="min-w-0 flex-1">
      {title ? (
        <h3
          className="mb-2 text-sm font-medium sm:text-base"
          style={{ color: getThemeColorCss(style.itemTitleColor, "secondary-2"), fontWeight: getFontWeightValue(style.itemTitleFontWeight),
          }}
        >
          <LinkedText
            text={title}
            parts={titleParts}
            style={style}
            enabled={showLinks}
          />
        </h3>
      ) : null}
      {description ? (
        <p
          className="text-sm leading-6"
          style={{ color: getThemeColorCss(style.itemBodyColor, "600") }}
        >
          <LinkedText
            text={description}
            parts={bodyParts}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </div>
  );
}
