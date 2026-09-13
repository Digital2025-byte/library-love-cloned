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

export function getTwoColumnIntroContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      ctaButton: "",
      ctaHref: "",
      mainImage: "",
      mainImageAlt: "Main illustration",
      overlayImage: "",
      overlayImageAlt: "Overlay illustration",
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
  const style = data?.style || {};
  const title = content?.title || "";
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);
  const mainImage = getImageSrc(
    content?.illustrationImages?.mainImage?.fileUrl ||
      content?.illustrationImages?.mainImage?.url
  );
  const overlayImage = getImageSrc(
    content?.illustrationImages?.overlayImage?.fileUrl ||
      content?.illustrationImages?.overlayImage?.url
  );

  return {
    title,
    description,
    links,
    ctaButton:
      content?.ctaButton?.content || content?.ctaButton?.label || "",
    ctaHref: content?.ctaButton?.href || style?.ctaButton?.slug || "",
    mainImage,
    mainImageAlt:
      content?.illustrationImages?.mainImage?.alt ||
      title ||
      "Main illustration",
    overlayImage,
    overlayImageAlt:
      content?.illustrationImages?.overlayImage?.alt ||
      title ||
      "Overlay illustration",
    hasContent: Boolean(title || description || mainImage || overlayImage),
  };
}

export function getTwoColumnIntroEditorContent(data, lang = "en") {
  const content = getTwoColumnIntroContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    ctaLabel: content.ctaButton || "",
    ctaHref: content.ctaHref || "",
    ctaLinkType: "internal",
    mainImageUrl: content.mainImage || "",
    mainImageAlt: content.mainImageAlt || "",
    overlayImageUrl: content.overlayImage || "",
    overlayImageAlt: content.overlayImageAlt || "",
  };
}

export function wrapTwoColumnIntroContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          ctaButton: {
            label: content.ctaLabel || "",
            href: content.ctaHref || "",
          },
          illustrationImages: {
            mainImage: {
              fileUrl: content.mainImageUrl || "",
              alt: content.mainImageAlt || "",
            },
            overlayImage: {
              fileUrl: content.overlayImageUrl || "",
              alt: content.overlayImageAlt || "",
            },
          },
        },
      },
    ],
  };
}
