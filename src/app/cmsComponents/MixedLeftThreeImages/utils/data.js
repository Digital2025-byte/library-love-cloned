import ph1 from "@/assets/MixedRightThreeImages/ph1.webp";
import ph2 from "@/assets/MixedRightThreeImages/ph2.png";
import ph3 from "@/assets/MixedRightThreeImages/ph3.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

/**
 * Builds CMS-shaped MixedLeftThreeImages data.
 * images[0] = tall left image, images[1]/[2] = right bottom pair.
 */
export function buildMixedLeftThreeImagesData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("mixedLeftThreeImages.title"),
          description: t("mixedLeftThreeImages.description"),
          primaryCta: {
            label: t("mixedLeftThreeImages.primaryCta"),
            href: t("mixedLeftThreeImages.primaryCtaHref"),
          },
          secondaryCta: {
            label: t("mixedLeftThreeImages.secondaryCta"),
            href: t("mixedLeftThreeImages.secondaryCtaHref"),
          },
          images: [
            {
              fileUrl: toUrl(ph1),
              alt: t("mixedLeftThreeImages.images.large"),
            },
            {
              fileUrl: toUrl(ph2),
              alt: t("mixedLeftThreeImages.images.smallOne"),
            },
            {
              fileUrl: toUrl(ph3),
              alt: t("mixedLeftThreeImages.images.smallTwo"),
            },
          ],
        },
      },
    ],
  };
}
