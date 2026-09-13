import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

export function isUsableImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeItem(raw) {
  const item = raw?.item || raw || {};
  const image = item?.image || {};

  return {
    title: item?.title || "",
    description: item?.description || "",
    links: normalizeBacklinks(item?.links ?? raw?.links),
    imageUrl:
      item?.imageUrl || image?.fileUrl || image?.url || image?.src || "",
    imageAlt: image?.alt || item?.imageAlt || item?.title || "Value image",
  };
}

export function getCarouselImageText6Content(data, lang = "en") {
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
    .filter((item) => item.title || item.imageUrl || item.description);

  return {
    title,
    links: normalizeBacklinks(content?.links),
    items,
    hasContent: Boolean(title || items.length),
  };
}

export function getCarouselImageText6EditorContent(data, lang = "en") {
  const { title, links, items } = getCarouselImageText6Content(data, lang);

  return {
    title,
    links: toEditorBacklinks(links),
    items: items.map((item) => ({
      title: item.title || "",
      description: item.description || "",
      links: toEditorBacklinks(item.links),
      imageUrl: item.imageUrl || "",
      imageAlt: item.imageAlt || "",
    })),
  };
}

export function wrapCarouselImageText6Content(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          links: normalizeBacklinks(content.links),
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              item: {
                title: item?.title || "",
                description: item?.description || "",
                links: normalizeBacklinks(item?.links),
                image: {
                  fileUrl: item?.imageUrl || "",
                  alt: item?.imageAlt || item?.title || "Value image",
                },
              },
            })
          ),
        },
      },
    ],
  };
}
