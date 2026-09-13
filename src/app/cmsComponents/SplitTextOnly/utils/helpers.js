import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

/**
 * Escapes spaces and parentheses so a URL is safe inside CSS url().
 */
export function toCssUrl(url = "") {
  return String(url)
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function toImageSrc(value) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return value.src || value.fileUrl || value.url || "";
}

export function isUsableImageSrc(src) {
  const value = String(toImageSrc(src) || "").trim();
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

export function getSplitTextOnlyContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations) ? data.translations : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      backgroundImage: "",
      backgroundImageAlt: "",
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
  const description = content?.description || content?.subtitle || "";
  const links = normalizeBacklinks(content?.links);
  const backgroundImage = toImageSrc(
    content?.backgroundImage?.fileUrl || content?.backgroundImage || ""
  );
  const backgroundImageAlt =
    content?.backgroundImage?.alt || content?.imageAlt || title || "";

  return {
    title,
    description,
    links,
    backgroundImage,
    backgroundImageAlt,
    hasContent: Boolean(title || description || backgroundImage),
  };
}

export function getSplitTextOnlyEditorContent(data, lang = "en") {
  const content = getSplitTextOnlyContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    backgroundImageUrl: content.backgroundImage || "",
    backgroundImageAlt: content.backgroundImageAlt || "",
  };
}

export function wrapSplitTextOnlyContent(content = {}, lang = "en") {
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
        },
      },
    ],
  };
}
