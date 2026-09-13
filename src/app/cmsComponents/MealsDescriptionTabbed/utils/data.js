import ph1 from "@/assets/MealsDescriptionTabbed/ph1.png";
import ph2 from "@/assets/MealsDescriptionTabbed/ph2.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

/**
 * Builds CMS-shaped MealsDescriptionTabbed data from i18next translations.
 */
export function buildMealsDescriptionTabbedData(t, lang = "en") {
  const tabKeys = ["breakfast", "lunchOrDinner"];
  const imagePool = [toUrl(ph1), toUrl(ph2)];

  const notes = t("mealsDescriptionTabbed.notes", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("mealsDescriptionTabbed.title"),
          notes: Array.isArray(notes) ? notes : [],
          tabs: tabKeys.map((key, index) => {
            const sections = t(`mealsDescriptionTabbed.tabs.${key}.sections`, {
              returnObjects: true,
            });

            return {
              label: t(`mealsDescriptionTabbed.tabs.${key}.label`),
              image: {
                fileUrl: imagePool[index % imagePool.length],
                alt: t(`mealsDescriptionTabbed.tabs.${key}.imageAlt`),
              },
              sections: Array.isArray(sections)
                ? sections.map((section) => ({
                    sectionTitle: section?.sectionTitle || "",
                    items: Array.isArray(section?.items)
                      ? section.items.map((item) => ({
                          title: item?.title || "",
                          description: item?.description || "",
                        }))
                      : [],
                    groups: Array.isArray(section?.groups)
                      ? section.groups.map((group) => ({
                          title: group?.title || "",
                          items: Array.isArray(group?.items)
                            ? group.items.map((item) => ({
                                title: item?.title || "",
                                description: item?.description || "",
                              }))
                            : [],
                        }))
                      : [],
                  }))
                : [],
            };
          }),
        },
      },
    ],
  };
}
