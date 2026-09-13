import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

export function getImageSrc(src) {
  if (!src) {
    return "";
  }
  if (typeof src === "string") {
    return src.trim();
  }
  if (typeof src === "object") {
    const nested = src.src || src.default || src.fileUrl || src.url || "";
    if (nested && nested !== src) {
      return getImageSrc(nested);
    }
  }
  return "";
}

export function isUsableImageSrc(src) {
  const value = getImageSrc(src);
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

export function getTextWithBlobContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations) ? data.translations : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      imageSrc: "",
      imageAlt: "Blob image",
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const image = content?.image || {};
  const title = content?.title || "";
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);
  const imageSrc = getImageSrc(image?.fileUrl || image?.url || image?.src);

  return {
    title,
    description,
    links,
    imageSrc,
    imageAlt: image?.alt || title || "Blob image",
    hasContent: Boolean(title || description),
  };
}

export function getTextWithBlobEditorContent(data, lang = "en") {
  const content = getTextWithBlobContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    imageUrl: content.imageSrc || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapTextWithBlobContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          image: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || "",
          },
        },
      },
    ],
  };
}
