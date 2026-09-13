import { isExternalHref, INTERNAL_PAGES } from "@/components/inspector";

export const DEFAULT_INTERNAL_HREF = INTERNAL_PAGES[0]?.href || "/gb/en";

/**
 * Build autocomplete candidates (words + short phrases) from source copy.
 */
export function getWordSuggestionsFromText(text = "", { maxPhraseWords = 4 } = {}) {
  const source = String(text || "");
  if (!source.trim()) return [];

  const words = Array.from(source.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)).map(
    (match) => match[0]
  );

  if (!words.length) return [];

  const seen = new Set();
  const suggestions = [];

  const pushUnique = (value) => {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return;
    seen.add(key);
    suggestions.push(value);
  };

  for (const word of words) {
    pushUnique(word);
  }

  const phraseLimit = Math.max(2, maxPhraseWords);
  for (let size = 2; size <= phraseLimit; size += 1) {
    for (let index = 0; index <= words.length - size; index += 1) {
      pushUnique(words.slice(index, index + size).join(" "));
    }
  }

  return suggestions;
}

export function normalizeOccurrence(value) {
  if (value === "all") return "all";

  if (Array.isArray(value)) {
    const indexes = [
      ...new Set(
        value
          .map((entry) => Number(entry))
          .filter((index) => Number.isFinite(index) && index >= 1)
          .map((index) => Math.floor(index))
      ),
    ].sort((a, b) => a - b);
    return indexes.length ? indexes : [1];
  }

  if (value === "first" || value === undefined || value === null || value === "") {
    return [1];
  }

  const index = Number(value);
  if (Number.isFinite(index) && index >= 1) return [Math.floor(index)];
  return [1];
}

export function occurrenceIncludes(occurrence, seenIndex) {
  if (occurrence === "all") return true;
  if (Array.isArray(occurrence)) return occurrence.includes(seenIndex);
  return seenIndex === occurrence;
}

export function getSelectedMatchIndexes(occurrence, matchCount = 0) {
  const normalized = normalizeOccurrence(occurrence);
  if (normalized === "all") {
    return Array.from({ length: Math.max(0, matchCount) }, (_, index) => index + 1);
  }
  return normalized.filter((index) => index <= matchCount);
}

export function serializeOccurrence(selectedIndexes = [], matchCount = 0) {
  const unique = [
    ...new Set(
      selectedIndexes
        .map((entry) => Number(entry))
        .filter(
          (index) => Number.isFinite(index) && index >= 1 && index <= matchCount
        )
        .map((index) => Math.floor(index))
    ),
  ].sort((a, b) => a - b);

  if (!unique.length) return "first";
  if (matchCount > 0 && unique.length === matchCount) return "all";
  if (unique.length === 1 && unique[0] === 1) return "first";
  if (unique.length === 1) return String(unique[0]);
  return unique;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-phrase match (case-insensitive). "available" will not match inside
 * "availability". Returns the matched source slice so display casing is kept.
 */
export function findNextPhraseMatch(source = "", phrase = "", fromIndex = 0) {
  const text = String(source || "");
  const needle = String(phrase || "");
  if (!text || !needle || fromIndex >= text.length) return null;

  try {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`,
      "giu"
    );
    pattern.lastIndex = Math.max(0, fromIndex);
    const match = pattern.exec(text);
    if (!match) return null;
    return { index: match.index, value: match[0] };
  } catch {
    const lowerText = text.toLowerCase();
    const lowerNeedle = needle.toLowerCase();
    let index = lowerText.indexOf(lowerNeedle, fromIndex);
    while (index >= 0) {
      const before = index === 0 ? "" : text[index - 1];
      const afterIndex = index + needle.length;
      const after = afterIndex >= text.length ? "" : text[afterIndex];
      const beforeOk = !before || !/[\p{L}\p{N}]/u.test(before);
      const afterOk = !after || !/[\p{L}\p{N}]/u.test(after);
      if (beforeOk && afterOk) {
        return {
          index,
          value: text.slice(index, index + needle.length),
        };
      }
      index = lowerText.indexOf(lowerNeedle, index + 1);
    }
    return null;
  }
}

/**
 * Whole-phrase match index. Case-insensitive.
 */
export function findNextPhraseIndex(source = "", phrase = "", fromIndex = 0) {
  const match = findNextPhraseMatch(source, phrase, fromIndex);
  return match ? match.index : -1;
}

export function countPhraseOccurrences(text = "", phrase = "") {
  const source = String(text || "");
  const needle = String(phrase || "");
  if (!source || !needle) return 0;

  let count = 0;
  let cursor = 0;
  let match = findNextPhraseMatch(source, needle, cursor);

  while (match) {
    count += 1;
    cursor = match.index + match.value.length;
    match = findNextPhraseMatch(source, needle, cursor);
  }

  return count;
}

function ordinalLabel(index) {
  const remainder10 = index % 10;
  const remainder100 = index % 100;
  if (remainder10 === 1 && remainder100 !== 11) return `${index}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${index}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${index}rd`;
  return `${index}th`;
}

export function getMatchCheckboxOptionsByCount(count = 0) {
  return Array.from({ length: Math.max(0, count) }, (_, index) => {
    const value = index + 1;
    return {
      value,
      label: `${ordinalLabel(value)} match`,
    };
  });
}

export function getMatchCheckboxOptions(description = "", phrase = "") {
  return getMatchCheckboxOptionsByCount(
    countPhraseOccurrences(description, phrase)
  );
}

/** @deprecated Prefer multi-select checkboxes via getMatchCheckboxOptionsByCount */
export function getOccurrenceOptions(description = "", phrase = "") {
  const count = countPhraseOccurrences(description, phrase);
  const options = [
    { value: "first", label: "First only" },
    {
      value: "all",
      label: count > 1 ? `All matches (${count})` : "All matches",
    },
  ];

  for (let index = 2; index <= count; index += 1) {
    options.push({
      value: String(index),
      label: `${ordinalLabel(index)} match`,
    });
  }

  return options;
}

export function normalizeBacklinks(links = []) {
  if (!Array.isArray(links)) return [];

  return links
    .map((link) => {
      const normalizedOccurrence = normalizeOccurrence(link?.occurrence);
      const occurrenceRaw =
        normalizedOccurrence === "all"
          ? "all"
          : Array.isArray(normalizedOccurrence) &&
              normalizedOccurrence.length === 1
            ? normalizedOccurrence[0] === 1
              ? "first"
              : String(normalizedOccurrence[0])
            : normalizedOccurrence;

      const type =
        link?.type === "external" || isExternalHref(link?.href)
          ? "external"
          : "internal";
      const href = String(link?.href || "").trim();

      return {
        text: String(link?.text || "").trim(),
        href: href || (type === "internal" ? DEFAULT_INTERNAL_HREF : ""),
        type,
        occurrence: occurrenceRaw,
      };
    })
    .filter((link) => link.text && link.href);
}

/** @deprecated Prefer normalizeBacklinks */
export const normalizeParagraphLinks = normalizeBacklinks;

export function emptyBacklink() {
  return {
    text: "",
    type: "internal",
    href: DEFAULT_INTERNAL_HREF,
    occurrence: "all",
  };
}

export function toEditorBacklinks(links = []) {
  return normalizeBacklinks(links).map((link) => ({
    text: link.text || "",
    type: link.type || "internal",
    href: link.href || "",
    occurrence: link.occurrence || "first",
  }));
}
