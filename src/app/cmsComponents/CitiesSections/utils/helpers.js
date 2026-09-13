import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function getFileUrl(file) {
  if (!file) {
    return "";
  }
  if (typeof file === "string") {
    return file;
  }
  return (
    file?.fileUrl ||
    file?.FileUrl ||
    file?.url ||
    file?.src ||
    ""
  );
}

export function getCitiesSectionsContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      template: "right",
      image1: "",
      image2: "",
      isCTA: false,
      slug: "",
      ctaLabel: "",
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

  // Support nested CMS Translations array when present
  const nestedTranslations = Array.isArray(content?.Translations)
    ? content.Translations
    : Array.isArray(content?.translations)
      ? content.translations
      : [];
  const nested =
    nestedTranslations.find(
      (item) =>
        String(item?.LanguageCode || item?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || nestedTranslations[0] || {};

  const title =
    nested?.Title || nested?.title || content?.title || "";
  const description =
    nested?.Description || nested?.description || content?.description || "";
  const template =
    nested?.template || content?.template || "left";

  const files = content?.files || content?.images || [];
  const image1 = getFileUrl(files[0]);
  const image2 = getFileUrl(files[1]);

  const isCTA = Boolean(content?.isCTA);
  const slug = content?.slug || content?.ctaHref || "";
  const ctaLabel =
    content?.ctaLabel ||
    (lang === "ar" ? "اكتشف المزيد" : "Explore more");
  const ctaHref = content?.ctaHref || "";

  return {
    title,
    description,
    links: normalizeBacklinks(content?.links),
    template: template === "left" ? "left" : "right",
    image1,
    image2,
    isCTA,
    slug,
    ctaLabel,
    ctaHref,
    hasContent: Boolean(title || description || image1 || image2),
  };
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

export function getCitiesSectionsEditorContent(data, lang = "en") {
  const content = getCitiesSectionsContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    ctaLabel: content.ctaLabel || "",
    ctaHref: content.ctaHref || content.slug || "",
    ctaLinkType: "internal",
    image1Url: content.image1 || "",
    image1Alt: content.title || "",
    image2Url: content.image2 || "",
    image2Alt: content.title || "",
  };
}

export function wrapCitiesSectionsContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          isCTA: Boolean(content.ctaLabel),
          ctaLabel: content.ctaLabel || "",
          ctaHref: content.ctaHref || "",
          slug: content.ctaHref || "",
          files: [
            { fileUrl: content.image1Url || "", alt: content.image1Alt || "" },
            { fileUrl: content.image2Url || "", alt: content.image2Alt || "" },
          ],
        },
      },
    ],
  };
}
