import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_OFFICE_DIRECTORY_STYLE } from "../utils/style";

export default function OfficeDirectoryContainer({
  lang,
  dir,
  style = DEFAULT_OFFICE_DIRECTORY_STYLE,
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
