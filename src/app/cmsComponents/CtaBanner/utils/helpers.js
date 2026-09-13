export function toCssUrl(url = "") {
  return String(url)
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

export function getCtaBannerHref({ ctaHref, ctaSlug, posParams, lang }) {
  if (ctaHref) {
    return ctaHref;
  }
  if (!ctaSlug) {
    return "#";
  }
  const segments = [posParams, lang, ctaSlug].filter(Boolean);
  return `/${segments.join("/")}`;
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

export function getCtaBannerContent(data, lang = "en", posParams) {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      ctaLabel: "",
      ctaHref: "#",
      backgroundImage: "",
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
  const description = content?.description || "";
  const ctaLabel = content?.ctaButton?.content || content?.ctaButton?.label || "";
  const ctaSlug = content?.ctaButton?.slug || "";
  const ctaHrefRaw = content?.ctaButton?.href || "";
  const backgroundImage = content?.backgroundImage?.fileUrl || "";
  const imageAlt =
    content?.backgroundImage?.alt || content?.imageAlt || title || "";
  const safeBackgroundImage =
    typeof backgroundImage === "string"
      ? toCssUrl(backgroundImage)
      : backgroundImage;

  return {
    title,
    description,
    ctaLabel,
    ctaHref: getCtaBannerHref({
      ctaHref: ctaHrefRaw,
      ctaSlug,
      posParams,
      lang,
    }),
    backgroundImage: safeBackgroundImage,
    imageAlt,
    hasContent: Boolean(title || description || ctaLabel || backgroundImage),
  };
}

export function getCtaBannerEditorContent(data, lang = "en", posParams) {
  const content = getCtaBannerContent(data, lang, posParams);
  return {
    title: content.title || "",
    description: content.description || "",
    buttonLabel: content.ctaLabel || "",
    buttonHref: content.ctaHref === "#" ? "" : content.ctaHref || "",
    buttonLinkType: "internal",
    imageUrl: content.backgroundImage || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapCtaBannerContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          imageAlt: content.imageAlt || "",
          ctaButton: {
            content: content.buttonLabel || "",
            label: content.buttonLabel || "",
            href: content.buttonHref || "",
            slug: content.buttonHref || "",
          },
          backgroundImage: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || content.title || "",
          },
        },
      },
    ],
  };
}
