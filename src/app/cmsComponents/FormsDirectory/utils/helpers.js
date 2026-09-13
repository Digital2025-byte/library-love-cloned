function normalizeCard(card) {
  return {
    icon: card?.icon || "ticket",
    category: card?.category || "",
    title: card?.title || "",
    description: card?.description || "",
    href: card?.href || "",
  };
}

function normalizeTab(tab) {
  return {
    label: tab?.label || "",
    cards: Array.isArray(tab?.cards) ? tab.cards.map(normalizeCard) : [],
  };
}

export function getFormsDirectoryContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", tabs: [], hasContent: false };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawTabs = Array.isArray(content.tabs) ? content.tabs : [];
  const tabs = rawTabs.map(normalizeTab).filter((tab) => tab.cards.length || tab.label);

  return {
    title: content?.title || "",
    tabs,
    hasContent: tabs.length > 0,
  };
}

export function getFormsDirectoryEditorContent(data, lang = "en") {
  const { title, tabs } = getFormsDirectoryContent(data, lang);
  return {
    title: title || "",
    tabs: tabs.map((tab) => ({
      label: tab.label || "",
      cards: tab.cards.map((card) => ({ ...card })),
    })),
  };
}

export function wrapFormsDirectoryContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          tabs: (Array.isArray(content.tabs) ? content.tabs : []).map((tab) => ({
            label: tab?.label || "",
            cards: (Array.isArray(tab?.cards) ? tab.cards : []).map(
              normalizeCard
            ),
          })),
        },
      },
    ],
  };
}
