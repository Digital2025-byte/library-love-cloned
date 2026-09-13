import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_ACCORDION_STYLE } from "../utils/style";

export default function AccordionContainer({
  lang,
  dir,
  style = DEFAULT_ACCORDION_STYLE,
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "100"),
            }
          : undefined
      }
    >
      <PageContentContainer as="section" className="py-8 sm:py-12 lg:py-16">
        {children}
      </PageContentContainer>
    </div>
  );
}
