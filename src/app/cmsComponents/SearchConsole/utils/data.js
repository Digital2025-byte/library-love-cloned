/**
 * Builds CMS-shaped SearchConsole data from i18next translations.
 */
export function buildSearchConsoleData(t, lang = "en") {
  const popular = t("searchConsole.popularItems", { returnObjects: true });
  const safePopular = Array.isArray(popular) ? popular : [];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          label: t("searchConsole.label"),
          placeholder: t("searchConsole.placeholder"),
          submitLabel: t("searchConsole.submit"),
          popularLabel: t("searchConsole.popularLabel"),
          popularItems: safePopular,
        },
      },
    ],
  };
}
