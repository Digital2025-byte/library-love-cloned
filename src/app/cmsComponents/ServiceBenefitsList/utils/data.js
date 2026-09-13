import bannerImage from "@/assets/banner.webp";

const bannerUrl =
  typeof bannerImage === "string" ? bannerImage : bannerImage.src;

/**
 * Builds CMS-shaped ServiceBenefitsList data from i18next translations.
 */
export function buildServiceBenefitsData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          mainTitle: t("serviceBenefits.mainTitle"),
          backgroundImage: {
            fileUrl: bannerUrl,
            alt: t("serviceBenefits.imageAlt"),
          },
          benefits: [
            {
              title: t("serviceBenefits.benefits.0.title"),
              icon: "Armchair",
              description: t("serviceBenefits.benefits.0.description"),
            },
            {
              title: t("serviceBenefits.benefits.1.title"),
              icon: "Star",
              description: t("serviceBenefits.benefits.1.description"),
            },
            {
              title: t("serviceBenefits.benefits.2.title"),
              icon: "Tag",
              description: t("serviceBenefits.benefits.2.description"),
            },
          ],
        },
      },
    ],
  };
}
