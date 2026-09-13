import ph1 from "@/assets/FullHeightHeaderWithText/ph1.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped FullHeightHeaderWithText data from i18next translations.
 */
export function buildFullHeightHeaderWithTextData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("fullHeightHeaderWithText.title"),
          description: t("fullHeightHeaderWithText.description"),
          ctaButton: {
            label: t("fullHeightHeaderWithText.buttonText"),
            slug: t("fullHeightHeaderWithText.ctaSlug"),
          },
          backgroundImage: {
            fileUrl: toUrl(ph1),
            alt: t("fullHeightHeaderWithText.imageAlt"),
          },
        },
      },
    ],
  };
}
