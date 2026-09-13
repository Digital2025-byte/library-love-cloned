import blobImage from "@/assets/Text-With-Blob-Image.webp";

/**
 * Builds CMS-shaped TextWithBlobImage data from i18next translations.
 */
export function buildTextWithBlobData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("textWithBlobImage.title"),
          description: t("textWithBlobImage.description"),
          image: {
            fileUrl: blobImage,
            alt: t("textWithBlobImage.imageAlt"),
          },
        },
      },
    ],
  };
}
