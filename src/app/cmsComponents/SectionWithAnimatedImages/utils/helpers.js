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

export function getSectionWithAnimatedImagesContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      preTitle: "",
      title: "",
      links: [],
      buttonText: "",
      buttonLink: "",
      iconType: "Instagram",
      images: [],
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
  const preTitle = content?.preTitle || content?.subtitle || "";
  const title = content?.title || "";
  const buttonText =
    content?.buttonText ||
    content?.ctaButton?.content ||
    content?.ctaButton?.label ||
    "";
  const buttonLink =
    content?.buttonLink ||
    content?.ctaButton?.ctaButtonURL ||
    content?.ctaButton?.href ||
    "";
  const iconType = content?.iconType || content?.ctaButton?.icon || "Instagram";

  const images = Array.isArray(content?.Cards)
    ? content.Cards.map((item) => item?.ImageCard || item)
        .map((img) => ({
          src: getImageSrc(img?.fileUrl || img?.url || img?.src),
          alt: img?.alt || "Travel experience",
        }))
        .filter((img) => img.src)
    : Array.isArray(content?.images)
      ? content.images
          .map((img) => {
            if (typeof img === "string") {
              return { src: getImageSrc(img), alt: "Travel experience" };
            }
            const src = getImageSrc(img?.fileUrl || img?.url || img?.src);
            if (!src) {
              return null;
            }
            return {
              src,
              alt: img?.alt || "Travel experience",
            };
          })
          .filter(Boolean)
      : [];

  return {
    preTitle,
    title,
    links: normalizeBacklinks(content?.links),
    buttonText,
    buttonLink,
    iconType,
    images,
    hasContent: Boolean(preTitle || title || buttonText || images.length),
  };
}

export function getSectionWithAnimatedImagesEditorContent(data, lang = "en") {
  const content = getSectionWithAnimatedImagesContent(data, lang);

  return {
    title: content.title || "",
    description: content.preTitle || "",
    links: toEditorBacklinks(content.links),
    ctaLabel: content.buttonText || "",
    ctaHref: content.buttonLink || "",
    ctaLinkType: "external",
    iconType: content.iconType || "Instagram",
    images: (content.images || []).map((image) => ({
      url: image.src || "",
      alt: image.alt || "",
    })),
  };
}

export function wrapSectionWithAnimatedImagesContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          preTitle: content.description || "",
          links: normalizeBacklinks(content.links),
          buttonText: content.ctaLabel || "",
          buttonLink: content.ctaHref || "",
          iconType: content.iconType || "Instagram",
          Cards: (Array.isArray(content.images) ? content.images : []).map(
            (image) => ({
              ImageCard: {
                fileUrl: image?.url || "",
                alt: image?.alt || "",
              },
            })
          ),
        },
      },
    ],
  };
}
