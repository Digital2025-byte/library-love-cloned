import ph1 from "@/assets/Citiessection/ph1.png";
import ph2 from "@/assets/Citiessection/ph2.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped CitiesSections data from i18next translations.
 */
export function buildCitiesSectionsData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("citiesSections.title"),
          description: t("citiesSections.description"),
          template: t("citiesSections.template"),
          isCTA: true,
          slug: t("citiesSections.slug"),
          ctaLabel: t("citiesSections.ctaLabel"),
          files: [
            {
              fileUrl: toUrl(ph1),
              alt: t("citiesSections.image1Alt"),
            },
            {
              fileUrl: toUrl(ph2),
              alt: t("citiesSections.image2Alt"),
            },
          ],
        },
      },
    ],
  };
}
