"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { MOVE_DURATION_MS } from "../utils/constants";
import { buildInfiniteList } from "../utils/helpers";

/**
 * Infinite destination slider.
 *
 * The track holds THREE identical copies of the destinations
 * ([A B C][A B C][A B C]). We always navigate inside the middle copy and, once
 * a slide settles, instantly (transition-less) recenter into it whenever we've
 * drifted into a side copy. Because every copy is identical, that recenter is
 * invisible — so the carousel loops forever in both directions with no empty
 * slot to "wait" for at the last item, and no visible snap.
 */
export default function useDestinationShowcase(destinations = []) {
  const length = destinations.length;
  // Full-length clones → 3 identical copies, so the viewport is always filled
  // on both sides regardless of how many cards are visible at once.
  const cloneCount = length;

  const infiniteList = useMemo(
    () => buildInfiniteList(destinations, cloneCount),
    [destinations, cloneCount]
  );

  const [virtualIndex, setVirtualIndex] = useState(cloneCount);
  const [direction, setDirection] = useState(1);
  const [jumping, setJumping] = useState(false);
  const [prevLength, setPrevLength] = useState(length);

  const isAnimatingRef = useRef(false);

  // Reset to the middle copy when the data set changes. React's supported
  // "adjust state while rendering" pattern (state only, no refs), so it never
  // triggers a cascading render.
  if (prevLength !== length) {
    setPrevLength(length);
    setVirtualIndex(cloneCount);
    setJumping(false);
    setDirection(1);
  }

  // The real (title / hero) index is derived straight from the virtual
  // position — a length-sized recenter keeps the same real index, so it never
  // re-triggers the title animation, and title + cards switch on one render.
  const activeIndex =
    length > 0 ? ((virtualIndex % length) + length) % length : 0;

  const step = useCallback(
    (delta) => {
      if (!delta || length <= 1 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setDirection(delta > 0 ? 1 : -1);

      // Animated slide — the track's CSS transition owns the easing/duration.
      const target = virtualIndex + delta;
      setVirtualIndex(target);

      window.setTimeout(() => {
        // Seamlessly recenter into the middle copy once the slide has settled.
        // `isAnimatingRef` guarantees nothing else moved the track meanwhile,
        // so the settled position is exactly `target`.
        let next = target;
        if (target >= 2 * length) next = target - length;
        else if (target < length) next = target + length;

        if (next !== target) {
          // Kill transitions for the instant jump, restore them after paint.
          setJumping(true);
          setVirtualIndex(next);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setJumping(false))
          );
        }

        isAnimatingRef.current = false;
      }, MOVE_DURATION_MS);
    },
    [length, virtualIndex]
  );

  const handleNext = useCallback(() => step(1), [step]);
  const handlePrev = useCallback(() => step(-1), [step]);

  const handleCardClick = useCallback(
    (clickedRealIndex) => {
      if (length <= 1 || isAnimatingRef.current) return;
      const currentReal = ((virtualIndex % length) + length) % length;
      let delta = clickedRealIndex - currentReal;
      // Take the shortest way around the loop.
      if (delta > length / 2) delta -= length;
      else if (delta < -length / 2) delta += length;
      if (delta !== 0) step(delta);
    },
    [length, virtualIndex, step]
  );

  return {
    activeIndex,
    virtualIndex,
    direction,
    jumping,
    infiniteList,
    handleNext,
    handlePrev,
    handleCardClick,
    current: destinations[activeIndex] || null,
  };
}
