import { cookiesPolicyData } from "../constants";

/**
 * Builds CMS-shaped LegalBodyCookies demo data from constants.js.
 * CMS stores `content.body` as a JSON string.
 */
export function buildLegalBodyCookiesData(lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          body: JSON.stringify(cookiesPolicyData),
        },
      },
    ],
  };
}
