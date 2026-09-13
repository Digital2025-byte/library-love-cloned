import { ClockIcon } from "@phosphor-icons/react";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_GET_IN_TOUCH_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function GetInTouchPanel({
  content,
  style = DEFAULT_GET_IN_TOUCH_STYLE,
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const heroSrc =
    style.showImage && isUsableImageSrc(content.image) ? content.image : "";

  return (
    <PageContentContainer
      as="section"
      className={`flex flex-col items-center gap-3 text-center md:gap-4 ${paddingClass}`}
    >
      {style.showTitle && content.title ? (
        <h2
          className={`${typography.sectionTitle} m-0`}
          style={{
            color: getThemeColorCss(style.titleColor, "700"),
            fontWeight: getFontWeightValue(style.titleFontWeight),
          }}
        >
          {content.title}
        </h2>
      ) : null}

      {heroSrc ? (
        <div className="h-20 w-20 shrink-0 rounded-full bg-background p-1.5 md:h-28 md:w-28">
          <img
            src={heroSrc}
            alt={content.imageAlt || ""}
            className="h-full w-full rounded-full object-cover object-center"
          />
        </div>
      ) : null}

      {style.showLabel && content.label ? (
        <p
          className={`${typography.body} m-0 font-medium`}
          style={{ color: getThemeColorCss(style.labelColor, "700") }}
        >
          {content.label}
        </p>
      ) : null}

      {style.showPhone && content.phoneDisplay ? (
        <a
          href={content.phoneHref || undefined}
          dir="ltr"
          className={`${typography.pageTitle} leading-tight no-underline hover:underline`}
          style={{
            color: getThemeColorCss(style.phoneColor, "primary-1"),
            fontWeight: getFontWeightValue(style.phoneFontWeight),
          }}
        >
          {content.phoneDisplay}
        </a>
      ) : null}

      {style.showHours && content.hours ? (
        <p
          className={`${typography.caption} m-0 inline-flex items-center justify-center gap-1.5 font-medium`}
          style={{ color: getThemeColorCss(style.hoursColor, "700") }}
        >
          <span>{content.hours}</span>
          <ClockIcon size={14} weight="regular" aria-hidden className="shrink-0" />
        </p>
      ) : null}

      {style.showNote && content.note ? (
        <p
          className={`${typography.caption} m-0 w-full max-w-3xl leading-relaxed`}
          style={{ color: getThemeColorCss(style.noteColor, "700") }}
        >
          {content.note}
        </p>
      ) : null}
    </PageContentContainer>
  );
}
