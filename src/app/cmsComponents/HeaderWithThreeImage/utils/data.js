/**
 * Builds CMS-shaped HeaderWithThreeImage data from i18next translations.
 */
export function buildHeaderWithThreeImageData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("headerWithThreeImage.title"),
          description: t("headerWithThreeImage.description"),
          buttonText: t("headerWithThreeImage.buttonText"),
          ctaButton: {
            content: t("headerWithThreeImage.buttonText"),
            label: t("headerWithThreeImage.buttonText"),
            href: "/destinations",
            slug: "destinations",
          },
          backgroundImageOne: {
            fileUrl:
              "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
            alt: t("headerWithThreeImage.imageOneAlt"),
          },
          backgroundImageTwo: {
            fileUrl:
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
            alt: t("headerWithThreeImage.imageTwoAlt"),
          },
          backgroundImageThree: {
            fileUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            alt: t("headerWithThreeImage.imageThreeAlt"),
          },
          backgroundMobileImageOne: {
            fileUrl:
              "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
            alt: t("headerWithThreeImage.imageOneAlt"),
          },
          backgroundMobileImageTwo: {
            fileUrl:
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
            alt: t("headerWithThreeImage.imageTwoAlt"),
          },
          backgroundMobileImageThree: {
            fileUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            alt: t("headerWithThreeImage.imageThreeAlt"),
          },
        },
      },
    ],
  };
}
