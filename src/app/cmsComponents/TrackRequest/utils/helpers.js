export function getTrackRequestContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      subtitle: "",
      caseNumberLabel: "",
      lastNameLabel: "",
      submitLabel: "",
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
    title: content?.title || "",
    subtitle: content?.subtitle || "",
    caseNumberLabel: content?.caseNumberLabel || "",
    lastNameLabel: content?.lastNameLabel || "",
    submitLabel: content?.submitLabel || "",
    hasContent: Boolean(content?.title || content?.submitLabel),
  };
}

export function getTrackRequestEditorContent(data, lang = "en") {
  const content = getTrackRequestContent(data, lang);
  return {
    title: content.title || "",
    subtitle: content.subtitle || "",
    caseNumberLabel: content.caseNumberLabel || "",
    lastNameLabel: content.lastNameLabel || "",
    submitLabel: content.submitLabel || "",
  };
}

export function wrapTrackRequestContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          caseNumberLabel: content.caseNumberLabel || "",
          lastNameLabel: content.lastNameLabel || "",
          submitLabel: content.submitLabel || "",
        },
      },
    ],
  };
}
