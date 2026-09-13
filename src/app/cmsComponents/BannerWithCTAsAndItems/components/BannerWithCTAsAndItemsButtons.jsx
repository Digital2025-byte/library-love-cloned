import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  DEFAULT_BANNER_WITH_CTAS_STYLE,
  TITLE_JUSTIFY_CLASS,
} from "../utils/style";

export default function BannerWithCTAsAndItemsButtons({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  primaryIcon,
  secondaryIcon,
  cId,
  style = DEFAULT_BANNER_WITH_CTAS_STYLE,
  align = "left",
}) {
  if (!primaryLabel && !secondaryLabel) {
    return null;
  }

  const primaryPill = getThemeColorCss(style.primaryBg, "primary-2");
  const primaryFg = getThemeColorCss(style.primaryText, "white");
  const secondaryFg = getThemeColorCss(style.secondaryText, "white");
  const justifyClass = TITLE_JUSTIFY_CLASS[align] ?? TITLE_JUSTIFY_CLASS.left;

  return (
    <div
      className={`mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 ${justifyClass}`}
    >
      {primaryLabel ? (
        <Button
          label={primaryLabel}
          href={primaryHref || undefined}
          icon={primaryIcon}
          cId={cId}
          variant="primary"
          className="min-h-12 w-full font-semibold sm:w-auto sm:min-w-40 lg:px-10"
          style={{
            backgroundColor: primaryPill,
            borderColor: primaryPill,
            color: primaryFg,

            fontWeight: getFontWeightValue(style.primaryTextFontWeight),
          }}
        />
      ) : null}
      {secondaryLabel ? (
        <Button
          label={secondaryLabel}
          href={secondaryHref || undefined}
          icon={secondaryIcon}
          cId={cId}
          variant="secondary"
          className="min-h-12 w-full font-semibold sm:w-auto sm:min-w-40 lg:px-10"
          style={{
            borderColor: secondaryFg,
            color: secondaryFg,

            fontWeight: getFontWeightValue(style.secondaryTextFontWeight),
          }}
        />
      ) : null}
    </div>
  );
}
