export function applyInspectorReset(current, defaults, keys) {
  const next = { ...current };

  keys.forEach((key) => {
    const value = defaults?.[key];
    next[key] = Array.isArray(value)
      ? value.map((item) =>
          item && typeof item === "object" ? { ...item } : item
        )
      : value;
  });

  return next;
}
