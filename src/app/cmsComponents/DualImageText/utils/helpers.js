import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

/** Preset corners (still supported as string shortcuts). */
export const EXTRA_IMAGE_POSITIONS = {
  "bottom-start": { bottom: 0, start: 0 },
  "bottom-end": { bottom: 0, end: 0 },
  "top-start": { top: 0, start: 0 },
  "top-end": { top: 0, end: 0 },
};

export const DEFAULT_EXTRA_IMAGE_POSITION = {
  bottom: 0,
  start: 0,
};

function toCssLength(value) {
  if (value == null || value === "") return undefined;
  if (typeof value === "number") return `${value}px`;
  return String(value);
}

/**
 * Normalizes a position (preset string or value object) into overlay CSS only.
 * Never affects the main image size — offsets apply to the absolute overlay.
 *
 * Value object keys (all optional):
 * - top, right, bottom, left — physical sides (number → px, or CSS string)
 * - start, end — logical inline sides (RTL-aware)
 * - horizontal | x — extra translateX shift (does not change overlay or main width)
 * - width, maxWidth — overlay size only (default width 52%)
 */
export function resolveExtraImagePosition(position) {
  let raw;
  if (typeof position === "string") {
    raw = {
      ...(EXTRA_IMAGE_POSITIONS[position] || DEFAULT_EXTRA_IMAGE_POSITION),
    };
  } else if (position && typeof position === "object") {
    raw = position;
  } else {
    raw = DEFAULT_EXTRA_IMAGE_POSITION;
  }

  const horizontal = raw.horizontal ?? raw.x;
  const horizontalCss = toCssLength(horizontal);

  const overlayStyle = {
    top: toCssLength(raw.top),
    right: toCssLength(raw.right),
    bottom: toCssLength(raw.bottom),
    left: toCssLength(raw.left),
    insetInlineStart: toCssLength(raw.start),
    insetInlineEnd: toCssLength(raw.end),
    width: toCssLength(raw.width) || "52%",
    maxWidth: toCssLength(raw.maxWidth) || "320px",
    ...(horizontalCss
      ? { transform: `translateX(${horizontalCss})` }
      : {}),
  };

  Object.keys(overlayStyle).forEach((key) => {
    if (overlayStyle[key] === undefined) {
      delete overlayStyle[key];
    }
  });

  return { overlayStyle };
}

function normalizeItem(rawItem) {
  const item = rawItem?.item || rawItem || {};
  const image = item?.image || {};
  const cta = item?.ctaButton || item?.cta || {};

  const descriptions = Array.isArray(item?.descriptions)
    ? item.descriptions.filter(Boolean)
    : [item?.description, item?.descriptionTwo].filter(Boolean);

  return {
    title: item?.title || "",
    description: descriptions[0] || "",
    descriptions,
    links: normalizeBacklinks(item?.links),
    imageUrl: getImageSrc(image?.fileUrl || image?.url || image?.src),
    imageAlt: image?.alt || item?.title || "Section image",
    buttonText: cta?.label || cta?.content || item?.buttonText || "",
    ctaHref: cta?.href || cta?.slug || item?.ctaHref || "",
  };
}

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

export function imageSrc(url) {
  const value = getImageSrc(url);
  if (!value) return "";
  return value.startsWith("http") ? encodeURI(value) : value;
}

export function getDualImageTextContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      links: [],
      items: [],
      firstSection: null,
      exploreButtonLabel: "",
      exploreButtonHref: "",
      extraImageUrl: "",
      extraImageAlt: "",
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
  const rawItems = Array.isArray(content?.items) ? content.items : [];
  const items = rawItems
    .map(normalizeItem)
    .filter((item) => item.title || item.imageUrl || item.description);

  const exploreCta = content?.exploreButton || content?.ctaButton || {};
  const extraImage = content?.extraImage || {};
  const firstSectionRaw = content?.firstSection || null;
  const firstSection = firstSectionRaw ? normalizeItem(firstSectionRaw) : null;
  const hasFirstSection = Boolean(
    firstSection &&
      (firstSection.title || firstSection.imageUrl || firstSection.description)
  );

  return {
    links: normalizeBacklinks(content?.links),
    items,
    firstSection: hasFirstSection ? firstSection : null,
    exploreButtonLabel:
      exploreCta?.label || exploreCta?.content || "Explore more",
    exploreButtonHref: exploreCta?.href || exploreCta?.slug || "explore",
    extraImageUrl: getImageSrc(
      extraImage?.fileUrl || extraImage?.url || extraImage?.src
    ),
    extraImageAlt: extraImage?.alt || "",
    hasContent: items.length > 0 || hasFirstSection,
  };
}

export function getDualImageTextEditorContent(data, lang = "en") {
  const content = getDualImageTextContent(data, lang);
  const first = content.firstSection || {};

  return {
    links: toEditorBacklinks(content.links),
    firstSectionTitle: first.title || "",
    firstSectionDescription: first.description || first.descriptions?.[0] || "",
    firstSectionLinks: toEditorBacklinks(first.links),
    firstSectionImageUrl: first.imageUrl || "",
    firstSectionImageAlt: first.imageAlt || "",
    exploreLabel: content.exploreButtonLabel || "",
    exploreHref: content.exploreButtonHref || "",
    exploreLinkType: "internal",
    extraImageUrl: content.extraImageUrl || "",
    extraImageAlt: content.extraImageAlt || "",
    items: (content.items || []).map((item) => ({
      title: item.title || "",
      description: item.description || item.descriptions?.[0] || "",
      links: toEditorBacklinks(item.links),
      imageUrl: item.imageUrl || "",
      imageAlt: item.imageAlt || "",
      buttonLabel: item.buttonText || "",
      buttonHref: item.ctaHref || "",
      buttonLinkType: "internal",
    })),
  };
}

export function wrapDualImageTextContent(content = {}, lang = "en") {
  const firstHasContent = Boolean(
    content.firstSectionTitle ||
      content.firstSectionDescription ||
      content.firstSectionImageUrl
  );

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          links: normalizeBacklinks(content.links),
          exploreButton: {
            label: content.exploreLabel || "",
            href: content.exploreHref || "",
          },
          extraImage: {
            fileUrl: content.extraImageUrl || "",
            alt: content.extraImageAlt || "",
          },
          firstSection: firstHasContent
            ? {
                title: content.firstSectionTitle || "",
                description: content.firstSectionDescription || "",
                links: normalizeBacklinks(content.firstSectionLinks),
                image: {
                  fileUrl: content.firstSectionImageUrl || "",
                  alt: content.firstSectionImageAlt || "",
                },
              }
            : null,
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              item: {
                title: item?.title || "",
                description: item?.description || "",
                links: normalizeBacklinks(item?.links),
                image: {
                  fileUrl: item?.imageUrl || "",
                  alt: item?.imageAlt || "",
                },
                ctaButton: {
                  label: item?.buttonLabel || "",
                  href: item?.buttonHref || "",
                },
              },
            })
          ),
        },
      },
    ],
  };
}
