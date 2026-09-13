/**
 * Builds CMS-shaped FormsDirectory data from i18next translations.
 */
export function buildFormsDirectoryData(t, lang = "en") {
  const tabs = t("formsDirectory.tabs", { returnObjects: true });
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("formsDirectory.title"),
          tabs: Array.isArray(tabs) ? tabs : [],
        },
      },
    ],
  };
}
