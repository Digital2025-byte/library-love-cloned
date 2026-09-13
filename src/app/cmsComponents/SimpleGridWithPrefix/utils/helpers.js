import { getIconSrc } from "./icons";
import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

export function normalizeSimpleGridItem(item, defaults = {}) {
  const grid = item?.grid || {};

  return {
    title: grid?.title || item?.title || "",
    link: grid?.link || item?.link || "#",
    userName: grid?.userName || item?.userName || "",
    icon: grid?.icon || item?.icon || "",
    iconSrc: getIconSrc(grid?.icon || item?.icon),
    prefix: grid?.prefix || item?.prefix || defaults.prefix || "",
    chip: grid?.chip || item?.chip || defaults.chip || "",
  };
}

export function getSimpleGridWithPrefixContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      items: [],
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        translation?.languageCode?.toLowerCase() === normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const title = content?.title || "";
  const description = content?.description || "";
  const defaults = {
    prefix: content?.prefix || "",
    chip: content?.chip || "",
  };
  const rawItems = content?.channels || content?.items || [];
  const items = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeSimpleGridItem(item, defaults))
    : [];

  return {
    title,
    description,
    links: normalizeBacklinks(content?.links),
    items,
    hasContent: Boolean(title || items.length),
  };
}

export function getSimpleGridWithPrefixEditorContent(data, lang = "en") {
  const content = getSimpleGridWithPrefixContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    items: content.items.map((item) => ({
      title: item.title || "",
      userName: item.userName || "",
      link: item.link === "#" ? "" : item.link || "",
      icon: item.icon || "",
      prefix: item.prefix || "",
      chip: item.chip || "",
    })),
  };
}

export function wrapSimpleGridWithPrefixContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          channels: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              grid: {
                title: item?.title || "",
                userName: item?.userName || "",
                link: item?.link || "",
                icon: item?.icon || "",
                prefix: item?.prefix || "",
                chip: item?.chip || "",
              },
            })
          ),
        },
      },
    ],
  };
}
