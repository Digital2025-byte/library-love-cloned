import Image from "next/image";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { CONNECTION_STEPS_LAYOUT } from "../utils/layout";
import { isUsableImageSrc } from "../utils/helpers";
import { DEFAULT_CONNECTION_STEPS_STYLE } from "../utils/style";

export default function ConnectionStep({
  stepLabel,
  description,
  bodyParts,
  imageUrl,
  imageAlt = "",
  labelStyle,
  circleSize = CONNECTION_STEPS_LAYOUT.circleSize,
  variant = "anchored",
  className = "",
  style: layoutStyle,
  theme = DEFAULT_CONNECTION_STEPS_STYLE,
}) {
  const isStacked = variant === "stacked";
  const canShowImage = theme.showImages && isUsableImageSrc(imageUrl);
  const labelColor = getThemeColorCss(theme.labelColor, "secondary-2");
  const descriptionColor = getThemeColorCss(
    theme.descriptionColor,
    "secondary-2"
  );
  const showLinks = theme.showLinks !== false;

  return (
    <div
      className={`relative flex flex-col items-center text-center ${className}`}
      style={
        isStacked
          ? { width: circleSize + 40, ...layoutStyle }
          : { width: circleSize, height: circleSize, ...layoutStyle }
      }
    >
      <div
        className="relative"
        style={{ width: circleSize, height: circleSize }}
      >
        {stepLabel ? (
          <p
            className={`pointer-events-none absolute z-20 whitespace-nowrap italic font-medium  ${typography.itemTitle}  leading-none`}
            style={{ ...labelStyle, color: labelColor }}
          >
            {stepLabel}
          </p>
        ) : null}

        <div className="relative z-10 h-full w-full overflow-hidden rounded-full bg-100 shadow-[0_8px_20px_rgb(1_38_59_/_0.14)]">
          {canShowImage ? (
            <Image
              src={imageUrl}
              alt={imageAlt || stepLabel || ""}
              fill
              className="object-cover"
              sizes={`${circleSize}px`}
            />
          ) : (
            <div className="h-full w-full bg-surface-2" aria-hidden />
          )}
        </div>
      </div>

      {theme.showDescription && description ? (
        <p
          className={
            isStacked
              ? `${typography.caption} mt-3  leading-snug`
              : `${typography.caption} absolute left-1/2 top-[calc(100%+0.75rem)] z-10 w-[11rem] -translate-x-1/2 leading-snug lg:w-[12rem] lg:top-[calc(100%+1rem)]`
          }
          style={{ color: descriptionColor }}
        >
          <LinkedText
            text={description}
            parts={bodyParts}
            style={theme}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </div>
  );
}
