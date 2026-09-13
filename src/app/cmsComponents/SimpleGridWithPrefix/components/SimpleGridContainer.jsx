import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_SIMPLE_GRID_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function SimpleGridContainer({
  lang,
  dir,
  style = DEFAULT_SIMPLE_GRID_STYLE,
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
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "surface-1"),
            }
          : undefined
      }
    >
      <PageContentContainer as="section" className={paddingClass}>
        {children}
      </PageContentContainer>
    </div>
  );
}
