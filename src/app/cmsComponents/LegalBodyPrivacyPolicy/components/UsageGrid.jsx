import { typography } from "@/styles/typography";
import LegalCardInfo from "../../LegalBodyTerms/components/LegalCardInfo";

export default function UsageGrid({ title, description, items }) {
  const list = Array.isArray(items) ? items : [];

  if (!title && !description && !list.length) {
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
      {description ? (
        <p className={`${typography.body} mb-6 text-700`}>{description}</p>
      ) : null}
      {list.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.map((item, index) => (
            <LegalCardInfo key={index} description={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
