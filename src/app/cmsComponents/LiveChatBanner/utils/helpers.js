export function getLiveChatBannerHref({ href, slug, posParams, lang }) {
  if (href) {
    return href;
  }
  if (!slug) {
    return "#";
  }
  const segments = [posParams, lang, slug].filter(Boolean);
  return `/${segments.join("/")}`;
}

export function getLiveChatBannerContent(data, lang = "en", posParams) {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      ctaLabel: "",
      ctaHref: "#",
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (t) => t?.languageCode?.toLowerCase() === normalizedLang
    ) || translations[0];

  const content = matched?.content || {};
  const title = content?.title || "";
  const description = content?.description || "";
  const ctaLabel = content?.ctaButton?.content || content?.ctaButton?.label || "";
  const ctaSlug = content?.ctaButton?.slug || "";
  const ctaHrefRaw = content?.ctaButton?.href || "";

  return {
    title,
    description,
    ctaLabel,
    ctaHref: getLiveChatBannerHref({
      href: ctaHrefRaw,
      slug: ctaSlug,
      posParams,
      lang,
    }),
    hasContent: Boolean(title || description || ctaLabel),
  };
}

export function getLiveChatBannerEditorContent(data, lang = "en", posParams) {
  const content = getLiveChatBannerContent(data, lang, posParams);
  return {
    title: content.title || "",
    description: content.description || "",
    buttonLabel: content.ctaLabel || "",
    buttonHref: content.ctaHref === "#" ? "" : content.ctaHref || "",
    buttonLinkType: "internal",
  };
}

export function wrapLiveChatBannerContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          ctaButton: {
            content: content.buttonLabel || "",
            label: content.buttonLabel || "",
            href: content.buttonHref || "",
            slug: content.buttonHref || "",
          },
        },
      },
    ],
  };
}
