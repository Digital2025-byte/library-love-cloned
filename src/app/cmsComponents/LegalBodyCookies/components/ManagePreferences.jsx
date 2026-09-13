import { typography } from "@/styles/typography";
import LegalAlert from "../../LegalBodyTerms/components/LegalAlert";
import LegalCardInfo from "../../LegalBodyTerms/components/LegalCardInfo";

export default function ManagePreferences({ title, intro, methods, note }) {
  const list = Array.isArray(methods) ? methods : [];

  if (!title && !intro && !list.length && !note) {
    return null;
  }

  return (
    <section className="mt-10 space-y-4">
      {title ? (
        <h3 className={`${typography.itemTitle} font-semibold text-primary-1`}>
          {title}
        </h3>
      ) : null}
      {intro ? <LegalAlert message={intro} variant="secondary" /> : null}
      {list.length ? (
        <div className="space-y-3">
          {list.map((item, index) => (
            <LegalCardInfo
              key={item.title || index}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      ) : null}
      {note ? <LegalCardInfo description={note} /> : null}
    </section>
  );
}
