/**
 * Shared semantic typography roles (sizes only).
 * Use with the correct HTML tag for meaning (h1–h6, p, a, etc.).
 *
 * Breakpoints: mobile → sm (≥640) → md (≥768) → lg (≥1024)
 */
export const typography = {
  /** Page-level title — typically one h1 per page */
  pageTitle: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",

  /** Section heading — typically h2 */
  sectionTitle: "text-xl sm:text-2xl md:text-3xl lg:text-3xl",

  /** Supporting text under a section title — typically p */
  sectionDescription: "text-sm sm:text-base md:text-lg lg:text-lg",

  /** Item / card / accordion question — typically h3 */
  itemTitle: "text-base sm:text-base md:text-lg lg:text-lg",

  /** Body under an item — typically p */
  itemDescription: "text-sm sm:text-base md:text-base lg:text-base",

  /** General paragraph body — typically p */
  body: "text-sm sm:text-base md:text-base lg:text-base",

  /** CTA / button label */
  button: "text-sm sm:text-base md:text-base lg:text-base",

  /** Small helper / caption text */
  caption: "text-xs sm:text-sm md:text-sm lg:text-sm",
};
