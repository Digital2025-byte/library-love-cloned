import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

export function getLegalInformationHeroContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      patternUrl: "",
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const title = content.title || "";
  const description = content.description || "";
  const patternUrl = content.patternUrl || content.pattern || "";

  return {
    title,
    description,
    links: normalizeBacklinks(content.links),
    patternUrl,
    hasContent: Boolean(title || description),
  };
}

export function getLegalInformationHeroEditorContent(data, lang = "en") {
  const content = getLegalInformationHeroContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    patternUrl: content.patternUrl || "",
  };
}

export function wrapLegalInformationHeroContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          patternUrl: content.patternUrl || "",
        },
      },
    ],
  };
}
