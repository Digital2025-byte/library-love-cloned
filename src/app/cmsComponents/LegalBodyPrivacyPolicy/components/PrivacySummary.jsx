import { typography } from "@/styles/typography";

export default function PrivacySummary({ title, points }) {
  const list = Array.isArray(points) ? points : [];

  if (!list.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2
        className={`${typography.sectionTitle} mb-6 font-semibold text-primary-1`}
      >
        {title || "TABLE OF CONTENTS"}
      </h2>
      <div className="mb-8 space-y-4">
        {list.map((point, index) => (
          <div
            key={point.question || index}
            className="rounded-lg bg-100 p-4 md:p-6"
          >
            {point.question ? (
              <h3
                className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
              >
                {point.question}
              </h3>
            ) : null}
            {point.answer ? (
              <p className={`${typography.body} text-700`}>{point.answer}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
