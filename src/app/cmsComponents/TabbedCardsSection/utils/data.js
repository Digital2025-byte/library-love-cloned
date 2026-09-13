const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=900&q=80",
];

/**
 * Builds CMS-shaped TabbedCardsSection data from i18next translations.
 */
export function buildTabbedCardsData(t, lang = "en") {
  const tabs = t("tabbedCards.tabs", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("tabbedCards.title"),
          subtitle: t("tabbedCards.subtitle"),
          tabs: Array.isArray(tabs)
            ? tabs.map((tab, tabIndex) => ({
                label: tab?.label || "",
                cards: Array.isArray(tab?.cards)
                  ? tab.cards.map((card, cardIndex) => ({
                      title: card?.title || "",
                      description: card?.description || "",
                      image: {
                        fileUrl:
                          CARD_IMAGES[
                            (tabIndex * 3 + cardIndex) % CARD_IMAGES.length
                          ],
                        alt: card?.imageAlt || card?.title || "Card image",
                      },
                    }))
                  : [],
              }))
            : [],
        },
      },
    ],
  };
}
