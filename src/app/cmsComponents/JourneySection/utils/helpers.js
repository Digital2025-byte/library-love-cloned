function normalizeLink(link) {
  if (typeof link === "string") {
    return { text: link, href: "" };
  }
  return { text: link?.text || "", href: link?.href || "" };
}

function normalizeStep(step) {
  const rawLinks = Array.isArray(step?.links) ? step.links : [];
  return {
    icon: step?.icon || "calendar",
    title: step?.title || "",
    links: rawLinks.map(normalizeLink).filter((link) => link.text),
  };
}

export function getJourneySectionContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", subtitle: "", steps: [], hasContent: false };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawSteps = Array.isArray(content.steps) ? content.steps : [];
  const steps = rawSteps.map(normalizeStep).filter((step) => step.title);

  return {
    title: content?.title || "",
    subtitle: content?.subtitle || "",
    steps,
    hasContent: steps.length > 0 || Boolean(content?.title),
  };
}

/** Editor represents each step's links as one text line per link. */
export function getJourneySectionEditorContent(data, lang = "en") {
  const { title, subtitle, steps } = getJourneySectionContent(data, lang);
  return {
    title: title || "",
    subtitle: subtitle || "",
    steps: steps.map((step) => ({
      icon: step.icon || "calendar",
      title: step.title || "",
      linksText: step.links.map((link) => link.text).join("\n"),
    })),
  };
}

function linksTextToArray(linksText = "") {
  return String(linksText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text) => ({ text, href: "" }));
}

export function wrapJourneySectionContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          steps: (Array.isArray(content.steps) ? content.steps : []).map(
            (step) => ({
              icon: step?.icon || "calendar",
              title: step?.title || "",
              links: linksTextToArray(step?.linksText),
            })
          ),
        },
      },
    ],
  };
}
