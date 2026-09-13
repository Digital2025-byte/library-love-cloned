import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function normalizeItem(entry) {
  let text = "";
  if (typeof entry === "string") {
    text = entry;
  } else if (typeof entry?.item === "string") {
    text = entry.item;
  } else if (typeof entry?.content === "string") {
    text = entry.content;
  } else if (typeof entry?.text === "string") {
    text = entry.text;
  }

  if (!text) {
    return null;
  }

  return {
    text,
    links: normalizeBacklinks(entry?.links),
  };
}

export function getTitleWithListContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", links: [], items: [], hasContent: false };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const title = content?.title || "";
  const items = (Array.isArray(content?.items) ? content.items : [])
    .map(normalizeItem)
    .filter(Boolean);

  return {
    title,
    links: normalizeBacklinks(content?.links),
    items,
    hasContent: Boolean(title || items.length),
  };
}

export function getTitleWithListEditorContent(data, lang = "en") {
  const content = getTitleWithListContent(data, lang);

  return {
    title: content.title || "",
    links: toEditorBacklinks(content.links),
    items: content.items.map((item) => ({
      text: item.text || "",
      links: toEditorBacklinks(item.links),
    })),
  };
}

export function wrapTitleWithListContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          links: normalizeBacklinks(content.links),
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              item: item?.text || item?.item || "",
              links: normalizeBacklinks(item?.links),
            })
          ),
        },
      },
    ],
  };
}
