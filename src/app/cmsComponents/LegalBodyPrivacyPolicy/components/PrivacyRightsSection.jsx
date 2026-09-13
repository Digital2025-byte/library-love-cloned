import { typography } from "@/styles/typography";
import PrivacySimpleSection from "./PrivacySimpleSection";

export default function PrivacyRightsSection({ section }) {
  if (!section) {
    return null;
  }

  const rights = Array.isArray(section.rights) ? section.rights : [];

  return (
    <PrivacySimpleSection title={section.title} subtitle={section.subtitle}>
      {rights.length ? (
        <div className="space-y-4">
          {rights.map((right, index) => (
            <div
              key={right.title || index}
              className="rounded-lg bg-100 p-4 md:p-6"
            >
              <h3
                className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
              >
                {right.title}
              </h3>
              <p className={`${typography.body} text-700`}>
                {right.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </PrivacySimpleSection>
  );
}
