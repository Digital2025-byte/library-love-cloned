import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_SCROLL_CAROUSEL_STYLE } from "../utils/style";

export default function ScrollCarouselContainer({
  lang,
  dir,
  style = DEFAULT_SCROLL_CAROUSEL_STYLE,
  children,
  className = "",
}) {
  return (
    <section
      className={`w-full ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "foreground"),
            }
          : undefined
      }
    >
      {children}
    </section>
  );
}
