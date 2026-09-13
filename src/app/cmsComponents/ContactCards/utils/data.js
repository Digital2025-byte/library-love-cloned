/**
 * Builds CMS-shaped ContactCards data from i18next translations.
 */
export function buildContactCardsData(t, lang = "en") {
  const cards = t("contactCards.cards", { returnObjects: true });
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("contactCards.title"),
          subtitle: t("contactCards.subtitle"),
          footerButton: {
            content: t("contactCards.footerLabel"),
            href: t("contactCards.footerHref"),
          },
          cards: Array.isArray(cards) ? cards : [],
        },
      },
    ],
  };
}
