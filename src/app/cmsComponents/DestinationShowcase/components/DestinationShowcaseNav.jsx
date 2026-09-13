"use client";

import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { DEFAULT_DESTINATION_SHOWCASE_STYLE } from "../utils/style";

/** Explore CTA only — arrows + dots live in DestinationShowcaseControls. */
export default function DestinationShowcaseNav({
  exploreLabel,
  exploreHref,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  const showExplore = style.showButton && exploreLabel && exploreHref;
  if (!showExplore) return null;

  const pillCss = getThemeColorCss(style.buttonBg, "primary-2");
  const labelCss = getThemeColorCss(style.buttonText, "white");

  return (
    <div className="mt-5 shrink-0 sm:mt-6 md:mb-12">
      <Button
        label={exploreLabel}
        href={exploreHref}
        style={{
          backgroundColor: pillCss,
          borderColor: pillCss,
          color: labelCss,

          fontWeight: getFontWeightValue(style.buttonTextFontWeight),
        }}
      />
    </div>
  );
}
