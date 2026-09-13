"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";

const baseButtonClasses =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none sm:h-10 sm:w-10";

export default function CarouselNavigation({
  lang = "en",
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  currentIndex,
  totalSlides,
  progress = 0,
  showNavigation = true,
  style,
}) {
  if (!showNavigation) {
    return null;
  }

  const isRtl = lang === "ar";
  const slideLabel = `${currentIndex + 1} of ${totalSlides}`;
  const progressPct = Math.min(100, Math.max(0, progress * 100));
  const accentCss = getThemeColorCss(style.navColor, "primary-1");
  const trackCss = getThemeColorCss(style.navTrack, "200");

  return (
    <div
      className="mt-8 flex items-center gap-4 sm:mt-10 sm:gap-5"
      dir={isRtl ? "rtl" : "ltr"}
      role="group"
      aria-label="Carousel navigation"
    >
      <div
        className="relative h-px min-w-0 flex-1"
        style={{ backgroundColor: trackCss }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
        aria-label="Carousel progress"
      >
        <span
          className="absolute inset-y-0 start-0 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%`, backgroundColor: accentCss }}
        />
      </div>

      <div className="flex shrink-0 items-center gap-3" dir="ltr">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label={`Previous slide. ${slideLabel}`}
          aria-disabled={!canGoPrev}
          className={`${baseButtonClasses} ${
            canGoPrev
              ? "cursor-pointer bg-white hover:bg-primary-1/5 active:scale-95"
              : "cursor-not-allowed border-300 bg-50 text-400"
          }`}
          style={
            canGoPrev
              ? { borderColor: accentCss, color: accentCss }
              : undefined
          }
        >
          <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label={`Next slide. ${slideLabel}`}
          aria-disabled={!canGoNext}
          className={`${baseButtonClasses} ${
            canGoNext
              ? "cursor-pointer bg-white hover:bg-primary-1/5 active:scale-95"
              : "cursor-not-allowed border-300 bg-50 text-400"
          }`}
          style={
            canGoNext
              ? { borderColor: accentCss, color: accentCss }
              : undefined
          }
        >
          <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
