const ITEM_IMAGES = [
  {
    fileUrl:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
    alt: "Airplane flying through clouds",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80",
    alt: "Airport terminal interior",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=80",
    alt: "Aircraft cabin seats",
  },
  {
    fileUrl:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    alt: "Travel destination city view",
  },
];

/**
 * Builds CMS-shaped accordion-with-images data from i18next translations.
 */
export function buildAccordionWithImagesData(t) {
  const items = t("accordionWithImages.items", { returnObjects: true });

  return {
    translations: [
      {
        content: {
          title: t("accordionWithImages.title"),
          description: t("accordionWithImages.description"),
          items: Array.isArray(items)
            ? items.map((item, index) => ({
                title: item?.title || "",
                description: item?.description || "",
                illustrationImage: {
                  fileUrl: ITEM_IMAGES[index % ITEM_IMAGES.length].fileUrl,
                  alt:
                    item?.title ||
                    ITEM_IMAGES[index % ITEM_IMAGES.length].alt,
                },
              }))
            : [],
        },
      },
    ],
  };
}
