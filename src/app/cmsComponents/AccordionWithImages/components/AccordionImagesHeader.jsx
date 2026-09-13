import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { TITLE_ALIGN_CLASS } from "../utils/style";

export default function AccordionImagesHeader({
  title,
  description,
  links = [],
  linkStyle,
  align = "left",
  titleColor = "primary-1",
  descriptionColor = "700",
  titleFontWeight = "semibold",
  descriptionFontWeight = "normal",
  showDescription = true,
  showTitleBorder = true,
  showLinks = true,
}) {
  if (!title && !(showDescription && description)) {
    return null;
  }

  const alignClass = TITLE_ALIGN_CLASS[align] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div className={`mb-5 sm:mb-7 lg:mb-8 ${alignClass}`}>
      {title ? (
        <h2
          className={`${typography.sectionTitle} py-2 font-semibold leading-snug lg:py-4 ${
            showTitleBorder ? "border-b border-200" : ""
          }`}
          style={{
            color: getThemeColorCss(titleColor, "primary-1"),
            fontWeight: getFontWeightValue(titleFontWeight),
          }}
        >
          {title}
        </h2>
      ) : null}
      {showDescription && description ? (
        <p
          className={`${typography.sectionDescription} mt-2 leading-relaxed ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
          style={{
            color: getThemeColorCss(descriptionColor, "700"),
            fontWeight: getFontWeightValue(descriptionFontWeight),
          }}
        >
          <LinkedText
            text={description}
            links={links}
            style={linkStyle}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </div>
  );
}
