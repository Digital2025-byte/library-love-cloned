/**
 * Builds CMS-shaped LegalInformationCards demo data.
 */
export function buildLegalInformationCardsData(t, lang = "en") {
  const cards = t("legalInformationCards.cards", { returnObjects: true });
  const safeCards = Array.isArray(cards) ? cards : [];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          cards: safeCards,
        },
      },
    ],
  };
}
