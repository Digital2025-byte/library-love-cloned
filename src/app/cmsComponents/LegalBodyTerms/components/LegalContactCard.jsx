import Link from "next/link";
import { typography } from "@/styles/typography";

export default function LegalContactCard({ contact, lang = "en" }) {
  if (!contact) {
    return null;
  }

  const { company, department, email, phone, address } = contact;
  const emailLabel = lang === "ar" ? "البريد الإلكتروني" : "Email";
  const phoneLabel = lang === "ar" ? "الهاتف" : "Phone";

  return (
    <div className="rounded-xl border border-200 bg-gradient-to-br from-100 via-50 to-secondary-100 p-6 md:p-8">
      <div className={`${typography.body} space-y-1 text-700`}>
        {company ? <p className="font-bold text-700">{company}</p> : null}
        {department ? <p>{department}</p> : null}
        {address ? <p>{address}</p> : null}
        {email ? (
          <p>
            {emailLabel}:{" "}
            <Link
              className="text-primary-1 hover:underline"
              href={`mailto:${email}`}
            >
              {email}
            </Link>
          </p>
        ) : null}
        {phone ? (
          <p>
            {phoneLabel}:{" "}
            <Link
              className="text-primary-1 hover:underline"
              href={`tel:${phone}`}
            >
              {phone}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
