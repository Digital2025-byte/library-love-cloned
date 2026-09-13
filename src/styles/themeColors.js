const token = (value, label, css) => ({
  value,
  label,
  css: css ?? `var(--color-${value})`,
});

export const THEME_COLOR_GROUPS = [
  {
    label: "Brand",
    colors: [
      token("main", "Main"),
      token("main-light", "Main light"),
      token("primary-1", "Primary 1"),
      token("primary-2", "Primary 2"),
      token("primary-3", "Primary 3"),
      token("secondary-1", "Secondary 1"),
      token("secondary-2", "Secondary 2"),
      token("secondary", "Gold"),
      token("secondary-light", "Gold light"),
      token("accent-1", "Accent"),
      token("btn", "Button"),
    ],
  },
  {
    label: "Primary scale",
    colors: [
      token("primary-100", "Primary 100"),
      token("primary-200", "Primary 200"),
      token("primary-300", "Primary 300"),
      token("primary-400", "Primary 400"),
      token("primary-500", "Primary 500"),
      token("primary-600", "Primary 600"),
      token("primary-700", "Primary 700"),
      token("primary-800", "Primary 800"),
    ],
  },
  {
    label: "Sand",
    colors: [
      token("secondary-100", "Sand 100"),
      token("secondary-200", "Sand 200"),
      token("secondary-300", "Sand 300"),
      token("secondary-400", "Sand 400"),
      token("secondary-500", "Sand 500"),
      token("secondary-600", "Sand 600"),
      token("secondary-700", "Sand 700"),
      token("secondary-800", "Sand 800"),
      token("secondary-900", "Sand 900"),
    ],
  },
  {
    label: "Neutral",
    colors: [
      token("background", "Background"),
      token("white", "White", "#ffffff"),
      token("50", "50"),
      token("100", "100"),
      token("200", "200"),
      token("300", "300"),
      token("400", "400"),
      token("500", "500"),
      token("600", "600"),
      token("700", "700"),
      token("800", "800"),
      token("900", "900"),
      token("foreground", "Foreground"),
      token("surface-1", "Surface 1"),
      token("surface-2", "Surface 2"),
      token("icon", "Icon"),
    ],
  },
  {
    label: "Status",
    colors: [
      token("alert", "Alert"),
      token("green", "Green"),
    ],
  },
];

export const THEME_COLOR_MAP = Object.fromEntries(
  THEME_COLOR_GROUPS.flatMap((group) =>
    group.colors.map((color) => [color.value, color])
  )
);

export function getThemeColorCss(tokenValue, fallback = "foreground") {
  const entry = THEME_COLOR_MAP[tokenValue] ?? THEME_COLOR_MAP[fallback];
  return entry?.css ?? `var(--color-${fallback})`;
}

export function getThemeColorLabel(tokenValue) {
  return THEME_COLOR_MAP[tokenValue]?.label ?? tokenValue;
}
