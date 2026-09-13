import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

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

function normalizeImageItem(item) {
  if (!item) return null;

  const fileUrl = String(
    item.fileUrl || item.imageUrl || item.url || item.src || ""
  ).trim();
  const title = item.title || "";
  const alt = item.alt || item.imageAlt || title || "Destination image";

  return {
    fileUrl,
    title,
    alt,
  };
}

function mapRowItems(items, nestedKey) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => normalizeImageItem(item?.[nestedKey] || item))
    .filter(Boolean);
}

export function getOppositeScrollCarouselContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      exploreLabel: "",
      exploreHref: "#",
      topRow: [],
      bottomRow: [],
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
  const title = content?.carouselTitle || content?.title || "";
  const description =
    content?.carouselDescription || content?.description || "";
  const exploreLabel = content?.exploreLabel || content?.ctaLabel || "Explore";
  const exploreHref =
    content?.exploreHref || content?.ctaHref || content?.exploreLink || "#";

  const topRow = mapRowItems(content?.itemsLeftToRight, "imagesLeftToRight");
  const bottomRow = mapRowItems(
    content?.itemsRightToLeft,
    "imagesRightToLeft"
  );

  return {
    title,
    description,
    links: normalizeBacklinks(content?.links),
    exploreLabel,
    exploreHref,
    topRow,
    bottomRow,
    hasContent: Boolean(
      title || description || topRow.length || bottomRow.length
    ),
  };
}

function toEditorRow(items = []) {
  return items.map((item) => ({
    title: item.title || "",
    imageUrl: item.fileUrl || "",
    imageAlt: item.alt || item.title || "",
  }));
}

function toCmsRow(items = [], nestedKey) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    [nestedKey]: {
      fileUrl: item?.imageUrl || "",
      title: item?.title || "",
      alt: item?.imageAlt || item?.title || "Destination image",
    },
  }));
}

export function getOppositeScrollEditorContent(data, lang = "en") {
  const parsed = getOppositeScrollCarouselContent(data, lang);

  return {
    title: parsed.title,
    description: parsed.description,
    links: toEditorBacklinks(parsed.links),
    buttonLabel: parsed.exploreLabel,
    buttonHref: parsed.exploreHref || "#",
    buttonLinkType: "internal",
    topRow: toEditorRow(parsed.topRow),
    bottomRow: toEditorRow(parsed.bottomRow),
  };
}

export function wrapOppositeScrollContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          carouselTitle: content.title || "",
          carouselDescription: content.description || "",
          links: normalizeBacklinks(content.links),
          exploreLabel: content.buttonLabel || "",
          exploreHref: content.buttonHref || "#",
          itemsLeftToRight: toCmsRow(content.topRow, "imagesLeftToRight"),
          itemsRightToLeft: toCmsRow(content.bottomRow, "imagesRightToLeft"),
        },
      },
    ],
  };
}
