function normalizeCard(card) {
  return {
    icon: card?.icon || "clipboard",
    title: card?.title || "",
    description: card?.description || "",
    cta: card?.cta || "",
    href: card?.href || "",
  };
}

export function getContactCardsContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      subtitle: "",
      cards: [],
      footerLabel: "",
      footerHref: "#",
      hasContent: false,
    };
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
    footerLabel: content?.footerButton?.content || "",
    footerHref: content?.footerButton?.href || "#",
    hasContent: cards.length > 0 || Boolean(content?.title),
  };
}

export function getContactCardsEditorContent(data, lang = "en") {
  const { title, subtitle, cards, footerLabel, footerHref } =
    getContactCardsContent(data, lang);
  return {
    title: title || "",
    subtitle: subtitle || "",
    footerLabel: footerLabel || "",
    footerHref: footerHref === "#" ? "" : footerHref || "",
    footerLinkType: "internal",
    cards: cards.map((card) => ({ ...card })),
  };
}

export function wrapContactCardsContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          footerButton: {
            content: content.footerLabel || "",
            href: content.footerHref || "",
          },
          cards: (Array.isArray(content.cards) ? content.cards : []).map(
            normalizeCard
          ),
        },
      },
    ],
  };
}
