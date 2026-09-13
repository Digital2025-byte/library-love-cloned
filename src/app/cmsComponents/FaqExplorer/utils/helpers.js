function normalizeQuestion(q) {
  return { question: q?.question || "", answer: q?.answer || "" };
}

function normalizeCategory(cat) {
  return {
    label: cat?.label || "",
    questions: Array.isArray(cat?.questions)
      ? cat.questions.map(normalizeQuestion).filter((q) => q.question)
      : [],
  };
}

export function getFaqExplorerContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      browseLabel: "",
      browseHref: "#",
      categories: [],
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawCategories = Array.isArray(content.categories)
    ? content.categories
    : [];
  const categories = rawCategories
    .map(normalizeCategory)
    .filter((cat) => cat.questions.length);

  return {
    title: content?.title || "",
    browseLabel: content?.browseButton?.content || "",
    browseHref: content?.browseButton?.href || "#",
    categories,
    hasContent: categories.length > 0,
  };
}

export function getFaqExplorerEditorContent(data, lang = "en") {
  const { title, browseLabel, browseHref, categories } = getFaqExplorerContent(
    data,
    lang
  );
  return {
    title: title || "",
    browseLabel: browseLabel || "",
    browseHref: browseHref === "#" ? "" : browseHref || "",
    browseLinkType: "internal",
    categories: categories.map((cat) => ({
      label: cat.label || "",
      questions: cat.questions.map((q) => ({ ...q })),
    })),
  };
}

export function wrapFaqExplorerContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          browseButton: {
            content: content.browseLabel || "",
            href: content.browseHref || "",
          },
          categories: (Array.isArray(content.categories)
            ? content.categories
            : []
          ).map((cat) => ({
            label: cat?.label || "",
            questions: (Array.isArray(cat?.questions) ? cat.questions : []).map(
              normalizeQuestion
            ),
          })),
        },
      },
    ],
  };
}
