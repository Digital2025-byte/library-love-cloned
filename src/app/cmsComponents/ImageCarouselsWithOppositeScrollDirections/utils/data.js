const TOP_DESTINATIONS = [
  {
    fileUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.maldives",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1000&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.venice",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.dubai",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.paris",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1000&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.barcelona",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.rome",
  },
];

const BOTTOM_DESTINATIONS = [
  {
    fileUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.istanbul",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.marrakech",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1546412414-8035f128c3c5?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.cairo",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.nature",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.europe",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    titleKey: "imageCarouselsWithOppositeScroll.destinations.adventure",
  },
];

/**
 * Builds CMS-shaped opposite-scroll carousel data from i18next translations.
 */
export function buildImageCarouselsWithOppositeScrollData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          carouselTitle: t("imageCarouselsWithOppositeScroll.title"),
          carouselDescription: t(
            "imageCarouselsWithOppositeScroll.description"
          ),
          exploreLabel: t("imageCarouselsWithOppositeScroll.exploreLabel"),
          exploreHref: t("imageCarouselsWithOppositeScroll.exploreHref"),
          itemsLeftToRight: TOP_DESTINATIONS.map((item) => ({
            imagesLeftToRight: {
              fileUrl: item.fileUrl,
              title: t(item.titleKey),
              alt: t(item.titleKey),
            },
          })),
          itemsRightToLeft: BOTTOM_DESTINATIONS.map((item) => ({
            imagesRightToLeft: {
              fileUrl: item.fileUrl,
              title: t(item.titleKey),
              alt: t(item.titleKey),
            },
          })),
        },
      },
    ],
  };
}
