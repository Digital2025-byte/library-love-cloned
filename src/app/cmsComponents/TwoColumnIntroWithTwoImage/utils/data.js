const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80";
const OVERLAY_IMAGE =
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80";

/**
 * Builds CMS-shaped TwoColumnIntroWithTwoImage data from i18next translations.
 */
export function buildTwoColumnIntroData(t) {
  return {
    style: {
      directionLayout: "Left",
    },
    translations: [
      {
        content: {
          title: t("twoColumnIntro.title"),
          description: t("twoColumnIntro.description"),
          ctaButton: {
            label: t("twoColumnIntro.ctaLabel"),
            href: t("twoColumnIntro.ctaHref"),
          },
          illustrationImages: {
            mainImage: {
              fileUrl: MAIN_IMAGE,
              alt: t("twoColumnIntro.mainImageAlt"),
            },
            overlayImage: {
              fileUrl: OVERLAY_IMAGE,
              alt: t("twoColumnIntro.overlayImageAlt"),
            },
          },
        },
      },
    ],
  };
}
