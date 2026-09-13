import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_PARAGRAPH_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function ParagraphContent({
  title,
  description,
  links = [],
  style = DEFAULT_PARAGRAPH_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;

  if (!showHeading && !showCopy) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className={alignClass}>
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} wrap-break-word font-semibold leading-snug md:leading-loose`}
          style={{
            color: getThemeColorCss(style.titleColor, "primary-1"),
            fontWeight: getFontWeightValue(style.titleFontWeight),
          }}
        >
          {title}
        </h2>
      ) : null}
      {showCopy ? (
        <p
          className={`${typography.sectionDescription} mt-2 wrap-break-word leading-relaxed md:leading-loose`}
          style={{
            color: getThemeColorCss(style.descriptionColor, "700"),
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
    </div>
  );
}
