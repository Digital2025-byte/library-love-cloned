import { typography } from "@/styles/typography";

export default function LegalChip({
  children,
  label = "",
  className = "",
  colorCss,
}) {
  if (!children) {
    return null;
  }

  const color = colorCss || "var(--color-primary-1)";

  return (
    <span
      className={`inline-block rounded-full bg-main/12 px-4 py-2 ${className}`}
    >
      {label ? (
        <span className={`${typography.caption} font-bold`} style={{ color }}>
          {label}{" "}
        </span>
      ) : null}
      <span className={`${typography.caption} font-medium`} style={{ color }}>
        {children}
      </span>
    </span>
  );
}
