import { PANEL_COUNT, RING_COPIES } from "./constants";
import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function resolveImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image.url === "string") return image.url;
  if (image.url?.src) return image.url.src;
  if (image.src) return image.src;
  if (image.fileUrl) return image.fileUrl;
  return "";
}

function pickTranslation(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];
  const normalized = String(lang || "").toLowerCase();
  return (
    translations.find(
      (item) =>
        String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0]
  );
}

function toItems(images, captions) {
  return images.map((imageUrl, index) => ({
    imageUrl,
    caption: captions[index] || "",
    imageAlt: captions[index] || "",
  }));
}

function collapseRepeatingItems(items) {
  const n = items.length;
  if (n <= PANEL_COUNT) return items;

  for (let period = 1; period <= n / 2; period += 1) {
    if (n % period !== 0) continue;
    const copies = n / period;
    if (copies < 2) continue;

    const repeats = items.every((item, index) => {
      const source = items[index % period];
      return (
        item.imageUrl === source.imageUrl &&
        (item.caption || "") === (source.caption || "")
      );
    });

    if (repeats) {
      return items.slice(0, period);
    }
  }

  return items;
}

/**
 * Normalize CMS / demo payload for OnBoardImageRing.
 */
export function getOnBoardImageRingContent(data, lang = "en") {
  const content = pickTranslation(data, lang)?.content;

  if (!content) {
    return {
      title: "",
      description: "",
      links: [],
      images: [],
      captions: [],
      hasContent: false,
    };
  }

  const pages = Array.isArray(content.pages) ? content.pages : [];
  const editorItems = Array.isArray(content.items) ? content.items : [];

  let images = [];
  let captions = [];

  if (editorItems.length > 0) {
    images = editorItems.map((item) => resolveImageUrl(item?.imageUrl));
    captions = editorItems.map((item) => item?.caption || item?.title || "");
  } else if (pages.length > 0) {
    images = pages.map((page) => resolveImageUrl(page?.CardImage));
    captions = pages.map((page) => page?.title || "");
  } else {
    images = (content.images || []).map((img) => resolveImageUrl(img));
    captions = Array.isArray(content.captions) ? content.captions : [];
  }

  const items = images
    .map((imageUrl, index) => ({
      imageUrl,
      caption: captions[index] || "",
    }))
    .filter((item) => item.imageUrl || item.caption);

  return {
    title: content.title || "",
    description: content.description || "",
    links: normalizeBacklinks(content.links),
    images: items.map((item) => item.imageUrl),
    captions: items.map((item) => item.caption),
    hasContent: Boolean(
      content.title || content.description || items.length
    ),
  };
}

export function getOnBoardImageRingEditorContent(data, lang = "en") {
  const { title, description, links, images, captions } =
    getOnBoardImageRingContent(data, lang);
  const items = collapseRepeatingItems(toItems(images, captions));

  return {
    title,
    description,
    links: toEditorBacklinks(links),
    items,
  };
}

export function wrapOnBoardImageRingContent(content = {}, lang = "en") {
  const unique = (Array.isArray(content.items) ? content.items : []).map(
    (item) => ({
      imageUrl: item?.imageUrl || "",
      caption: item?.caption || item?.title || "",
      imageAlt: item?.imageAlt || item?.caption || "",
    })
  );
  const copies = unique.length > 0 && unique.length < 8 ? RING_COPIES : 1;
  const total = Math.max(unique.length * copies, 0);
  const images = Array.from(
    { length: total },
    (_, index) => unique[index % unique.length]?.imageUrl || ""
  );
  const captions = Array.from(
    { length: total },
    (_, index) => unique[index % unique.length]?.caption || ""
  );

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          images,
          captions,
        },
      },
    ],
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
