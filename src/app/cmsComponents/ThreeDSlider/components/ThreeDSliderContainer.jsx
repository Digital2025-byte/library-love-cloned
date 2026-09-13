import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_THREE_D_SLIDER_STYLE } from "../utils/style";

export default function ThreeDSliderContainer({
  lang,
  dir,
  style = DEFAULT_THREE_D_SLIDER_STYLE,
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
