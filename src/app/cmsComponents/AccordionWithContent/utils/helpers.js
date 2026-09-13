import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function normalizeItem(item = {}) {
  return {
    title: item?.title || "",
    description: item?.description || "",
    links: normalizeBacklinks(item?.links),
  };
}

function toEditorItem(item = {}) {
  return {
    title: item?.title || "",
    description: item?.description || "",
    links: toEditorBacklinks(item?.links),
  };
}

export function getAccordionContent(data) {
  const content = data?.translations?.[0]?.content || {};

  return {
    title: content?.title || "",
    description: content?.description || "",
    links: normalizeBacklinks(content?.links),
    buttonLabel: content?.buttonLabel || "",
    buttonHref: content?.buttonHref || "#",
    buttonLinkType: content?.buttonLinkType || "internal",
    items: Array.isArray(content?.items)
      ? content.items.map(normalizeItem)
      : [],
  };
}

export function getAccordionEditorContent(data) {
  const content = data?.translations?.[0]?.content || {};

  return {
    title: content?.title || "",
    description: content?.description || "",
    links: toEditorBacklinks(content?.links),
    buttonLabel: content?.buttonLabel || "",
    buttonHref: content?.buttonHref || "#",
    buttonLinkType: content?.buttonLinkType || "internal",
    items: Array.isArray(content?.items)
      ? content.items.map(toEditorItem)
      : [],
  };
}

export function wrapAccordionContent(content = {}) {
  return {
    translations: [
      {
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          buttonLabel: content.buttonLabel || "",
          buttonHref: content.buttonHref || "#",
          buttonLinkType: content.buttonLinkType || "internal",
          items: Array.isArray(content.items)
            ? content.items.map((item) => ({
                title: item?.title || "",
                description: item?.description || "",
                links: normalizeBacklinks(item?.links),
              }))
            : [],
        },
      },
    ],
  };
}
