import {
  findNextPhraseMatch,
  normalizeBacklinks,
  normalizeOccurrence,
  occurrenceIncludes,
} from "./model";

function linkStateKey(link) {
  const occurrence = normalizeOccurrence(link.occurrence);
  const occurrenceKey = Array.isArray(occurrence)
    ? occurrence.join(",")
    : String(occurrence);
  return `${String(link.text || "").toLowerCase()}\0${link.href}\0${occurrenceKey}\0${link.type}`;
}

function applyLinkToParts(parts, link, state) {
  const occurrence = normalizeOccurrence(link.occurrence);
  const key = linkStateKey(link);
  let seen = state?.get(key) || 0;
  const next = [];

  for (const part of parts) {
    if (part.type !== "text") {
      next.push(part);
      continue;
    }

    const value = part.value;
    let cursor = 0;
    let match = findNextPhraseMatch(value, link.text, cursor);

    if (!match) {
      next.push(part);
      continue;
    }

    while (match) {
      if (match.index > cursor) {
        next.push({ type: "text", value: value.slice(cursor, match.index) });
      }

      seen += 1;
      const shouldLink = occurrenceIncludes(occurrence, seen);

      if (shouldLink) {
        next.push({
          type: "link",
          value: match.value,
          href: link.href,
          linkType: link.type,
        });
      } else {
        next.push({ type: "text", value: match.value });
      }

      cursor = match.index + match.value.length;
      match = findNextPhraseMatch(value, link.text, cursor);
    }

    if (cursor < value.length) {
      next.push({ type: "text", value: value.slice(cursor) });
    }
  }

  state?.set(key, seen);
  return next;
}

/**
 * Split plain text into text/link segments for chosen phrases.
 * Longer phrases win first. Pass the same `state` Map across calls
 * to count occurrences globally (e.g. across accordion items).
 */
export function buildLinkedTextParts(text, links = [], { state } = {}) {
  const source = String(text || "");
  const entries = normalizeBacklinks(links).sort(
    (a, b) => b.text.length - a.text.length
  );

  if (!source || !entries.length) {
    return source ? [{ type: "text", value: source }] : [];
  }

  let parts = [{ type: "text", value: source }];
  const localState = state || new Map();

  for (const link of entries) {
    parts = applyLinkToParts(parts, link, localState);
  }

  return parts;
}

/**
 * Apply shared section links across a list of items (title + body) with one
 * global occurrence counter, then apply each item's own links on the body.
 *
 * @param {Array<object>} items
 * @param {Array} sectionLinks
 * @param {{ titleKey?: string, bodyKey?: string | string[] }} [options]
 */
export function buildItemBacklinkParts(
  items = [],
  sectionLinks = [],
  options = {}
) {
  const titleKey = options.titleKey || "title";
  const bodyKeys = Array.isArray(options.bodyKey)
    ? options.bodyKey
    : [options.bodyKey || "description", "content"];

  const sharedState = new Map();
  const shared = normalizeBacklinks(sectionLinks);

  return items.map((item) => {
    const title = item?.[titleKey] || "";
    const body =
      bodyKeys.map((key) => item?.[key]).find((value) => value != null && value !== "") ||
      "";
    const localLinks = normalizeBacklinks(item?.links);

    const titleParts = buildLinkedTextParts(title, shared, {
      state: sharedState,
    });
    let bodyParts = buildLinkedTextParts(body, shared, { state: sharedState });

    if (localLinks.length) {
      bodyParts = localLinks
        .sort((a, b) => b.text.length - a.text.length)
        .reduce(
          (parts, link) => applyLinkToParts(parts, link, new Map()),
          bodyParts
        );
    }

    return { titleParts, bodyParts };
  });
}

/** @deprecated Prefer buildItemBacklinkParts */
export function buildAccordionItemLinkParts(items, sectionLinks) {
  return buildItemBacklinkParts(items, sectionLinks);
}
