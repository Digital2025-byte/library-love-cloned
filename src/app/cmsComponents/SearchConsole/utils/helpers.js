function normalizePopularItem(item) {
  if (typeof item === "string") {
    return { label: item };
  }
  return { label: item?.label || item?.query || "" };
}

export function getSearchConsoleContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      label: "",
      placeholder: "",
      submitLabel: "",
      popularLabel: "",
      popularItems: [],
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawItems = Array.isArray(content.popularItems)
    ? content.popularItems
    : [];
  const popularItems = rawItems
    .map(normalizePopularItem)
    .filter((item) => item.label);

  return {
    label: content?.label || "",
    placeholder: content?.placeholder || "",
    submitLabel: content?.submitLabel || "",
    popularLabel: content?.popularLabel || "",
    popularItems,
    hasContent: Boolean(content?.label || content?.placeholder),
  };
}

export function getSearchConsoleEditorContent(data, lang = "en") {
  const content = getSearchConsoleContent(data, lang);
  return {
    label: content.label || "",
    placeholder: content.placeholder || "",
    submitLabel: content.submitLabel || "",
    popularLabel: content.popularLabel || "",
    popularItems: content.popularItems.map((item) => ({
      label: item.label || "",
    })),
  };
}

export function wrapSearchConsoleContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          label: content.label || "",
          placeholder: content.placeholder || "",
          submitLabel: content.submitLabel || "",
          popularLabel: content.popularLabel || "",
          popularItems: (Array.isArray(content.popularItems)
            ? content.popularItems
            : []
          ).map((item) => ({ label: item?.label || "" })),
        },
      },
    ],
  };
}
