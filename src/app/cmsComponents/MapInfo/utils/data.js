/**
 * Builds CMS-shaped MapInfo data from i18next translations.
 */
export function buildMapInfoData(t, lang = "en") {
  const branches = t("mapInfo.branches", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("mapInfo.title"),
          description: t("mapInfo.description"),
          branches: Array.isArray(branches)
            ? branches.map((branch, index) => ({
                id: branch?.id || `branch-${index + 1}`,
                name: branch?.name || "",
                country: branch?.country || "",
                city: branch?.city || "",
                address: branch?.address || "",
                phone: branch?.phone || "",
                email: branch?.email || "",
                workingHours: branch?.workingHours || "",
                latitude: branch?.latitude || "",
                longitude: branch?.longitude || "",
              }))
            : [],
        },
      },
    ],
  };
}
