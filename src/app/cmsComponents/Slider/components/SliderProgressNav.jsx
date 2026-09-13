"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { DEFAULT_THEME, resolveTheme } from "../utils/themes";

/**
 * Pause + progress pill (active) + dots (inactive).
 * Colors follow the slider theme — only the shape/behavior changes.
 */
export default function SliderProgressNav({
  slideCount = 0,
  activeIndex = 0,
  autoplaySpeed = 5000,
  isPaused = false,
  onTogglePause,
  onGoTo,
  theme = DEFAULT_THEME,
}) {
  const colors = resolveTheme(theme);

  if (slideCount <= 1) {
    return null;
  }

  return (
    <div
      className="pointer-events-auto absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-6 md:bottom-8"
      style={{
        "--slider-progress": colors.icon || "#ffffff",
        "--slider-progress-track":
          "color-mix(in srgb, var(--slider-progress) 35%, transparent)",
        "--slider-progress-duration": `${Math.max(autoplaySpeed, 500)}ms`,
      }}
      role="group"
      aria-label="Slide progress"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .slider-hero-progress-fill {
          display: block;
          height: 100%;
          width: 100%;
          transform: scaleX(0);
          transform-origin: left center;
          background: var(--slider-progress);
          border-radius: inherit;
          animation: slider-hero-progress-fill var(--slider-progress-duration) linear forwards;
        }
        .slider-hero-progress-fill.is-paused {
          animation-play-state: paused;
        }
        @keyframes slider-hero-progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `,
        }}
      />

      <button
        type="button"
        onClick={onTogglePause}
        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-[var(--slider-progress)] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {isPaused ? (
          <PlayIcon size={18} weight="regular" aria-hidden="true" />
        ) : (
          <PauseIcon size={18} weight="regular" aria-hidden="true" />
        )}
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: slideCount }, (_, index) => {
          const isActive = index === activeIndex;

          if (isActive) {
            return (
              <button
                key={`progress-${activeIndex}-${index}`}
                type="button"
                aria-label={`Slide ${index + 1} of ${slideCount} (current)`}
                aria-current="true"
                onClick={() => onGoTo?.(index)}
                className="h-1.5 w-10 cursor-pointer overflow-hidden rounded-full sm:w-12"
                style={{ background: "var(--slider-progress-track)" }}
              >
                <span
                  className={`slider-hero-progress-fill ${isPaused ? "is-paused" : ""}`}
                />
              </button>
            );
          }

          return (
            <button
              key={`dot-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => onGoTo?.(index)}
              className="h-1.5 w-1.5 cursor-pointer rounded-full transition-opacity hover:opacity-80"
              style={{ background: "var(--slider-progress-track)" }}
            />
          );
        })}
      </div>
    </div>
  );
}
