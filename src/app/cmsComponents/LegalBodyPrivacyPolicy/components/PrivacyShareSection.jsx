import { typography } from "@/styles/typography";
import PrivacySimpleSection from "./PrivacySimpleSection";

export default function PrivacyShareSection({
  section,
  shareSituationsLabel,
}) {
  if (!section) {
    return null;
  }

  const categories = Array.isArray(section.vendors?.categories)
    ? section.vendors.categories
    : [];
  const situations = Array.isArray(section.otherSituations)
    ? section.otherSituations
    : [];

  return (
    <PrivacySimpleSection title={section.title} subtitle={section.subtitle}>
      {section.vendors ? (
        <div className="mb-6">
          {section.vendors.title ? (
            <h3
              className={`${typography.itemTitle} mb-3 font-medium text-primary-1`}
            >
              {section.vendors.title}
            </h3>
          ) : null}
          {section.vendors.description ? (
            <p className={`${typography.body} mb-4 text-700`}>
              {section.vendors.description}
            </p>
          ) : null}
          {categories.length ? (
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div
                  key={category.title || index}
                  className="rounded-lg bg-100 p-4 md:p-6"
                >
                  <h4
                    className={`${typography.itemTitle} mb-3 font-medium text-primary-1`}
                  >
                    {category.title}
                  </h4>
                  <ul className="space-y-2">
                    {(category.items || []).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-2" />
                        <span className={`${typography.body} text-700`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {situations.length ? (
        <div className="mb-6">
          <p className={`${typography.body} mb-4 font-semibold text-700`}>
            {shareSituationsLabel ||
              "We also may need to share your personal information in the following situations:"}
          </p>
          {situations.map((situation, index) => (
            <div key={situation.title || index} className="mb-4">
              <h4
                className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
              >
                {situation.title}
              </h4>
              <p className={`${typography.body} text-700`}>
                {situation.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </PrivacySimpleSection>
  );
}
