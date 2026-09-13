import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_SPLIT_TEXT_ONLY_STYLE } from "../utils/style";

export default function SplitTextOnlyContainer({
  lang,
  dir,
  style = DEFAULT_SPLIT_TEXT_ONLY_STYLE,
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
              backgroundColor: getThemeColorCss(style.sectionBg, "main"),
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
