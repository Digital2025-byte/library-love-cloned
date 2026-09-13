import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";
import { features as defaultFeatures } from "./data";

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

function pickTranslation(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];
  const normalized = String(lang || "").toLowerCase();
  return (
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0]
  );
}

function normalizeFeature(item) {
  const imageUrl = String(
    item?.imageUrl || item?.image || item?.src || ""
  ).trim();

  return {
    title: item?.title || "",
    description: item?.description || "",
    links: normalizeBacklinks(item?.links),
    imageUrl: isUsableImageSrc(imageUrl) ? imageUrl : "",
    image: isUsableImageSrc(imageUrl) ? imageUrl : "",
    icon: item?.icon,
  };
}

export function getScrollCarouselContent(data, lang = "en") {
  const content = pickTranslation(data, lang)?.content;
  const source = Array.isArray(content?.items)
    ? content.items
    : Array.isArray(content?.features)
      ? content.features
      : defaultFeatures;
  const items = source.map((item) => normalizeFeature(item));

  return {
    links: normalizeBacklinks(content?.links),
    items,
    features: items,
    hasContent: items.length > 0,
  };
}

export function getScrollCarouselEditorContent(data, lang = "en") {
  const { links, items } = getScrollCarouselContent(data, lang);

  return {
    links: toEditorBacklinks(links),
    items: items.map((item) => ({
      title: item.title || "",
      description: item.description || "",
      links: toEditorBacklinks(item.links),
      imageUrl: item.imageUrl || item.image || "",
    })),
  };
}

export function wrapScrollCarouselContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          links: normalizeBacklinks(content.links),
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              title: item?.title || "",
              description: item?.description || "",
              links: normalizeBacklinks(item?.links),
              imageUrl: item?.imageUrl || "",
            })
          ),
        },
      },
    ],
  };
}
