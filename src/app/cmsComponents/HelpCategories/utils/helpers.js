function normalizeCard(card) {
  return {
    icon: card?.icon || "question",
    title: card?.title || "",
    description: card?.description || "",
    href: card?.href || card?.slug || "",
  };
}

export function getHelpCategoriesContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", subtitle: "", cards: [], hasContent: false };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawCards = Array.isArray(content.cards) ? content.cards : [];
  const cards = rawCards.map(normalizeCard).filter((card) => card.title);

  return {
    title: content?.title || "",
    subtitle: content?.subtitle || "",
    cards,
    hasContent: cards.length > 0 || Boolean(content?.title),
  };
}

export function getHelpCategoriesEditorContent(data, lang = "en") {
  const { title, subtitle, cards } = getHelpCategoriesContent(data, lang);
  return {
    title: title || "",
    subtitle: subtitle || "",
    cards: cards.map((card) => ({
      icon: card.icon || "question",
      title: card.title || "",
      description: card.description || "",
      href: card.href || "",
    })),
  };
}

export function wrapHelpCategoriesContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          cards: (Array.isArray(content.cards) ? content.cards : []).map(
            (card) => ({
              icon: card?.icon || "question",
              title: card?.title || "",
              description: card?.description || "",
              href: card?.href || "",
            })
          ),
        },
      },
    ],
  };
}
