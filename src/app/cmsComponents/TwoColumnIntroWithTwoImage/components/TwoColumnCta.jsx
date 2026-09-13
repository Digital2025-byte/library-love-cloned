import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_TWO_COLUMN_INTRO_STYLE } from "../utils/style";

export default function TwoColumnCta({
  label,
  href,
  icon,
  cId,
  style = DEFAULT_TWO_COLUMN_INTRO_STYLE,
}) {
  if (!label) {
    return null;
  }

  const buttonBg = getThemeColorCss(style.buttonBg, "primary-2");
  const buttonText = getThemeColorCss(style.buttonText, "white");

  return (
    <Button
      label={label}
      href={href}
      icon={icon}
      cId={cId}
      variant="primary"
      style={{
        backgroundColor: buttonBg,
        borderColor: buttonBg,
        color: buttonText,
        fontWeight: getFontWeightValue(style.buttonTextFontWeight),
      }}
    />
  );
}
