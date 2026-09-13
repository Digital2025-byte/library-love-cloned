import { typography } from "@/styles/typography";
import AnimatedImagesCta from "./AnimatedImagesCta";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_ANIMATED_IMAGES_STYLE,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function AnimatedImagesContent({
  preTitle,
  title,
  links = [],
  buttonText,
  buttonLink,
  iconType,
  cId,
  style = DEFAULT_ANIMATED_IMAGES_STYLE,
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.center;
  const justifyClass =
    style.titleAlign === "left"
      ? "items-start text-start"
      : "items-center text-center";

  return (
    <PageContentContainer
      className={`relative z-10 flex flex-1 flex-col justify-center ${paddingClass} ${justifyClass} ${alignClass}`}
    >
      {style.showDescription && preTitle ? (
        <p
          className={`${typography.sectionDescription} mb-2 wrap-break-word md:mb-3`}
          style={{ color: getThemeColorCss(style.descriptionColor, "primary-1"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
          }}
        >
          <LinkedText
            text={preTitle}
            links={links}
            style={style}
            enabled={style.showLinks !== false}
          />
        </p>
      ) : null}

      {style.showTitle && title ? (
        <h2
          className={`${typography.pageTitle} mb-8 font-bold wrap-break-word md:mb-10`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h2>
      ) : null}

      {style.showCta ? (
        <AnimatedImagesCta
          buttonText={buttonText}
          buttonLink={buttonLink}
          iconType={iconType}
          cId={cId}
          style={style}
        />
      ) : null}
    </PageContentContainer>
  );
}
