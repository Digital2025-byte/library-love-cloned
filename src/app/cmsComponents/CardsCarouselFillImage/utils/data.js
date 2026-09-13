const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80",
];

/**
 * Builds CMS-shaped CardsCarouselFillImage data from i18next translations.
 */
export function buildCardsCarouselFillImageData(t, lang = "en") {
  const pages = t("cardsCarouselFillImage.pages", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("cardsCarouselFillImage.title"),
          description: t("cardsCarouselFillImage.description"),
          pages: Array.isArray(pages)
            ? pages.map((page, index) => ({
                id: page?.id || `page-${index + 1}`,
                title: page?.title || "",
                description: page?.description || "",
                CardImage: {
                  fileUrl: CARD_IMAGES[index % CARD_IMAGES.length],
                  alt: page?.imageAlt || page?.title || "",
                },
                CTA: {
                  content: page?.buttonText || "",
                  slug: page?.slug || "",
                },
                buttonLink: page?.buttonLink || "#",
              }))
            : [],
        },
      },
    ],
  };
}
