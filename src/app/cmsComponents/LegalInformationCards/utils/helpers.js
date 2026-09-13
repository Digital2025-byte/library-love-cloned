import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";
import { DEFAULT_LEGAL_ICON, LEGAL_ICON_MAP } from "./constants";

export function getLegalIcon(iconName) {
  return LEGAL_ICON_MAP[iconName] || DEFAULT_LEGAL_ICON;
}

export function getLegalHref(posParams, lang, slug) {
  if (!slug) {
    return "#";
  }

  const path = String(slug).startsWith("/") ? slug : `/${slug}`;
  return `/${posParams}/${lang}${path}`;
}

function normalizeCard(card) {
  return {
    title: card?.title || "",
    description: card?.description || "",
    links: normalizeBacklinks(card?.links),
    icon: card?.icon || "document",
    ctaLabel: card?.ctaButton?.content || card?.ctaLabel || "",
    slug: card?.ctaButton?.slug || card?.slug || "",
  };
}

export function getLegalInformationCardsContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { links: [], cards: [], hasContent: false };
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
    links: normalizeBacklinks(content?.links),
    cards,
    hasContent: cards.length > 0,
  };
}

export function getLegalInformationCardsEditorContent(data, lang = "en") {
  const { links, cards } = getLegalInformationCardsContent(data, lang);

  return {
    links: toEditorBacklinks(links),
    cards: cards.map((card) => ({
      title: card.title || "",
      description: card.description || "",
      links: toEditorBacklinks(card.links),
      icon: card.icon || "document",
      ctaLabel: card.ctaLabel || "",
      slug: card.slug || "",
    })),
  };
}

export function wrapLegalInformationCardsContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          links: normalizeBacklinks(content.links),
          cards: (Array.isArray(content.cards) ? content.cards : []).map(
            (card) => ({
              title: card?.title || "",
              description: card?.description || "",
              links: normalizeBacklinks(card?.links),
              icon: card?.icon || "document",
              ctaButton: {
                content: card?.ctaLabel || "",
                slug: card?.slug || "",
              },
            })
          ),
        },
      },
    ],
  };
}
