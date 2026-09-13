import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_ANIMATED_IMAGES_STYLE } from "../utils/style";

export default function AnimatedImagesCta({
  buttonText,
  buttonLink,
  iconType = "Instagram",
  cId,
  style = DEFAULT_ANIMATED_IMAGES_STYLE,
}) {
  if (!buttonText || !buttonLink) {
    return null;
  }

  const buttonBg = getThemeColorCss(style.buttonBg, "primary-2");
  const buttonTextColor = getThemeColorCss(style.buttonText, "white");

  return (
    <Button
      label={buttonText}
      href={buttonLink}
      icon={iconType}
      iconPosition="end"
      cId={cId}
      external
      variant="primary"
      className="md:py-4"
      style={{
        backgroundColor: buttonBg,
        borderColor: buttonBg,
        color: buttonTextColor,
        fontWeight: getFontWeightValue(style.buttonTextFontWeight),
      }}
    />
  );
}
