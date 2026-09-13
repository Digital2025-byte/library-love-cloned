import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_ACCORDION_IMAGES_STYLE } from "../utils/style";

export default function AccordionImagesContainer({
  lang,
  dir,
  style = DEFAULT_ACCORDION_IMAGES_STYLE,
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={{
        backgroundColor: getThemeColorCss(style.sectionBg, "background"),
      }}
    >
      <PageContentContainer as="section" className="py-8 sm:py-12 lg:py-16">
        {children}
      </PageContentContainer>
    </div>
  );
}
