import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

/**
 * Resolves an image value that may be a string URL or a Next.js static import.
 */
export function getImageUrl(img) {
  if (!img) return "";
  if (typeof img === "string") return img.trim();
  if (img?.src) return String(img.src).trim();
  if (img?.default) return getImageUrl(img.default);
  if (img?.fileUrl || img?.fileURL) return getImageUrl(img.fileUrl || img.fileURL);
  return "";
}

export function isUsableImageSrc(src) {
  const value = getImageUrl(src);
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

/**
 * Splits a title around a highlight phrase (e.g. "Travel Experience").
 */
export function splitTitle(title = "", highlightPhrase = "") {
  if (!title) {
    return { firstPart: "", highlightPart: "", restPart: "" };
  }

  if (!highlightPhrase || !title.includes(highlightPhrase)) {
    return { firstPart: title, highlightPart: "", restPart: "" };
  }

  const [firstPart = "", ...rest] = title.split(highlightPhrase);

  return {
    firstPart,
    highlightPart: highlightPhrase,
    restPart: rest.join(highlightPhrase),
  };
}

export function getVerticalImageSliceContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations) ? data.translations : [];

  if (!translations.length) {
    return {
      title: "",
      highlightPhrase: "",
      firstPart: "",
      highlightPart: "",
      restPart: "",
      description: "",
      links: [],
      imageSrc: "",
      imageAlt: "Travel experience",
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
  const title = content?.title || "";
  const highlightPhrase =
    content?.highlightPhrase || content?.highlight || "Travel Experience";
  const { firstPart, highlightPart, restPart } = splitTitle(
    title,
    highlightPhrase
  );
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);

  const sliceImage = content?.SliceImage ?? content?.sliceImage ?? null;
  const legacyImage = content?.image ?? null;
  const imageAsset = sliceImage || legacyImage;
  const imageUrl = imageAsset?.fileUrl ?? imageAsset?.fileURL;
  const imageSrc = getImageUrl(imageUrl);

  return {
    title,
    highlightPhrase,
    firstPart,
    highlightPart,
    restPart,
    description,
    links,
    imageSrc,
    imageAlt:
      imageAsset?.alt || legacyImage?.alt || title || "Travel experience",
    hasContent: Boolean(title || description || imageSrc),
  };
}

export function getVerticalImageSliceEditorContent(data, lang = "en") {
  const content = getVerticalImageSliceContent(data, lang);

  return {
    title: content.title || "",
    highlightPhrase: content.highlightPhrase || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    imageUrl: content.imageSrc || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapVerticalImageSliceContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          highlightPhrase: content.highlightPhrase || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          SliceImage: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || "",
          },
        },
      },
    ],
  };
}
