/**
 * Normalizes phone text that sometimes arrives like "963112158121.0".
 */
export function normalizePhoneText(value) {
  return String(value || "").replace(/\.0+$/, "");
}

/**
 * Builds a tel: href from a display phone number (spaces stripped).
 */
export function getPhoneHref(phoneText) {
  const digits = String(phoneText || "").replace(/\s/g, "");
  return digits ? `tel:+${digits}` : "#";
}

export function getCallUsContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      upperText: "",
      mainText: "",
      bottomText: "",
      phoneHref: "#",
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

  const upperText = content?.["upper-text"] || content?.upperText || "";
  const mainText = content?.["main-text"] || content?.mainText || "";
  const bottomText = content?.["bottom-text"] || content?.bottomText || "";
  const normalizedMainText = normalizePhoneText(mainText);

  return {
    upperText,
    mainText: normalizedMainText,
    bottomText,
    phoneHref: getPhoneHref(normalizedMainText),
    hasContent: Boolean(upperText || normalizedMainText || bottomText),
  };
}

export function getCallUsEditorContent(data, lang = "en") {
  const content = getCallUsContent(data, lang);

  return {
    upperText: content.upperText || "",
    mainText: content.mainText || "",
    bottomText: content.bottomText || "",
  };
}

export function wrapCallUsContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          upperText: content.upperText || "",
          mainText: content.mainText || "",
          bottomText: content.bottomText || "",
        },
      },
    ],
  };
}
