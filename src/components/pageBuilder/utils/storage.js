/**
 * Browser persistence for a page's composition.
 *
 * One record per page slug:
 *   { blocks: [{ uid, sectionId, style, content: { en, ar } }] }
 *
 * Structure (order + which components) and style are shared across languages;
 * only `content` is stored per language. There is no backend yet, so this
 * keeps a visitor's work between reloads.
 */
const STORAGE_PREFIX = "cms:page:";

function storageKey(slug) {
  return `${STORAGE_PREFIX}${slug}`;
}

export function loadPageBlocks(slug) {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.blocks) ? parsed.blocks : null;
  } catch {
    return null;
  }
}

export function savePageBlocks(slug, blocks) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      storageKey(slug),
      JSON.stringify({ blocks })
    );
  } catch {
    /* storage full or unavailable — non-fatal for a demo */
  }
}

export function clearPageBlocks(slug) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(storageKey(slug));
  } catch {
    /* ignore */
  }
}
