import { typography } from "@/styles/typography";

export default function PrivacySimpleSection({
  title,
  subtitle,
  description,
  children,
}) {
  if (!title && !subtitle && !description && !children) {
    return null;
  }

  return (
    <div className="mb-8">
      {title ? (
        <h2
          className={`${typography.sectionTitle} mb-4 font-semibold text-primary-1`}
        >
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className={`${typography.body} mb-4 font-semibold text-700`}>
          {subtitle}
        </p>
      ) : null}
      {description ? (
        <p className={`${typography.body} text-700`}>{description}</p>
      ) : null}
      {children}
    </div>
  );
}
