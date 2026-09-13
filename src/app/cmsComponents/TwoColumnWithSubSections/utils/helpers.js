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

function normalizeSubSection(item = {}) {
  return {
    title: item?.title || "",
    description: item?.description || "",
    links: normalizeBacklinks(item?.links),
  };
}

function toEditorSubSection(item = {}) {
  return {
    title: item?.title || "",
    description: item?.description || "",
    links: toEditorBacklinks(item?.links),
  };
}

/** Prefer subSections[]; fall back to legacy first/second fields. */
export function resolveSubSections(content = {}) {
  if (Array.isArray(content.subSections) && content.subSections.length) {
    return content.subSections.map(normalizeSubSection);
  }

  if (Array.isArray(content.items) && content.items.length) {
    return content.items.map(normalizeSubSection);
  }

  const legacy = [content.firstSubSection, content.secondSubSection]
    .filter(Boolean)
    .map(normalizeSubSection);

  return legacy.filter((item) => item.title || item.description);
}

export function getTwoColumnWithSubSectionsContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];
  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const style = data?.style || {};

  const mainImage = toImageSrc(
    content?.illustrationImages?.mainImage?.fileUrl ||
      content?.mainImageUrl ||
      ""
  );
  const overlayImage = toImageSrc(
    content?.illustrationImages?.overlayImage?.fileUrl ||
      content?.overlayImageUrl ||
      ""
  );

  const subSections = resolveSubSections(content);

  return {
    sectionLabel: content?.sectionLabel || "",
    title: content?.title || "",
    description: content?.description || "",
    links: normalizeBacklinks(content?.links),
    mainImage,
    mainImageAlt:
      content?.illustrationImages?.mainImage?.alt ||
      content?.mainImageAlt ||
      content?.title ||
      "Main illustration",
    overlayImage,
    overlayImageAlt:
      content?.illustrationImages?.overlayImage?.alt ||
      content?.overlayImageAlt ||
      content?.title ||
      "Overlay illustration",
    subSections,
    firstSubSection: subSections[0] || normalizeSubSection(),
    secondSubSection: subSections[1] || normalizeSubSection(),
    ctaButton:
      content?.ctaButton?.content ||
      content?.ctaButton?.label ||
      content?.ctaLabel ||
      "",
    ctaHref:
      content?.ctaButton?.href ||
      content?.ctaHref ||
      style?.ctaButton?.slug ||
      "#",
    hasContent: Boolean(
      content?.title || content?.description || mainImage || subSections.length
    ),
  };
}

export function getTwoColumnWithSubSectionsEditorContent(data, lang = "en") {
  const content = getTwoColumnWithSubSectionsContent(data, lang);

  return {
    sectionLabel: content.sectionLabel || "",
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
    items: (content.subSections.length
      ? content.subSections
      : [normalizeSubSection(), normalizeSubSection()]
    ).map(toEditorSubSection),
  };
}

export function wrapTwoColumnWithSubSectionsContent(content = {}, lang = "en") {
  const items = Array.isArray(content.items) ? content.items : [];
  const subSections = items.map(normalizeSubSection);

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          sectionLabel: content.sectionLabel || "",
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          subSections,
          // Legacy keys kept for older consumers
          firstSubSection: subSections[0] || normalizeSubSection(),
          secondSubSection: subSections[1] || normalizeSubSection(),
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
