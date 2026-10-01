import { readFileSync, writeFileSync } from "node:fs";

const re = /\/help\/contact-us\/forms\/([A-Za-z0-9]+)\/request/g;
const files = [
  "flychamadmin/src/cms2/i18n/locales/en.json",
  "flychamadmin/src/cms2/i18n/locales/ar.json",
];

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  let n = 0;
  const next = raw.replace(re, (_m, id) => {
    n += 1;
    return `/help/contact-us/forms/request-a-form?form=${id}`;
  });
  if (n !== 36) {
    console.error(file, "expected 36 hrefs, got", n);
    process.exit(1);
  }
  writeFileSync(file, next);
  console.log(file, n);
}
