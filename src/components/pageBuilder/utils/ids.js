/** Stable-enough unique id for a block instance on a page. */
export function createBlockUid(sectionId) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${sectionId}-${Date.now().toString(36)}-${rand}`;
}
