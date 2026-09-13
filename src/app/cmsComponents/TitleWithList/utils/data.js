/**
 * Builds CMS-shaped TitleWithList data from i18next translations.
 */
export function buildTitleWithListData(t, lang = "en") {
  const items = t("titleWithList.items", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("titleWithList.title"),
          items: Array.isArray(items)
            ? items.map((entry) => {
                if (typeof entry === "string") {
                  return { item: entry };
                }
                return { item: entry?.item || entry?.content || "" };
              })
            : [],
        },
      },
    ],
  };
}
