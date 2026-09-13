/**
 * Appends /c/{cId} to internal paths when cId is provided, so navigation preserves campaign context.
 * External URLs (http, https, mailto, tel, #) are returned unchanged.
 * Does not append if path already contains /c/{id}.
 */
export function withCampaignPath(path, cId) {
  if (!path || path === "#" || path === "") return path || "";
  if (!cId && cId !== 0) return path;

  const trimmed = String(path).trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return path;
  }

  const queryIndex = trimmed.indexOf("?");
  const pathOnly = queryIndex >= 0 ? trimmed.slice(0, queryIndex) : trimmed;
  if (/\/c\/\d+(\/|$)/.test(pathOnly)) return path;

  const query = queryIndex >= 0 ? trimmed.slice(queryIndex) : "";
  const base = pathOnly.endsWith("/") ? pathOnly.slice(0, -1) : pathOnly;
  return `${base}/c/${cId}${query}`;
}
