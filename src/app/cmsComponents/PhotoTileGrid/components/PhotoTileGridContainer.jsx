import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_PHOTO_TILE_GRID_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";

export default function PhotoTileGridContainer({
  lang,
  dir,
  style = DEFAULT_PHOTO_TILE_GRID_STYLE,
  children,
  className = "",
}) {
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <section
      className={`flex w-full flex-col items-center justify-center ${paddingClass} ${className}`.trim()}
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
    </section>
  );
}
