/**
 * Control themes for slider arrows, dots, and CTA button.
 * Each uses the named color as the base, and a lighter token for hover.
 * Active dots and button background use the same base color (`bg`).
 *
 * primary-1   → hover: primary-400
 * primary-2   → hover: secondary-900
 * secondary-1 → hover: primary-500
 * secondary-2 → hover: primary-700
 */
import { getThemeColorCss } from "@/styles/themeColors";

export const SLIDER_THEMES = {
  "primary-1": {
    bg: "var(--color-primary-1)",
    hoverBg: "var(--color-primary-400)",
    icon: "#ffffff",
  },
  "primary-2": {
    bg: "var(--color-primary-2)",
    hoverBg: "var(--color-secondary-900)",
    icon: "#ffffff",
  },
  "secondary-1": {
    bg: "var(--color-secondary-1)",
    hoverBg: "var(--color-primary-500)",
    icon: "#ffffff",
  },
  "secondary-2": {
    bg: "var(--color-secondary-2)",
    hoverBg: "var(--color-primary-700)",
    icon: "#ffffff",
  },
};

export const DEFAULT_THEME = "primary-1";

export function resolveTheme(theme = DEFAULT_THEME) {
  const key = String(theme || "").trim();
  const preset = SLIDER_THEMES[key];

  if (preset) {
    return preset;
  }

  const bg = getThemeColorCss(key, "primary-1");

  return {
    bg,
    hoverBg: bg,
    icon: "#ffffff",
  };
}

/** @deprecated Use SLIDER_THEMES */
export const ARROW_THEMES = SLIDER_THEMES;
/** @deprecated Use DEFAULT_THEME */
export const DEFAULT_ARROW_THEME = DEFAULT_THEME;
/** @deprecated Use resolveTheme */
export const resolveArrowTheme = resolveTheme;
