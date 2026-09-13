import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_CALL_US_STYLE } from "../utils/style";

export default function CallUsPhone({
  phoneText,
  href,
  style = DEFAULT_CALL_US_STYLE,
}) {
  if (!phoneText) {
    return null;
  }

  return (
    <a
      dir="ltr"
      href={href || "#"}
      className={`${typography.pageTitle} tracking-wide no-underline hover:opacity-90`}
      style={{ color: getThemeColorCss(style.phoneColor, "white"), fontWeight: getFontWeightValue(style.phoneFontWeight) }}
    >
      +{phoneText}
    </a>
  );
}
