import Image from "next/image";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { CONNECTION_STEPS_MOBILE_LAYOUT } from "../utils/layoutMobile";
import { isUsableImageSrc } from "../utils/helpers";
import { DEFAULT_CONNECTION_STEPS_STYLE } from "../utils/style";

export default function ConnectionStepMobile({
  step,
  stepLabel,
  imageOnLeft = true,
  circleSize = CONNECTION_STEPS_MOBILE_LAYOUT.circleSize,
  centerX,
  theme = DEFAULT_CONNECTION_STEPS_STYLE,
}) {
  const { path } = CONNECTION_STEPS_MOBILE_LAYOUT;
  const x = centerX ?? (imageOnLeft ? path.leftX : path.rightX);
  const canShowImage =
    theme.showImages && isUsableImageSrc(step?.imageUrl);
  const showLinks = theme.showLinks !== false;

  return (
    <div
      className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, width: circleSize, height: circleSize }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full bg-100">
        {canShowImage ? (
          <Image
            src={step.imageUrl}
            alt={step.imageAlt || stepLabel || ""}
            fill
            className="object-cover"
            sizes={`${circleSize}px`}
          />
        ) : (
          <div className="h-full w-full bg-surface-2" aria-hidden />
        )}
      </div>

      <div
        className={`absolute top-1/2 z-20 w-[9.75rem] -translate-y-1/2 text-start sm:w-[11rem] ${
          imageOnLeft
            ? "left-[calc(100%+0.75rem)]"
            : "right-[calc(100%+0.75rem)]"
        }`}
      >
        {stepLabel ? (
          <p
            className={`${typography.itemTitle} italic font-medium leading-tight`}
            style={{ color: getThemeColorCss(theme.labelColor, "secondary-2") }}
          >
            {stepLabel}
          </p>
        ) : null}
        {theme.showDescription && step?.description ? (
          <p
            className={`${typography.caption} mt-1.5 leading-snug`}
            style={{
              color: getThemeColorCss(theme.descriptionColor, "secondary-2"),
            }}
          >
            <LinkedText
              text={step.description}
              parts={step.bodyParts}
              style={theme}
              enabled={showLinks}
            />
          </p>
        ) : null}
      </div>
    </div>
  );
}
