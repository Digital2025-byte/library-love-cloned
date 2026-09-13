import { typography } from "@/styles/typography";
import PrivacySimpleSection from "./PrivacySimpleSection";

export default function PrivacyContactSection({ section }) {
  if (!section) {
    return null;
  }

  const address = section.address;

  return (
    <PrivacySimpleSection title={section.title} description={section.description}>
      {address ? (
        <div className={`${typography.body} mt-4 rounded-lg bg-100 p-4 text-700 md:p-6`}>
          {address.company ? (
            <p className="mb-1 font-bold text-700">{address.company}</p>
          ) : null}
          {address.line1 ? <p>{address.line1}</p> : null}
          {address.line2 ? <p>{address.line2}</p> : null}
          {address.city ? <p>{address.city}</p> : null}
          {address.country ? <p>{address.country}</p> : null}
        </div>
      ) : null}
    </PrivacySimpleSection>
  );
}
