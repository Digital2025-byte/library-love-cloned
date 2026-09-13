import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function SubSectionsContainer({
  lang,
  dir,
  style = DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
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
              backgroundColor: getThemeColorCss(
                style.sectionBg,
                "secondary-100"
              ),
            }
          : undefined
      }
    >
      <PageContentContainer
        as="section"
        className={`overflow-visible ${paddingClass}`}
      >
        {children}
      </PageContentContainer>
    </div>
  );
}
