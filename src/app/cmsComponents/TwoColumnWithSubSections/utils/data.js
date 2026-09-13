import mainImage from "@/assets/Two_Column_With_Sub_Sections_image1.png";
import overlayImage from "@/assets/Two_Column_With_Sub_Sections_image2.png";

/**
 * Builds CMS-shaped TwoColumnWithSubSections data from i18next translations.
 */
export function buildTwoColumnWithSubSectionsData(t) {
  return {
    style: {
      ctaButton: {
        slug: "",
      },
    },
    translations: [
      {
        content: {
          sectionLabel: t("twoColumnWithSubSections.sectionLabel"),
          title: t("twoColumnWithSubSections.title"),
          description: t("twoColumnWithSubSections.description"),
          firstSubSection: {
            title: t("twoColumnWithSubSections.firstSubSection.title"),
            description: t(
              "twoColumnWithSubSections.firstSubSection.description"
            ),
          },
          secondSubSection: {
            title: t("twoColumnWithSubSections.secondSubSection.title"),
            description: t(
              "twoColumnWithSubSections.secondSubSection.description"
            ),
          },
          ctaButton: {
            label: t("twoColumnWithSubSections.ctaLabel"),
            href: t("twoColumnWithSubSections.ctaHref"),
          },
          illustrationImages: {
            mainImage: {
              fileUrl: mainImage,
              alt: t("twoColumnWithSubSections.mainImageAlt"),
            },
            overlayImage: {
              fileUrl: overlayImage,
              alt: t("twoColumnWithSubSections.overlayImageAlt"),
            },
          },
        },
      },
    ],
  };
}
