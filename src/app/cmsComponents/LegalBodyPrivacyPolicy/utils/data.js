import { privacyPolicyData } from "../constants";

/**
 * Builds CMS-shaped LegalBodyPrivacyPolicy demo data from constants.js.
 * CMS stores `content.body` as a JSON string.
 */
export function buildLegalBodyPrivacyPolicyData(lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          body: JSON.stringify(privacyPolicyData),
        },
      },
    ],
  };
}
