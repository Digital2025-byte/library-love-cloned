import ph1 from "@/assets/MixedRightThreeImages/ph1.webp";
import ph2 from "@/assets/MixedRightThreeImages/ph2.png";
import ph3 from "@/assets/MixedRightThreeImages/ph3.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

/**
 * Builds CMS-shaped MixedRightThreeImages data.
 * images[0] = tall right image, images[1]/[2] = left bottom pair.
 */
export function buildMixedRightThreeImagesData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("mixedRightThreeImages.title"),
          description: t("mixedRightThreeImages.description"),
          primaryCta: {
            label: t("mixedRightThreeImages.primaryCta"),
            href: t("mixedRightThreeImages.primaryCtaHref"),
          },
          secondaryCta: {
            label: t("mixedRightThreeImages.secondaryCta"),
            href: t("mixedRightThreeImages.secondaryCtaHref"),
          },
          images: [
            {
              fileUrl: toUrl(ph1),
              alt: t("mixedRightThreeImages.images.large"),
            },
            {
              fileUrl: toUrl(ph2),
              alt: t("mixedRightThreeImages.images.smallOne"),
            },
            {
              fileUrl: toUrl(ph3),
              alt: t("mixedRightThreeImages.images.smallTwo"),
            },
          ],
        },
      },
    ],
  };
}
