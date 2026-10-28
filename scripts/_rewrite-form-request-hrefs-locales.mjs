import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

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

function rewrite(text) {
  let out = text;
  for (const id of FORM_IDS) {
    const from = `/help/contact-us/forms/request-a-form?form=${id}`;
    const to = `/help/contact-us/forms/request-${kebab(id)}`;
    out = out.split(from).join(to);
  }
  return out;
}

const files = [
  resolve(process.cwd(), "../flychamadmin/src/cms2/i18n/locales/en.json"),
  resolve(process.cwd(), "../flychamadmin/src/cms2/i18n/locales/ar.json"),
];

for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = rewrite(before);
  writeFileSync(file, after);
  const count = FORM_IDS.reduce(
    (n, id) => n + (before.split(`?form=${id}`).length - 1),
    0,
  );
  console.log(file, before === after ? "unchanged" : `updated (${count} query hrefs)`);
}
