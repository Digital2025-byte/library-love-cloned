const SLICE_IMAGE =
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1200&q=80";

/**
 * Builds CMS-shaped VerticalImageSliceTextSection data from i18next translations.
 */
export function buildVerticalImageSliceData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("verticalImageSlice.title"),
          highlightPhrase: t("verticalImageSlice.highlightPhrase"),
          description: t("verticalImageSlice.description"),
          SliceImage: {
            fileUrl: SLICE_IMAGE,
            alt: t("verticalImageSlice.imageAlt"),
          },
        },
      },
    ],
  };
}
