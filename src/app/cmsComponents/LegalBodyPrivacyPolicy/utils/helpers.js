function parseBody(body) {
  if (!body) {
    return null;
  }

  if (typeof body === "object") {
    return body;
  }

  if (typeof body !== "string") {
    return null;
  }

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export function getLegalBodyPrivacyPolicyContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { content: null, hasContent: false };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const parsed = parseBody(matched?.content?.body);
  if (!parsed) {
    return { content: null, hasContent: false };
  }

  const content = {
    cover: parsed.cover || null,
    effectiveDate: parsed.effectiveDate || parsed.cover?.effectiveDate || "",
    introduction: parsed.introduction || null,
    summaryPoints: Array.isArray(parsed.summaryPoints)
      ? parsed.summaryPoints
      : [],
    sections: parsed.sections || null,
    tocTitle: parsed.tocTitle || "",
    infoCollectedLabel: parsed.infoCollectedLabel || "",
    shareSituationsLabel: parsed.shareSituationsLabel || "",
  };

  return {
    content,
    hasContent: Boolean(
      content.effectiveDate ||
        content.introduction ||
        content.summaryPoints.length ||
        content.sections
    ),
  };
}

export function getLegalBodyPrivacyPolicyEditorContent(data, lang = "en") {
  const { content } = getLegalBodyPrivacyPolicyContent(data, lang);
  const parsed = content || {};

  return {
    effectiveDate: parsed.effectiveDate || "",
    introTitle: parsed.introduction?.title || "",
    introContent: parsed.introduction?.content || "",
    tocTitle: parsed.tocTitle || "",
    infoCollectedLabel: parsed.infoCollectedLabel || "",
    shareSituationsLabel: parsed.shareSituationsLabel || "",
    summaryPoints: (Array.isArray(parsed.summaryPoints)
      ? parsed.summaryPoints
      : []
    ).map((item) => ({
      question: item?.question || "",
      answer: item?.answer || "",
    })),
    sections: parsed.sections || {},
  };
}

export function wrapLegalBodyPrivacyPolicyContent(content = {}, lang = "en") {
  const body = {
    cover: {
      title: content.introTitle || "",
      description: content.introContent || "",
    },
    effectiveDate: content.effectiveDate || "",
    introduction: {
      title: content.introTitle || "",
      content: content.introContent || "",
    },
    tocTitle: content.tocTitle || "",
    infoCollectedLabel: content.infoCollectedLabel || "",
    shareSituationsLabel: content.shareSituationsLabel || "",
    summaryPoints: (Array.isArray(content.summaryPoints)
      ? content.summaryPoints
      : []
    ).map((item) => ({
      question: item?.question || "",
      answer: item?.answer || "",
    })),
    sections: content.sections || {},
  };

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          body: JSON.stringify(body),
        },
      },
    ],
  };
}
