export function isUsableImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getPromoBannerContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      ctaLabel: "",
      ctaHref: "#",
      image: "",
      imageAlt: "",
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (t) => t?.languageCode?.toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};

  return {
    title: content?.title || "",
    description: content?.description || "",
    ctaLabel: content?.ctaButton?.content || "",
    ctaHref: content?.ctaButton?.href || "#",
    image: content?.image?.fileUrl || "",
    imageAlt: content?.image?.alt || content?.title || "",
    hasContent: Boolean(content?.title || content?.description),
  };
}

export function getPromoBannerEditorContent(data, lang = "en") {
  const content = getPromoBannerContent(data, lang);
  return {
    title: content.title || "",
    description: content.description || "",
    buttonLabel: content.ctaLabel || "",
    buttonHref: content.ctaHref === "#" ? "" : content.ctaHref || "",
    buttonLinkType: "internal",
    imageUrl: content.image || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapPromoBannerContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          ctaButton: {
            content: content.buttonLabel || "",
            href: content.buttonHref || "",
          },
          image: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || content.title || "",
          },
        },
      },
    ],
  };
}
