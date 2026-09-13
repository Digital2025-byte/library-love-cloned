import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_DESTINATION_SHOWCASE_STYLE } from "../utils/style";

/**
 * Teal wash over the hero photo — large blurred main blob + spread glow.
 * Matches Figma: bg main, box-shadow spread, blur(175px).
 */
export default function DestinationShowcaseBlueLayer({
  color = DEFAULT_DESTINATION_SHOWCASE_STYLE.overlayColor,
}) {
  const overlayCss = getThemeColorCss(color, "main");

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[8%] top-[38%] z-10 h-[78%] w-[125%] blur-[113px] md:top-[36%] md:h-[83%]"
      style={{
        backgroundColor: `color-mix(in srgb, ${overlayCss} 75%, transparent)`,
      }}
    />
  );
}
