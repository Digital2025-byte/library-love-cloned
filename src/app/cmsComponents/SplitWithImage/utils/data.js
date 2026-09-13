import plane from "@/assets/splitWithImage/plane.png";
import sky from "@/assets/splitWithImage/sky.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

/**
 * Builds CMS-shaped SplitWithImage data from i18next translations.
 */
export function buildSplitWithImageData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("splitWithImage.title"),
          description: t("splitWithImage.description"),
          backgroundImage: {
            fileUrl: toUrl(sky),
            alt: t("splitWithImage.backgroundAlt"),
          },
          image: {
            fileUrl: toUrl(plane),
            alt: t("splitWithImage.imageAlt"),
          },
        },
      },
    ],
  };
}
