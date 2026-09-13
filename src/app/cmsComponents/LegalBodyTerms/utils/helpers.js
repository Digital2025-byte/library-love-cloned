import { DEFAULT_LIMITATION_TITLE } from "./constants";

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

export function isLimitationSection(section, limitationTitle) {
  if (section?.variant === "alert") {
    return true;
  }

  const title = String(section?.title || "").trim().toLowerCase();
  const expected = String(
    limitationTitle || DEFAULT_LIMITATION_TITLE
  )
    .trim()
    .toLowerCase();

  return Boolean(title && title === expected);
}

export function getLegalBodyTermsContent(data, lang = "en") {
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
    acceptance: parsed.acceptance || null,
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    contact: parsed.contact || null,
    contactTitle: parsed.contactTitle || "",
    contactDescription: parsed.contactDescription || "",
    limitationTitle: parsed.limitationTitle || DEFAULT_LIMITATION_TITLE,
    effectiveDateLabel: parsed.effectiveDateLabel || "",
  };

  const hasContent = Boolean(
    content.cover?.effectiveDate ||
      content.acceptance ||
      content.sections.length ||
      content.contact
  );

  return { content, hasContent };
}

export function getLegalBodyTermsEditorContent(data, lang = "en") {
  const { content } = getLegalBodyTermsContent(data, lang);
  const parsed = content || {};

  return {
    effectiveDate: parsed.cover?.effectiveDate || "",
    effectiveDateLabel: parsed.effectiveDateLabel || "",
    coverTitle: parsed.cover?.title || "",
    coverDescription: parsed.cover?.description || "",
    acceptanceTitle: parsed.acceptance?.title || "",
    acceptanceMessage: parsed.acceptance?.message || "",
    limitationTitle: parsed.limitationTitle || "",
    contactTitle: parsed.contactTitle || parsed.contact?.title || "",
    contactDescription:
      parsed.contactDescription || parsed.contact?.description || "",
    company: parsed.contact?.company || "",
    department: parsed.contact?.department || "",
    email: parsed.contact?.email || "",
    phone: parsed.contact?.phone || "",
    address: parsed.contact?.address || "",
    sections: (Array.isArray(parsed.sections) ? parsed.sections : []).map(
      (section) => ({
        title: section?.title || "",
        intro: section?.intro || "",
        variant: section?.variant || "",
        items: (Array.isArray(section?.items) ? section.items : []).map(
          (item) => ({
            title: item?.title || "",
            description: item?.description || "",
          })
        ),
      })
    ),
  };
}

export function wrapLegalBodyTermsContent(content = {}, lang = "en") {
  const body = {
    limitationTitle: content.limitationTitle || "",
    effectiveDateLabel: content.effectiveDateLabel || "",
    cover: {
      title: content.coverTitle || "",
      description: content.coverDescription || "",
      effectiveDate: content.effectiveDate || "",
    },
    acceptance: {
      title: content.acceptanceTitle || "",
      message: content.acceptanceMessage || "",
    },
    sections: (Array.isArray(content.sections) ? content.sections : []).map(
      (section) => ({
        title: section?.title || "",
        intro: section?.intro || "",
        variant: section?.variant || "",
        items: (Array.isArray(section?.items) ? section.items : []).map(
          (item) => ({
            title: item?.title || "",
            description: item?.description || "",
          })
        ),
      })
    ),
    contactTitle: content.contactTitle || "",
    contactDescription: content.contactDescription || "",
    contact: {
      title: content.contactTitle || "",
      description: content.contactDescription || "",
      company: content.company || "",
      department: content.department || "",
      email: content.email || "",
      phone: content.phone || "",
      address: content.address || "",
    },
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
