export function getFormHeaderContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      subtitle: "",
      ctaLabel: "",
      headerImageSrc: "",
      promoImageSrc: "",
      promoHref: "",
      promoAlt: "",
      isTransportationSurvey: false,
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};

  return {
    title: content.title || "",
    subtitle: content.subtitle || "",
    ctaLabel: content.ctaLabel || "",
    headerImageSrc: content.headerImageSrc || "",
    promoImageSrc: content.promoImageSrc || "",
    promoHref: content.promoHref || "",
    promoAlt: content.promoAlt || "",
    isTransportationSurvey: Boolean(content.isTransportationSurvey),
    hasContent: Boolean(content.title || content.headerImageSrc),
  };
}

export function getFormHeaderEditorContent(data, lang = "en") {
  const content = getFormHeaderContent(data, lang);

  return {
    title: content.title || "",
    subtitle: content.subtitle || "",
    ctaLabel: content.ctaLabel || "",
    headerImageSrc: content.headerImageSrc || "",
    promoImageSrc: content.promoImageSrc || "",
    promoHref: content.promoHref || "",
    promoAlt: content.promoAlt || "",
    promoLinkType: "external",
    isTransportationSurvey: Boolean(content.isTransportationSurvey),
  };
}

export function wrapFormHeaderContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          ctaLabel: content.ctaLabel || "",
          headerImageSrc: content.headerImageSrc || "",
          promoImageSrc: content.promoImageSrc || "",
          promoHref: content.promoHref || "",
          promoAlt: content.promoAlt || "",
          isTransportationSurvey: Boolean(content.isTransportationSurvey),
        },
      },
    ],
  };
}
