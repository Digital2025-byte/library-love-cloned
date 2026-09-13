import { typography } from "@/styles/typography";
import LegalCardInfo from "../../LegalBodyTerms/components/LegalCardInfo";

export default function ThirdPartyCookies({ title, description, providers }) {
  const list = Array.isArray(providers) ? providers : [];

  if (!title && !description && !list.length) {
    return null;
  }

  return (
    <section className="mt-8">
      {title ? (
        <h3 className={`${typography.itemTitle} mb-2 font-semibold text-primary-1`}>
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className={`${typography.body} mb-4 leading-relaxed text-700`}>
          {description}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {list.map((item, index) => (
          <LegalCardInfo key={item || index} description={item} />
        ))}
      </div>
    </section>
  );
}
