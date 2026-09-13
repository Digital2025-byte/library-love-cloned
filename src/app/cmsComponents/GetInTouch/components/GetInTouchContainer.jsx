import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_GET_IN_TOUCH_STYLE } from "../utils/style";

export default function GetInTouchContainer({
  lang,
  dir,
  style = DEFAULT_GET_IN_TOUCH_STYLE,
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
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "200") }
          : undefined
      }
    >
      {children}
    </div>
  );
}
