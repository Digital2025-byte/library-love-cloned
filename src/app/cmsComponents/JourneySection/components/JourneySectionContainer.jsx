import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_JOURNEY_SECTION_STYLE } from "../utils/style";

export default function JourneySectionContainer({
  lang,
  dir,
  style = DEFAULT_JOURNEY_SECTION_STYLE,
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
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "100") }
          : undefined
      }
    >
      {children}
    </div>
  );
}
