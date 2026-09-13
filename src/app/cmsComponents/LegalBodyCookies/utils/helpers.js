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

export function getLegalBodyCookiesContent(data, lang = "en") {
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
    introduction: parsed.introduction || null,
    typesTitle: parsed.typesTitle || "",
    types: Array.isArray(parsed.types) ? parsed.types : [],
    thirdParty: parsed.thirdParty || null,
    preferences: parsed.preferences || null,
    lifespan: parsed.lifespan || null,
    updates: parsed.updates || null,
    contact: parsed.contact || null,
  };

  const hasContent = Boolean(
    content.cover?.effectiveDate ||
      content.introduction ||
      content.types.length ||
      content.thirdParty ||
      content.preferences ||
      content.lifespan ||
      content.updates ||
      content.contact
  );

  return { content, hasContent };
}

export function getLegalBodyCookiesEditorContent(data, lang = "en") {
  const { content } = getLegalBodyCookiesContent(data, lang);
  const parsed = content || {};

  return {
    effectiveDate: parsed.cover?.effectiveDate || "",
    coverTitle: parsed.cover?.title || "",
    coverDescription: parsed.cover?.description || "",
    introTitle: parsed.introduction?.title || "",
    introContent: parsed.introduction?.content || "",
    typesTitle: parsed.typesTitle || "",
    types: (Array.isArray(parsed.types) ? parsed.types : []).map((item) => ({
      title: item?.title || "",
      description: item?.description || "",
    })),
    thirdPartyTitle: parsed.thirdParty?.title || "",
    thirdPartyDescription: parsed.thirdParty?.description || "",
    providers: (Array.isArray(parsed.thirdParty?.providers)
      ? parsed.thirdParty.providers
      : []
    ).map((item) => ({ text: typeof item === "string" ? item : item?.text || "" })),
    preferencesTitle: parsed.preferences?.title || "",
    preferencesIntro: parsed.preferences?.intro || "",
    preferencesNote: parsed.preferences?.note || "",
    methods: (Array.isArray(parsed.preferences?.methods)
      ? parsed.preferences.methods
      : []
    ).map((item) => ({
      title: item?.title || "",
      description: item?.description || "",
    })),
    lifespanTitle: parsed.lifespan?.title || "",
    lifespanIntro: parsed.lifespan?.intro || "",
    lifespanItems: (Array.isArray(parsed.lifespan?.items)
      ? parsed.lifespan.items
      : []
    ).map((item) => ({
      title: item?.title || "",
      description: item?.description || "",
    })),
    updatesTitle: parsed.updates?.title || "",
    updatesDescription: parsed.updates?.description || "",
    contactTitle: parsed.contact?.title || "",
    contactDescription: parsed.contact?.description || "",
    company: parsed.contact?.company || "",
    department: parsed.contact?.department || "",
    email: parsed.contact?.email || "",
    phone: parsed.contact?.phone || "",
  };
}

export function wrapLegalBodyCookiesContent(content = {}, lang = "en") {
  const body = {
    cover: {
      title: content.coverTitle || "",
      description: content.coverDescription || "",
      effectiveDate: content.effectiveDate || "",
    },
    introduction: {
      title: content.introTitle || "",
      content: content.introContent || "",
    },
    typesTitle: content.typesTitle || "",
    types: (Array.isArray(content.types) ? content.types : []).map((item) => ({
      title: item?.title || "",
      description: item?.description || "",
    })),
    thirdParty: {
      title: content.thirdPartyTitle || "",
      description: content.thirdPartyDescription || "",
      providers: (Array.isArray(content.providers) ? content.providers : [])
        .map((item) => item?.text || "")
        .filter(Boolean),
    },
    preferences: {
      title: content.preferencesTitle || "",
      intro: content.preferencesIntro || "",
      note: content.preferencesNote || "",
      methods: (Array.isArray(content.methods) ? content.methods : []).map(
        (item) => ({
          title: item?.title || "",
          description: item?.description || "",
        })
      ),
    },
    lifespan: {
      title: content.lifespanTitle || "",
      intro: content.lifespanIntro || "",
      items: (Array.isArray(content.lifespanItems)
        ? content.lifespanItems
        : []
      ).map((item) => ({
        title: item?.title || "",
        description: item?.description || "",
      })),
    },
    updates: {
      title: content.updatesTitle || "",
      description: content.updatesDescription || "",
    },
    contact: {
      title: content.contactTitle || "",
      description: content.contactDescription || "",
      company: content.company || "",
      department: content.department || "",
      email: content.email || "",
      phone: content.phone || "",
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
