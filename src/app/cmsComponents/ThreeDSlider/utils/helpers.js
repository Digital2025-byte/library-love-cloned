import { sliderItems } from "./data";

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

function padNum(index) {
  return String(index + 1).padStart(2, "0");
}

function normalizeSliderItem(item, index) {
  const title = item?.title || "";
  const imageUrl = String(item?.imageUrl || item?.image?.fileUrl || "").trim();

  return {
    title,
    num: item?.num || padNum(index),
    imageUrl: isUsableImageSrc(imageUrl) ? imageUrl : "",
    imageAlt: item?.imageAlt || item?.alt || title || "Slide image",
    data: item?.data || { id: index + 1 },
  };
}

export function getThreeDSliderContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    const items = sliderItems.map((item, index) =>
      normalizeSliderItem(item, index)
    );

    return {
      items,
      hasContent: items.length > 0,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() === normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const items = (Array.isArray(content.items) ? content.items : []).map(
    (item, index) => normalizeSliderItem(item, index)
  );

  return {
    items,
    hasContent: items.length > 0,
  };
}

export function getThreeDSliderEditorContent(data, lang = "en") {
  const { items } = getThreeDSliderContent(data, lang);

  return {
    items: items.map((item, index) => ({
      title: item.title || "",
      num: item.num || padNum(index),
      imageUrl: item.imageUrl || "",
      imageAlt: item.imageAlt || "",
    })),
  };
}

export function wrapThreeDSliderContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item, index) => ({
              title: item?.title || "",
              num: item?.num || padNum(index),
              imageUrl: item?.imageUrl || "",
              imageAlt: item?.imageAlt || item?.title || "Slide image",
              data: { id: index + 1 },
            })
          ),
        },
      },
    ],
  };
}
