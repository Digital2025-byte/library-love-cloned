import { typography } from "@/styles/typography";
import LegalCardInfo from "../../LegalBodyTerms/components/LegalCardInfo";

export default function LifespanSection({ title, intro, items }) {
  const list = Array.isArray(items) ? items : [];

  if (!title && !intro && !list.length) {
    return null;
  }

  return (
    <section className="mt-10">
      {title ? (
        <h3 className={`${typography.itemTitle} mb-2 font-semibold text-primary-1`}>
          {title}
        </h3>
      ) : null}
      {intro ? (
        <p className={`${typography.body} mb-4 leading-relaxed text-700`}>
          {intro}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((item, index) => (
          <LegalCardInfo
            key={item.title || index}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}
