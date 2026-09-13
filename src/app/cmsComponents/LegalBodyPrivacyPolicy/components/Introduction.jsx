import { typography } from "@/styles/typography";

export default function Introduction({ title, children }) {
  if (!title && !children) {
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
      {typeof children === "string" || typeof children === "number" ? (
        <p className={`${typography.body} leading-relaxed text-700`}>
          {children}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
