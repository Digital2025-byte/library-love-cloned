import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_DESTINATIONS_MAP_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function DestinationsMapContainer({
  lang,
  dir,
  style = DEFAULT_DESTINATIONS_MAP_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <div
      className={`w-full ${paddingClass} ${className}`.trim()}
      lang={lang}
      dir={dir || (lang === "ar" ? "rtl" : "ltr")}
      style={
        style.showSectionBg
          ? {
              backgroundColor: getThemeColorCss(style.sectionBg, "primary-800"),
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
