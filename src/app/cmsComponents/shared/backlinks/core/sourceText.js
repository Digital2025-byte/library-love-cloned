/**
 * Join text fields into one string for phrase matching / autocomplete.
 * Empty chunks are skipped.
 */
export function joinBacklinkSourceText(...chunks) {
  return chunks
    .flat(Infinity)
    .map((chunk) => String(chunk || "").trim())
    .filter(Boolean)
    .join("\n");
}

/**
 * Build source text from section copy + item title/body fields.
 *
 * @example
 * joinItemBacklinkSourceText({
 *   description: content.description,
 *   items: content.items,
 * })
 */
export function joinItemBacklinkSourceText({
  description = "",
  items = [],
  titleKey = "title",
  bodyKey = "description",
} = {}) {
  return joinBacklinkSourceText(
    description,
    ...(items || []).flatMap((item) => [
      item?.[titleKey] || "",
      item?.[bodyKey] || item?.content || "",
    ])
  );
}
