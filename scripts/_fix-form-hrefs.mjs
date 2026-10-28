import { readFileSync, writeFileSync } from "node:fs";

const FORM_IDS = [
  "bookingChange",
  "transportation",
  "nameCorrection",
  "paymentIssue",
  "unaccompaniedMinor",
  "groupTravel",
  "corporateTravel",
  "wheelchair",
  "oxygenService",
  "refund",
  "ancillaryRefund",
  "lostBaggage",
  "delayedBaggage",
  "claimMiles",
  "feedback",
  "apiIntegration",
  "partnerGsa",
  "cargo",
];

function kebab(id) {
  return String(id)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const files = [
  "flychamadmin/src/cms2/i18n/locales/en.json",
  "flychamadmin/src/cms2/i18n/locales/ar.json",
];

for (const file of files) {
  let raw = readFileSync(file, "utf8");
  let n = 0;
  for (const id of FORM_IDS) {
    const from = `/help/contact-us/forms/request-a-form?form=${id}`;
    const to = `/help/contact-us/forms/request-${kebab(id)}`;
    const parts = raw.split(from);
    n += parts.length - 1;
    raw = parts.join(to);
  }
  writeFileSync(file, raw);
  console.log(file, n);
}
