/**
 * Builds CMS-shaped LegalBodyTerms demo data.
 * CMS stores `content.body` as a JSON string.
 */
export function buildLegalBodyTermsData(t, lang = "en") {
  const body = t("legalBodyTerms.body", { returnObjects: true });
  const payload = body && typeof body === "object" ? body : {};

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          body: JSON.stringify(payload),
        },
      },
    ],
  };
}
