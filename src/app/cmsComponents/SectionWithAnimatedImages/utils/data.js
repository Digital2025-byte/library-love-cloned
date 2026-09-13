const TRAVEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
    alt: "Traveler with suitcase at airport",
  },
  {
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80",
    alt: "Airplane wing above the clouds",
  },
  {
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
    alt: "Road trip through scenic mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    alt: "Tropical beach destination",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80",
    alt: "Lake and mountain landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1530521954074-e13fc999d8a0?auto=format&fit=crop&w=400&q=80",
    alt: "Family traveling together",
  },
];

/**
 * Builds CMS-shaped SectionWithAnimatedImages data from i18next translations.
 */
export function buildSectionWithAnimatedImagesData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          preTitle: t("sectionWithAnimatedImages.preTitle"),
          title: t("sectionWithAnimatedImages.title"),
          buttonText: t("sectionWithAnimatedImages.buttonText"),
          buttonLink: t("sectionWithAnimatedImages.buttonLink"),
          iconType: "Instagram",
          Cards: TRAVEL_IMAGES.map((image) => ({
            ImageCard: {
              fileUrl: image.src,
              alt: image.alt,
            },
          })),
        },
      },
    ],
  };
}
