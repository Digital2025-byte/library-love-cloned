/**
 * Builds CMS-shaped FaqExplorer data from i18next translations.
 */
export function buildFaqExplorerData(t, lang = "en") {
  const categories = t("faqExplorer.categories", { returnObjects: true });
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("faqExplorer.title"),
          browseButton: {
            content: t("faqExplorer.browseLabel"),
            href: t("faqExplorer.browseHref"),
          },
          categories: Array.isArray(categories) ? categories : [],
        },
      },
    ],
  };
}
