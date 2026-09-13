"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";

export default function CarouselItemNavigation({
  dotCount = 0,
  activePageIndex = 0,
  onPrev,
  onNext,
  onGoToPage,
  style,
}) {
  const showArrows = style.showArrows;
  const showDots = style.showDots;

  if (dotCount <= 0 || (!showArrows && !showDots)) {
    return null;
  }

  const arrowCss = getThemeColorCss(style.navColor, "white");
  const dotCss = getThemeColorCss(style.dotColor, "primary-2");

  return (
    <div
      className="z-10 mt-5 flex items-center justify-center gap-6"
      dir="ltr"
    >
      {showArrows ? (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous"
          className="cursor-pointer rounded-full border-2 p-2 transition hover:bg-white/20"
          style={{ borderColor: arrowCss, color: arrowCss }}
        >
          <ArrowLeftIcon className="text-lg" weight="bold" />
        </button>
      ) : null}

      {showDots ? (
        <div className="flex gap-2">
          {Array.from({ length: dotCount }, (_, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => onGoToPage?.(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onGoToPage?.(i);
                }
              }}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                i === activePageIndex ? "w-5" : "w-2 opacity-40"
              }`}
              style={{ backgroundColor: dotCss }}
            />
          ))}
        </div>
      ) : null}

      {showArrows ? (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next"
          className="cursor-pointer rounded-full border-2 p-2 transition hover:bg-white/20"
          style={{ borderColor: arrowCss, color: arrowCss }}
        >
          <ArrowRightIcon className="text-lg" weight="bold" />
        </button>
      ) : null}
    </div>
  );
}
