import defaultPattern from "@/assets/legal/pattern.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped LegalInformationHero demo data.
 */
export function buildLegalInformationHeroData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("legalInformationHero.title"),
          description: t("legalInformationHero.description"),
          patternUrl: toUrl(defaultPattern),
        },
      },
    ],
  };
}
