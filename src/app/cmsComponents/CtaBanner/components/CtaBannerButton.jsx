import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_CTA_BANNER_STYLE } from "../utils/style";

export default function CtaBannerButton({
  label,
  href,
  icon,
  cId,
  style = DEFAULT_CTA_BANNER_STYLE,
}) {
  if (!label) {
    return null;
  }

  const pillCss = getThemeColorCss(style.buttonBg, "secondary");
  const labelCss = getThemeColorCss(style.buttonText, "btn");

  return (
    <Button
      label={label}
      href={href || undefined}
      icon={icon}
      cId={cId}
      style={{
        backgroundColor: pillCss,
        borderColor: pillCss,
        color: labelCss,
        fontWeight: getFontWeightValue(style.buttonTextFontWeight),
      }}
    />
  );
}
