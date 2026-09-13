import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_RELATED_CONTENT_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function RelatedContentCarouselContainer({
  lang,
  dir,
  style = DEFAULT_RELATED_CONTENT_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <div
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={{ backgroundColor: getThemeColorCss(style.sectionBg, "50") }}
    >
      <PageContentContainer as="section" className={paddingClass}>
        {children}
      </PageContentContainer>
    </div>
  );
}
