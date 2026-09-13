import { typography } from "@/styles/typography";

export default function LegalCardInfo({
  title,
  description,
  className = "",
  titleCss,
  bodyCss,
}) {
  if (!title && !description) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border border-200 bg-gradient-to-br from-100 via-50 to-secondary-100 p-6 md:p-8 ${className}`}
    >
      {title ? (
        <h3
          className={`${typography.itemTitle} mb-2 font-medium`}
          style={{ color: titleCss || "var(--color-primary-1)" }}
        >
          {title}
        </h3>
      ) : null}
      {description ? (
        <p
          className={`${typography.body} leading-relaxed`}
          style={{ color: bodyCss || "var(--color-700)" }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
