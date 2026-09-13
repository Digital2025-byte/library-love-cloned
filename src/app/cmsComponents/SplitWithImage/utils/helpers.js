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

export function getSplitWithImageContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      backgroundImageUrl: "",
      imageUrl: "",
      imageAlt: "",
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
  const title = content?.title || "";
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);
  const backgroundImageUrl = getImageSrc(
    content?.backgroundImage?.fileUrl ||
      content?.backgroundImage?.url ||
      content?.backgroundImage?.src
  );
  const image = content?.image || {};
  const imageUrl = getImageSrc(image?.fileUrl || image?.url || image?.src);
  const imageAlt = image?.alt || title || "Aircraft";

  return {
    title,
    description,
    links,
    backgroundImageUrl,
    imageUrl,
    imageAlt,
    hasContent: Boolean(title || description || imageUrl || backgroundImageUrl),
  };
}

export function getSplitWithImageEditorContent(data, lang = "en") {
  const content = getSplitWithImageContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    backgroundImageUrl: content.backgroundImageUrl || "",
    backgroundImageAlt: "",
    imageUrl: content.imageUrl || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapSplitWithImageContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          backgroundImage: {
            fileUrl: content.backgroundImageUrl || "",
            alt: content.backgroundImageAlt || "",
          },
          image: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || "",
          },
        },
      },
    ],
  };
}
