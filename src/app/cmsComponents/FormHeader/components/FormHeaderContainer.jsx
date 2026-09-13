import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_FORM_HEADER_STYLE } from "../utils/style";

export default function FormHeaderContainer({
  lang,
  dir,
  style = DEFAULT_FORM_HEADER_STYLE,
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
              backgroundColor: getThemeColorCss(style.sectionBg, "white"),
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
