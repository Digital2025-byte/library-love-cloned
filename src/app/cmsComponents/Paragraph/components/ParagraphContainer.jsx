import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { getBackgroundDisplayStyle } from "@/app/cmsComponents/shared/backgroundImage";
import {
  DEFAULT_PARAGRAPH_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";
import { isUsableImageSrc, toCssUrl } from "../utils/helpers";

export default function ParagraphContainer({
  lang,
  dir,
  style = DEFAULT_PARAGRAPH_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  let backgroundStyle;

  if (style.showSectionBg) {
    if (
      style.sectionBgType === "image" &&
      isUsableImageSrc(style.sectionBgImage)
    ) {
      backgroundStyle = {
        backgroundImage: `url(${toCssUrl(style.sectionBgImage)})`,
        ...getBackgroundDisplayStyle(style),
      };
    } else {
      backgroundStyle = {
        backgroundColor: getThemeColorCss(style.sectionBg, "background"),
      };
    }
  }

  const showOverlay = style.showSectionBg && style.showOverlay;
  const overlayCss = getThemeColorCss(style.overlayColor, "primary-1");

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={backgroundStyle}
    >
      {showOverlay ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: `color-mix(in srgb, ${overlayCss} 55%, transparent)`,
          }}
          aria-hidden
        />
      ) : null}

      <PageContentContainer
        as="section"
        className={`relative z-10 ${paddingClass}`}
      >
        {children}
      </PageContentContainer>
    </div>
  );
}
