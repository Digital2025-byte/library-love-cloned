"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";

let debounceId;
let ignoreUntil = 0;

/**
 * Recalculate GSAP pin start/end after layout shifts (lazy demo sections).
 */
export function refreshScrollTriggers(delay = 0) {
  if (typeof window === "undefined") return;

  window.clearTimeout(debounceId);
  debounceId = window.setTimeout(() => {
    if (ScrollTrigger.getAll().length === 0) return;
    if (Date.now() < ignoreUntil) return;

    ignoreUntil = Date.now() + 250;
    ScrollTrigger.refresh();
  }, delay);
}
