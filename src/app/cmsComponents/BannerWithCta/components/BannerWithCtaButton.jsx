import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_BANNER_WITH_CTA_STYLE } from "../utils/style";

export default function BannerWithCtaButton({
  label,
  href,
  icon,
  cId,
  style = DEFAULT_BANNER_WITH_CTA_STYLE,
}) {
  if (!label) {
    return null;
  }

  const pillCss = getThemeColorCss(style.buttonBg, "primary-2");
  const labelCss = getThemeColorCss(style.buttonText, "white");

  return (
    <Button
      label={label}
      href={href || undefined}
      icon={icon}
      cId={cId}
      className="mt-5"
      style={{
        backgroundColor: pillCss,
        borderColor: pillCss,
        color: labelCss,

        fontWeight: getFontWeightValue(style.buttonTextFontWeight),
      }}
    />
  );
}
