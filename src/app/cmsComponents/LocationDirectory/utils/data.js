/**
 * Builds CMS-shaped LocationDirectory data from i18next translations.
 * Reads a tabs array of { label, locations: [...] } from the given key.
 */
export function buildLocationDirectoryData(t, lang = "en") {
  const tabs = t("locationDirectory.tabs", { returnObjects: true });
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("locationDirectory.title"),
          subtitle: t("locationDirectory.subtitle"),
          tabs: Array.isArray(tabs) ? tabs : [],
        },
      },
    ],
  };
}
