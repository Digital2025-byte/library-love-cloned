import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function getFileUrl(image) {
  if (!image) {
    return "";
  }
  if (typeof image === "string") {
    return image;
  }
  return image.fileUrl || image.url || image.src || "";
}

function resolveCtaHref({ href, slug, posParams, lang }) {
  if (href && String(href).startsWith("/")) {
    return href;
  }

  const path = href || slug;
  if (!path) {
    return "";
  }

  const segments = [posParams, lang, String(path).replace(/^\//, "")].filter(
    Boolean
  );
  return `/${segments.join("/")}`;
}

export function getFullHeightHeaderWithTextContent(
  data,
  lang = "en",
  posParams = "gb"
) {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      buttonText: "",
      ctaHref: "",
      backgroundImage: "",
      imageAlt: "",
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
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);
  const buttonText =
    content?.ctaButton?.content ||
    content?.ctaButton?.label ||
    content?.buttonText ||
    "";
  const ctaHref = resolveCtaHref({
    href: content?.ctaButton?.href,
    slug: content?.ctaButton?.slug || content?.ctaSlug,
    posParams,
    lang,
  });
  const backgroundImage = getFileUrl(
    content?.backgroundImage || content?.image
  );
  const imageAlt =
    content?.backgroundImage?.alt || content?.imageAlt || title || "";

  return {
    title,
    description,
    links,
    buttonText,
    ctaHref,
    backgroundImage,
    imageAlt,
    hasContent: Boolean(title || description || buttonText || backgroundImage),
  };
}

export function getFullHeightHeaderWithTextEditorContent(
  data,
  lang = "en",
  posParams = "gb"
) {
  const content = getFullHeightHeaderWithTextContent(data, lang, posParams);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    buttonLabel: content.buttonText || "",
    buttonHref: content.ctaHref || "",
    buttonLinkType: "internal",
    imageUrl: content.backgroundImage || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapFullHeightHeaderWithTextContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          buttonText: content.buttonLabel || "",
          imageAlt: content.imageAlt || "",
          ctaButton: {
            content: content.buttonLabel || "",
            label: content.buttonLabel || "",
            href: content.buttonHref || "",
            slug: content.buttonHref || "",
          },
          backgroundImage: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || content.title || "",
          },
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
