"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { getThemeColorCss } from "@/styles/themeColors";

const baseButtonClasses =
  "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none sm:h-10 sm:w-10";

function NavButton({ onClick, disabled, ariaLabel, color, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`${baseButtonClasses} ${
        disabled
          ? "cursor-not-allowed border-gray-300 bg-transparent text-gray-400 opacity-60"
          : "cursor-pointer bg-transparent hover:bg-primary-1/5 active:scale-95"
      }`}
      style={disabled ? undefined : { borderColor: color, color }}
    >
      {children}
    </button>
  );
}

/**
 * Dedicated nav for the fill-image peek carousel.
 * Bounds come from the parent: next disabled on last step, prev active.
 */
export default function FillImageCarouselNavigation({
  lang = "en",
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  currentIndex,
  totalSlides,
  showNavigation = true,
  style,
}) {
  if (!showNavigation) {
    return null;
  }

  const isRtl = lang === "ar";
  const slideLabel = `${currentIndex + 1} of ${totalSlides}`;
  const accentCss = getThemeColorCss(style.navColor, "primary-1");

  return (
    <div
      dir="ltr"
      className={`mt-6 flex items-center gap-3 sm:mt-8 ${
        isRtl ? "justify-start" : "justify-end"
      }`}
      role="group"
      aria-label="Fill image carousel navigation"
    >
      <NavButton
        onClick={onPrev}
        disabled={!canGoPrev}
        ariaLabel={`Previous slide. ${slideLabel}`}
        color={accentCss}
      >
        <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
      </NavButton>
      <NavButton
        onClick={onNext}
        disabled={!canGoNext}
        ariaLabel={`Next slide. ${slideLabel}`}
        color={accentCss}
      >
        <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
      </NavButton>
    </div>
  );
}
