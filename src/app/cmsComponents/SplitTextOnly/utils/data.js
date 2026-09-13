const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

/**
 * Builds CMS-shaped SplitTextOnly data from i18next translations.
 */
export function buildSplitTextOnlyData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("splitTextOnly.title"),
          description: t("splitTextOnly.description"),
          backgroundImage: {
            fileUrl: BACKGROUND_IMAGE,
            alt: t("splitTextOnly.imageAlt"),
          },
        },
      },
    ],
  };
}
