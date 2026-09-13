/**
 * Builds CMS-shaped OfficeDirectory data from i18next translations.
 */
export function buildOfficeDirectoryData(t, lang = "en") {
  const tabs = t("officeDirectory.tabs", { returnObjects: true });
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          callLabel: t("officeDirectory.callLabel"),
          emailLabel: t("officeDirectory.emailLabel"),
          weekendLabel: t("officeDirectory.weekendLabel"),
          tabsLabel: t("officeDirectory.tabsLabel"),
          tabs: Array.isArray(tabs) ? tabs : [],
        },
      },
    ],
  };
}
