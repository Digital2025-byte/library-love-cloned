import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import PageContentContainer from "@/components/layout/PageContentContainer";
import {
  DEFAULT_ON_BOARD_IMAGE_RING_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function OnBoardImageRingHeader({
  title,
  description,
  links = [],
  style = DEFAULT_ON_BOARD_IMAGE_RING_STYLE,
}) {
  const showHeading = style.showTitle && title;
  const showBody = style.showDescription && description;

  if (!showHeading && !showBody) return null;

  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;
  const isCenter = style.titleAlign === "center";

  return (
    <PageContentContainer className={paddingClass}>
      <div
        className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-12 ${alignClass}`}
      >
        {showHeading ? (
          <h2
            className={`${typography.sectionTitle} shrink-0 font-semibold`}
            style={{ color: getThemeColorCss(style.titleColor, "50"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
          >
            {title}
          </h2>
        ) : null}
        {showBody ? (
          <p
            className={`${typography.sectionDescription} max-w-2xl ${
              isCenter ? "md:text-center" : "md:text-start"
            }`}
            style={{
              color: `color-mix(in srgb, ${getThemeColorCss(style.descriptionColor, "50")} 90%, transparent)`,
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
    </PageContentContainer>
  );
}
