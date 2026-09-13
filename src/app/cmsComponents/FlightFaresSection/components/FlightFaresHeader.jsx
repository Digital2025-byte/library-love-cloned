import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_FLIGHT_FARES_STYLE,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

export default function FlightFaresHeader({
  title,
  style = DEFAULT_FLIGHT_FARES_STYLE,
}) {
  if (!style.showTitle || !title) {
    return null;
  }

  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  return (
    <div
      className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${alignClass}`}
    >
      <h2
        className={`${typography.sectionTitle} font-semibold`}
        style={{ color: getThemeColorCss(style.titleColor, "primary-1"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
      >
        {title}
      </h2>
    </div>
  );
}
