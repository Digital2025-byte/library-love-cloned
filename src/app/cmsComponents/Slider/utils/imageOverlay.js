import { getThemeColorCss, THEME_COLOR_MAP } from "@/styles/themeColors";

/**
 * Image overlay gradient config for Slider slides.
 *
 * @typedef {Object} ImageOverlayConfig
 * @property {string} [color="main"] - Token or CSS color used for from/via stops
 * @property {number} [fromOpacity=0.7] - Opacity at the bottom (0–1)
 * @property {number} [viaOpacity=0.2] - Opacity at the mid stop (0–1)
 * @property {string} [to="transparent"] - Top stop color
 * @property {string} [direction="to top"] - CSS linear-gradient direction
 * @property {boolean} [enabled=true] - Set false to hide the overlay
 */

const COLOR_TOKENS = {
  main: "var(--color-main)",
  "main-light": "var(--color-main-light)",
  "primary-1": "var(--color-primary-1)",
  "primary-2": "var(--color-primary-2)",
  "primary-3": "var(--color-primary-3)",
  "secondary-1": "var(--color-secondary-1)",
  "secondary-2": "var(--color-secondary-2)",
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
};

export const DEFAULT_IMAGE_OVERLAY = {
  color: "main",
  fromOpacity: 0.7,
  viaOpacity: 0.2,
  to: "transparent",
  direction: "to top",
  enabled: true,
};

function resolveColor(value, fallback = "var(--color-main)") {
  if (value == null || value === "") {
    return fallback;
  }
  const key = String(value).trim();
  if (COLOR_TOKENS[key]) {
    return COLOR_TOKENS[key];
  }
  if (THEME_COLOR_MAP[key]) {
    return getThemeColorCss(key);
  }
  return key;
}

function clampOpacity(value, fallback) {
  const n = Number(value);
  if (Number.isNaN(n)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, n));
}

function withOpacity(color, opacity) {
  if (color === "transparent" || opacity >= 1) {
    return color;
  }
  if (opacity <= 0) {
    return "transparent";
  }
  // Works with hex and CSS variables via color-mix
  const pct = Math.round(opacity * 100);
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/**
 * Merge parent overlay overrides and build a CSS gradient background value.
 * @param {ImageOverlayConfig} [overlay]
 * @returns {{ enabled: boolean, backgroundImage: string } | null}
 */
export function resolveImageOverlay(overlay = {}) {
  const merged = {
    ...DEFAULT_IMAGE_OVERLAY,
    ...overlay,
  };

  if (merged.enabled === false) {
    return null;
  }

  const color = resolveColor(merged.color, COLOR_TOKENS.main);
  const to = resolveColor(merged.to, "transparent");
  const fromOpacity = clampOpacity(merged.fromOpacity, 0.7);
  const viaOpacity = clampOpacity(merged.viaOpacity, 0.2);
  const direction = merged.direction || "to top";

  const from = withOpacity(color, fromOpacity);
  const via = withOpacity(color, viaOpacity);

  return {
    enabled: true,
    backgroundImage: `linear-gradient(${direction}, ${from}, ${via}, ${to})`,
  };
}
