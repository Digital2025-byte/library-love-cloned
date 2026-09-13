import { slides as defaultSlides } from "./data";

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

function normalizeSlide(item) {
  const imageUrl = String(
    item?.imageUrl || item?.src || item?.image?.fileUrl || ""
  ).trim();

  return {
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    badge: item?.badge || "",
    imageUrl: isUsableImageSrc(imageUrl) ? imageUrl : "",
    imageAlt: item?.imageAlt || item?.alt || item?.title || "Slide image",
    src: isUsableImageSrc(imageUrl) ? imageUrl : "",
    alt: item?.imageAlt || item?.alt || item?.title || "Slide image",
  };
}

export function getCoolSlideGalleryContent(data, lang = "en") {
  const content = pickTranslation(data, lang)?.content;
  const source = Array.isArray(content?.items)
    ? content.items
    : Array.isArray(content?.slides)
      ? content.slides
      : defaultSlides;
  const items = source.map((item, index) => normalizeSlide(item, index));

  return {
    items,
    slides: items,
    hasContent: items.length > 0,
  };
}

export function getCoolSlideGalleryEditorContent(data, lang = "en") {
  const { items } = getCoolSlideGalleryContent(data, lang);

  return {
    items: items.map((item) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      badge: item.badge || "",
      imageUrl: item.imageUrl || item.src || "",
      imageAlt: item.imageAlt || item.alt || "",
    })),
  };
}

export function wrapCoolSlideGalleryContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              title: item?.title || "",
              subtitle: item?.subtitle || "",
              badge: item?.badge || "",
              imageUrl: item?.imageUrl || "",
              imageAlt: item?.imageAlt || item?.title || "Slide image",
            })
          ),
        },
      },
    ],
  };
}
