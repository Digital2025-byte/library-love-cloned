import { typography } from "@/styles/typography";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { TITLE_ALIGN_CLASS } from "../utils/style";

export default function OppositeScrollHeader({
  title,
  description,
  links = [],
  style,
}) {
  const showHeading = style.showTitleDescription && title;
  const showBody = style.showDescription && description;
  const showLinks = style.showLinks !== false;

  if (!showHeading && !showBody) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.center;

  return (
    <PageContentContainer
      className={`mb-8 flex flex-col justify-center ${alignClass}`}
    >
      {showHeading ? (
        <h2
          className={`${typography.sectionTitle} font-bold`}
          style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}
      {showBody ? (
        <p
          className={`${typography.sectionDescription} mt-1 font-normal ${
            style.titleAlign === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"
          }`}
          style={{ color: getThemeColorCss(style.descriptionColor, "white"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
        >
          <LinkedText
            text={description}
            links={links}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </PageContentContainer>
  );
}
