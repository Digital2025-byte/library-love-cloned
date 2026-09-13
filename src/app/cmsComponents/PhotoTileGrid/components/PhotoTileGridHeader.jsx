import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_PHOTO_TILE_GRID_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function PhotoTileGridHeader({
  lang = "en",
  title,
  style = DEFAULT_PHOTO_TILE_GRID_STYLE,
}) {
  if (!style.showTitle || !title) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div
      className={`flex w-full items-center justify-between pt-2 ${alignClass}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <h2
        className={`${typography.sectionTitle} w-full font-bold`}
        style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
      >
        {title}
      </h2>
    </div>
  );
}
