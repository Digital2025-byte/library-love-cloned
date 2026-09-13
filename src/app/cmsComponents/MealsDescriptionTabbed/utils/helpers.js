import {
  joinBacklinkSourceText,
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function normalizeImage(image, fallbackAlt = "Meal image") {
  if (!image) {
    return { fileUrl: "", alt: fallbackAlt };
  }

  if (typeof image === "string") {
    return { fileUrl: image, alt: fallbackAlt };
  }

  return {
    fileUrl: image.fileUrl || image.url || image.src || "",
    alt: image.alt || fallbackAlt,
  };
}

function normalizeItem(raw) {
  const item = raw?.item || raw || {};
  return {
    title: item?.title || "",
    description: item?.description || "",
  };
}

function normalizeGroup(raw) {
  const group = raw?.group || raw || {};
  const items = (Array.isArray(group?.items) ? group.items : [])
    .map(normalizeItem)
    .filter((item) => item.title || item.description);

  return {
    title: group?.title || group?.groupTitle || "",
    items,
  };
}

function normalizeSection(raw) {
  const section = raw?.section || raw || {};
  const groups = (Array.isArray(section?.groups) ? section.groups : [])
    .map(normalizeGroup)
    .filter((group) => group.title || group.items.length);
  const items = (Array.isArray(section?.items) ? section.items : [])
    .map(normalizeItem)
    .filter((item) => item.title || item.description);

  return {
    sectionTitle: section?.sectionTitle || section?.title || "",
    groups,
    items,
  };
}

function normalizeTab(raw) {
  const tab = raw?.tab || raw || {};
  const label = tab?.label || "";
  const image = normalizeImage(tab?.image, label || "Meal image");
  const sections = (Array.isArray(tab?.sections) ? tab.sections : [])
    .map(normalizeSection)
    .filter(
      (section) =>
        section.sectionTitle || section.items.length || section.groups.length
    );

  return {
    label,
    image,
    sections,
  };
}

function collectDescriptionChunks(tabs = [], notes = []) {
  const chunks = [];

  for (const tab of tabs) {
    for (const section of tab.sections || []) {
      for (const item of section.items || []) {
        chunks.push(item?.description);
      }
      for (const group of section.groups || []) {
        for (const item of group.items || []) {
          chunks.push(item?.description);
        }
      }
    }
  }

  for (const note of notes) {
    chunks.push(typeof note === "string" ? note : note?.text);
  }

  return chunks;
}

export function joinMealsBacklinkSourceText(content = {}) {
  const tabs = content.items || content.tabs || [];
  const notes = content.notes || [];
  return joinBacklinkSourceText(...collectDescriptionChunks(tabs, notes));
}

export function getMealsDescriptionTabbedContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", links: [], tabs: [], notes: [], hasContent: false };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const title = content?.title || "";
  const notes = Array.isArray(content?.notes)
    ? content.notes.filter(Boolean)
    : [];
  const tabs = (Array.isArray(content?.tabs) ? content.tabs : [])
    .map(normalizeTab)
    .filter((tab) => tab.label || tab.sections.length || tab.image.fileUrl);

  return {
    title,
    links: normalizeBacklinks(content?.links),
    tabs,
    notes,
    hasContent: Boolean(title || tabs.length),
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

export function getMealsDescriptionTabbedEditorContent(data, lang = "en") {
  const content = getMealsDescriptionTabbedContent(data, lang);

  return {
    title: content.title || "",
    links: toEditorBacklinks(content.links),
    notes: (content.notes || []).map((note) => ({
      text: note || "",
    })),
    items: (content.tabs || []).map((tab) => ({
      label: tab.label || "",
      imageUrl: tab.image?.fileUrl || "",
      imageAlt: tab.image?.alt || "",
      sections: (tab.sections || []).map((section) => ({
        sectionTitle: section.sectionTitle || "",
        items: (section.items || []).map((item) => ({
          title: item.title || "",
          description: item.description || "",
        })),
        groups: (section.groups || []).map((group) => ({
          title: group.title || "",
          items: (group.items || []).map((item) => ({
            title: item.title || "",
            description: item.description || "",
          })),
        })),
      })),
    })),
  };
}

export function wrapMealsDescriptionTabbedContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          links: normalizeBacklinks(content.links),
          notes: (Array.isArray(content.notes) ? content.notes : [])
            .map((note) => (typeof note === "string" ? note : note?.text || ""))
            .filter(Boolean),
          tabs: (Array.isArray(content.items) ? content.items : []).map(
            (tab) => ({
              label: tab?.label || "",
              image: {
                fileUrl: tab?.imageUrl || "",
                alt: tab?.imageAlt || tab?.label || "",
              },
              sections: (Array.isArray(tab?.sections) ? tab.sections : []).map(
                (section) => ({
                  sectionTitle: section?.sectionTitle || "",
                  items: (Array.isArray(section?.items) ? section.items : []).map(
                    (item) => ({
                      title: item?.title || "",
                      description: item?.description || "",
                    })
                  ),
                  groups: (Array.isArray(section?.groups)
                    ? section.groups
                    : []
                  ).map((group) => ({
                    title: group?.title || "",
                    items: (Array.isArray(group?.items) ? group.items : []).map(
                      (item) => ({
                        title: item?.title || "",
                        description: item?.description || "",
                      })
                    ),
                  })),
                })
              ),
            })
          ),
        },
      },
    ],
  };
}
