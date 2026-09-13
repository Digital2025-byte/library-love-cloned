/**
 * Lightweight className merger (no clsx / tailwind-merge dependency).
 */
export function cn(...inputs) {
  return inputs
    .flatMap((value) => {
      if (!value) return [];
      if (typeof value === "string") return [value];
      if (Array.isArray(value)) return value;
      if (typeof value === "object") {
        return Object.entries(value)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");
}
