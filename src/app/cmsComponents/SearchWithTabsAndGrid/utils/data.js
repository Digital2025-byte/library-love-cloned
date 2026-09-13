import ph1 from "@/assets/Searchwithtabs/ph1.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped SearchWithTabsAndGrid data from i18next translations.
 */
export function buildSearchWithTabsAndGridData(t, lang = "en") {
  const tags = t("searchWithTabsAndGrid.tags", { returnObjects: true });
  const sights = t("searchWithTabsAndGrid.sights", { returnObjects: true });
  const imageUrl = toUrl(ph1);

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          Search: {
            placeholder: t("searchWithTabsAndGrid.searchPlaceholder"),
          },
          PhotoTileGrid: {
            title: t("searchWithTabsAndGrid.gridTitle"),
          },
          tabbedNavigation: {
            tags: Array.isArray(tags)
              ? tags.map((tag) => ({
                  name: tag?.name || "",
                  Icon: tag?.icon || tag?.Icon || "",
                }))
              : [],
          },
          photoTileGrid: {
            sights: Array.isArray(sights)
              ? sights.map((sight, index) => ({
                  id: sight?.id || `sight-${index + 1}`,
                  name: sight?.name || "",
                  cityName: sight?.cityName || "",
                  tag: sight?.tag || "",
                  slug: sight?.slug || `/sight-${index + 1}`,
                  description: sight?.description || "",
                  image: imageUrl,
                }))
              : [],
          },
          allLabel: t("searchWithTabsAndGrid.allLabel"),
          exploreLabel: t("searchWithTabsAndGrid.exploreLabel"),
          exploreMagazineLabel: t("searchWithTabsAndGrid.exploreMagazineLabel"),
        },
      },
    ],
  };
}
