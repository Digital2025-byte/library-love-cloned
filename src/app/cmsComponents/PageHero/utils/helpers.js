/**
 * Escapes spaces and parentheses so a URL is safe inside CSS url().
 */
export function toCssUrl(url = "") {
  return String(url)
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

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

export function getPageHeroContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      subtitle: "",
      image: "",
      imageAlt: "",
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (translation) =>
        translation?.languageCode?.toLowerCase() === normalizedLang
    ) || translations[0];

  const content = matched?.content || {};
  const title = content?.title || "";
  const subtitle = content?.subtitle || "";
  const image = content?.image?.fileUrl || "";
  const mask = content?.image?.mask || "";
  const imageAlt = content?.image?.alt || content?.imageAlt || title || "";

  return {
    title,
    subtitle,
    image,
    mask,
    imageAlt,
    hasContent: Boolean(title || subtitle),
  };
}

export function getPageHeroEditorContent(data, lang = "en") {
  const content = getPageHeroContent(data, lang);
  return {
    title: content.title || "",
    subtitle: content.subtitle || "",
    imageUrl: content.image || "",
    imageMask: content.mask || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapPageHeroContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          image: {
            fileUrl: content.imageUrl || "",
            mask: content.imageMask || "",
            alt: content.imageAlt || content.title || "",
          },
        },
      },
    ],
  };
}
