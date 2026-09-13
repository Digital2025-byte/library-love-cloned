import { useEffect, useState } from "react";

/** Small viewport edge padding so cards nearly cover the page. */
export function getEdgePad(viewportWidth = 0) {
  if (viewportWidth >= 1024) return 16;
  if (viewportWidth >= 640) return 12;
  return 12;
}

/**
 * How many slides fit in the visible strip.
 * Large screens: always ~3 cards (2 full + small peek of the third).
 */
export function getVisibleSlideCount(viewportWidth = 0) {
  if (viewportWidth < 768) return 1.15;
  if (viewportWidth < 1024) return 1.55;
  return 2.7;
}

/**
 * Last reachable slide index (matches slick end step: peek | full | full).
 * Equivalent to the first integer index where slick treats the carousel as finished.
 */
export function getMaxSlideIndex(cardsCount = 0, visibleCount = 2.7) {
  if (cardsCount <= visibleCount) return 0;
  return Math.max(0, Math.ceil(cardsCount - visibleCount));
}

/** True when slick is on / past the last step (next must be disabled). */
export function isAtLastStep(index = 0, cardsCount = 0, visibleCount = 2.7) {
  if (cardsCount <= visibleCount) return true;
  return index >= cardsCount - visibleCount - 1e-6;
}

export function usePeekSlideWidth() {
  const [edgePad, setEdgePad] = useState(16);
  const [visibleCount, setVisibleCount] = useState(2.7);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setEdgePad(getEdgePad(w));
      setVisibleCount(getVisibleSlideCount(w));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { edgePad, visibleCount };
}
