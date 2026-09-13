import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_FAQ_EXPLORER_STYLE } from "../utils/style";

export default function FaqExplorerContainer({
  lang,
  dir,
  style = DEFAULT_FAQ_EXPLORER_STYLE,
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
