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

export function getGetInTouchContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      label: "",
      phoneDisplay: "",
      phoneHref: "",
      hours: "",
      note: "",
      image: "",
      imageAlt: "",
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (t) => t?.languageCode?.toLowerCase() === normalizedLang
    ) || translations[0];

  const content = matched?.content || {};

  return {
    title: content?.title || "",
    label: content?.label || "",
    phoneDisplay: content?.phone?.display || "",
    phoneHref: content?.phone?.href || "",
    hours: content?.hours || "",
    note: content?.note || "",
    image: content?.image?.fileUrl || "",
    imageAlt: content?.image?.alt || content?.title || "",
    hasContent: Boolean(content?.title || content?.phone?.display),
  };
}

export function getGetInTouchEditorContent(data, lang = "en") {
  const content = getGetInTouchContent(data, lang);
  return {
    title: content.title || "",
    label: content.label || "",
    phoneDisplay: content.phoneDisplay || "",
    phoneHref: content.phoneHref || "",
    hours: content.hours || "",
    note: content.note || "",
    imageUrl: content.image || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapGetInTouchContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          label: content.label || "",
          phone: {
            display: content.phoneDisplay || "",
            href: content.phoneHref || "",
          },
          hours: content.hours || "",
          note: content.note || "",
          image: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || content.title || "",
          },
        },
      },
    ],
  };
}
