/**
 * Builds CMS-shaped GridInfo data from i18next translations.
 */
export function buildGridInfoData(t, lang = "en") {
  const branches = t("gridInfo.branches", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("gridInfo.title"),
          description: t("gridInfo.description"),
          branches: Array.isArray(branches)
            ? branches.map((branch) => ({
                grid: {
                  name: branch?.name || "",
                  city: branch?.city || "",
                  address: branch?.address || "",
                  phone: branch?.phone || "",
                  email: branch?.email || "",
                  workingHoursText: branch?.workingHoursText || "",
                },
              }))
            : [],
        },
      },
    ],
  };
}
