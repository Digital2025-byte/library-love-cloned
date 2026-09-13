"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_DESTINATION_SHOWCASE_STYLE } from "../utils/style";

/**
 * Bottom-center controls: prev | dots (active = pill) | next.
 */
export default function DestinationShowcaseControls({
  lang = "en",
  activeIndex = 0,
  count = 0,
  onPrev,
  onNext,
  onDotClick,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  if ((!style.showArrows && !style.showDots) || count <= 0) return null;

  const PrevIcon = lang === "ar" ? ArrowRightIcon : ArrowLeftIcon;
  const NextIcon = lang === "ar" ? ArrowLeftIcon : ArrowRightIcon;
  const accentCss = getThemeColorCss(style.navColor, "50");

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4"
      role="group"
      aria-label="Destination carousel controls"
    >
      {style.showArrows ? (
        <button
          type="button"
          onClick={onPrev}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:bg-white/10"
          style={{ borderColor: `color-mix(in srgb, ${accentCss} 60%, transparent)`, color: accentCss }}
          aria-label="Previous destination"
        >
          <PrevIcon size={18} weight="bold" />
        </button>
      ) : null}

      {style.showDots ? (
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Destinations"
        >
          {Array.from({ length: count }, (_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to destination ${index + 1}`}
                onClick={() => onDotClick?.(index)}
                className={
                  isActive
                    ? "h-1.5 w-7 cursor-pointer rounded-full transition-all sm:w-9"
                    : "h-1.5 w-1.5 cursor-pointer rounded-full transition-all"
                }
                style={{
                  backgroundColor: isActive
                    ? accentCss
                    : `color-mix(in srgb, ${accentCss} 40%, transparent)`,
                }}
              />
            );
          })}
        </div>
      ) : null}

      {style.showArrows ? (
        <button
          type="button"
          onClick={onNext}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:bg-white/10"
          style={{ borderColor: `color-mix(in srgb, ${accentCss} 60%, transparent)`, color: accentCss }}
          aria-label="Next destination"
        >
          <NextIcon size={18} weight="bold" />
        </button>
      ) : null}
    </div>
  );
}
