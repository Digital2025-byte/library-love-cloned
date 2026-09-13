import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function toImageSrc(value) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return value.src || value.fileUrl || value.url || "";
}

export function isUsableImageSrc(src) {
  const value = String(toImageSrc(src) || "").trim();
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

function normalizeImage(image, fallbackAlt = "Step image") {
  if (!image) {
    return { fileUrl: "", alt: fallbackAlt };
  }

  if (typeof image === "string") {
    return { fileUrl: image, alt: fallbackAlt };
  }

  return {
    fileUrl: toImageSrc(image.fileUrl || image.url || image.src || image),
    alt: image.alt || fallbackAlt,
  };
}

function normalizeStep(raw, index) {
  const step = raw?.step || raw || {};
  const fallbackAlt = `Step ${index + 1}`;
  const image = normalizeImage(step?.image, step?.imageAlt || fallbackAlt);

  return {
    description: step?.description || "",
    links: normalizeBacklinks(step?.links),
    imageUrl: image.fileUrl,
    imageAlt: image.alt || fallbackAlt,
  };
}

export function getConnectionStepsListContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", links: [], steps: [], stepLabel: "", hasContent: false };
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
  const steps = (Array.isArray(content?.steps) ? content.steps : [])
    .map(normalizeStep)
    .filter((step) => step.description || step.imageUrl);

  return {
    title,
    links: normalizeBacklinks(content?.links),
    steps,
    stepLabel: content?.stepLabel || "",
    hasContent: Boolean(title || steps.length),
  };
}

export function getConnectionStepsListEditorContent(data, lang = "en") {
  const content = getConnectionStepsListContent(data, lang);

  return {
    title: content.title || "",
    stepLabel: content.stepLabel || "",
    links: toEditorBacklinks(content.links),
    items: content.steps.map((step) => ({
      description: step.description || "",
      links: toEditorBacklinks(step.links),
      imageUrl: step.imageUrl || "",
      imageAlt: step.imageAlt || "",
    })),
  };
}

export function wrapConnectionStepsListContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          stepLabel: content.stepLabel || "",
          links: normalizeBacklinks(content.links),
          steps: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              description: item?.description || "",
              links: normalizeBacklinks(item?.links),
              image: {
                fileUrl: item?.imageUrl || "",
                alt: item?.imageAlt || "",
              },
            })
          ),
        },
      },
    ],
  };
}
