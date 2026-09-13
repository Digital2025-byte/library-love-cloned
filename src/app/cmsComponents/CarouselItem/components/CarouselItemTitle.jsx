import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { TITLE_ALIGN_CLASS } from "../utils/style";

export default function CarouselItemTitle({ title = "", style }) {
  if (!title) return null;

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <h1
      className={`${typography.sectionTitle} font-semibold ${alignClass}`}
      style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
    >
      {title}
    </h1>
  );
}
