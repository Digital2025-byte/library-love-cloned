import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

/**
 * Escapes spaces and parentheses so a URL is safe inside CSS url().
 */
export function toCssUrl(url = "") {
  return String(url)
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

/**
 * Builds CTA href from CMS slug/href and optional POS routing params.
 */
export function getBannerCtaHref({ ctaHref, ctaSlug, posParams, lang }) {
  if (ctaHref) {
    return ctaHref;
  }

  if (!ctaSlug) {
    return "#";
  }

  const segments = [posParams, lang, ctaSlug].filter(Boolean);
  return `/${segments.join("/")}`;
}

export function getBannerWithCtaContent(data, lang = "en", posParams) {
  const translations = Array.isArray(data?.translations) ? data.translations : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      ctaLabel: "",
      ctaHref: "#",
      backgroundImage: "",
      imageAlt: "",
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
  const title = content?.title || "";
  const description = content?.description || "";
  const links = normalizeBacklinks(content?.links);
  const ctaLabel =
    content?.ctaButton?.content || content?.ctaButton?.label || "";
  const ctaSlug = content?.ctaButton?.slug || "";
  const ctaHrefRaw = content?.ctaButton?.href || "";
  const backgroundImage = content?.backgroundImage?.fileUrl || "";
  const imageAlt =
    content?.backgroundImage?.alt || content?.imageAlt || title || "";
  const safeBackgroundImage =
    typeof backgroundImage === "string" ? toCssUrl(backgroundImage) : backgroundImage;

  return {
    title,
    description,
    links,
    ctaLabel,
    ctaHref: getBannerCtaHref({
      ctaHref: ctaHrefRaw,
      ctaSlug,
      posParams,
      lang,
    }),
    backgroundImage: safeBackgroundImage,
    imageAlt,
    hasContent: Boolean(title || description || ctaLabel || backgroundImage),
  };
}

export function getBannerWithCtaEditorContent(data, lang = "en", posParams) {
  const content = getBannerWithCtaContent(data, lang, posParams);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    buttonLabel: content.ctaLabel || "",
    buttonHref: content.ctaHref === "#" ? "" : content.ctaHref || "",
    buttonLinkType: "internal",
    imageUrl: content.backgroundImage || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapBannerWithCtaContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
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
