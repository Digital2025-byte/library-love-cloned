import { typography } from "@/styles/typography";
import { isLimitationSection } from "../utils/helpers";
import LegalAlert from "./LegalAlert";
import LegalCardInfo from "./LegalCardInfo";

export default function LegalBodySection({ section, limitationTitle, style }) {
  if (!section) {
    return null;
  }

  const items = Array.isArray(section.items) ? section.items : [];
  const useAlerts = isLimitationSection(section, limitationTitle);
  const resolvedTitle = style?.titleCss;
  const resolvedBody = style?.bodyCss;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {section.title ? (
          <h3
            className={`${typography.itemTitle} font-semibold`}
            style={{ color: resolvedTitle || "var(--color-primary-1)" }}
          >
            {section.title}
          </h3>
        ) : null}
        {section.intro ? (
          <p
            className={`${typography.body} leading-relaxed`}
            style={{ color: resolvedBody || "var(--color-700)" }}
          >
            {section.intro}
          </p>
        ) : null}
      </div>

      {useAlerts ? (
        <div className="space-y-4">
          {items.map((item, index) => (
            <LegalAlert
              key={item.title || index}
              message={item.description}
              variant="secondary"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {items.map((item, index) => (
            <LegalCardInfo
              key={item.title || index}
              title={item.title}
              description={item.description}
              titleCss={resolvedTitle}
              bodyCss={resolvedBody}
            />
          ))}
        </div>
      )}
    </div>
  );
}
