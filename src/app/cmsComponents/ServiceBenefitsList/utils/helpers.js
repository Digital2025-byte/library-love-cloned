import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

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

export function getServiceBenefitsContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      mainTitle: "",
      backgroundImage: "",
      backgroundImageAlt: "",
      links: [],
      benefits: [],
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
  const mainTitle = content?.mainTitle || content?.title || "";
  const backgroundImage = toImageSrc(
    content?.backgroundImage?.fileUrl || content?.backgroundImage || ""
  );
  const backgroundImageAlt = content?.backgroundImage?.alt || "";
  const benefits = Array.isArray(content?.benefits)
    ? content.benefits.map((benefit) => ({
        title: benefit?.title || "",
        description: benefit?.description || "",
        links: normalizeBacklinks(benefit?.links),
        icon: benefit?.icon || "Star",
      }))
    : [];

  return {
    mainTitle,
    backgroundImage,
    backgroundImageAlt,
    links: normalizeBacklinks(content?.links),
    benefits,
    hasContent: Boolean(mainTitle || benefits.length || backgroundImage),
  };
}

export function getServiceBenefitsEditorContent(data, lang = "en") {
  const content = getServiceBenefitsContent(data, lang);

  return {
    title: content.mainTitle || "",
    backgroundImageUrl: content.backgroundImage || "",
    backgroundImageAlt: content.backgroundImageAlt || "",
    links: toEditorBacklinks(content.links),
    items: content.benefits.map((benefit) => ({
      title: benefit.title || "",
      description: benefit.description || "",
      links: toEditorBacklinks(benefit.links),
      icon: benefit.icon || "Star",
    })),
  };
}

export function wrapServiceBenefitsContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          mainTitle: content.title || "",
          links: normalizeBacklinks(content.links),
          backgroundImage: {
            fileUrl: content.backgroundImageUrl || "",
            alt: content.backgroundImageAlt || "",
          },
          benefits: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              title: item?.title || "",
              description: item?.description || "",
              links: normalizeBacklinks(item?.links),
              icon: item?.icon || "Star",
            })
          ),
        },
      },
    ],
  };
}
