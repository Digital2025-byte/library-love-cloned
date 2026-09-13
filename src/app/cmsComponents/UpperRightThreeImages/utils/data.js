import ph1 from "@/assets/UpperRightThreeImages/ph1.webp";
import ph2 from "@/assets/UpperRightThreeImages/ph2.png";
import ph3 from "@/assets/UpperRightThreeImages/ph3.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped UpperRightThreeImages data.
 * images[0] = large image, images[1]/[2] = small pair.
 */
export function buildUpperRightThreeImagesData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          name: t("upperRightThreeImages.title"),
          description: t("upperRightThreeImages.description"),
          primaryCta: {
            label: t("upperRightThreeImages.primaryCta"),
            href: t("upperRightThreeImages.primaryCtaHref"),
          },
          secondaryCta: {
            label: t("upperRightThreeImages.secondaryCta"),
            href: t("upperRightThreeImages.secondaryCtaHref"),
          },
          images: [
            {
              fileUrl: toUrl(ph1),
              alt: t("upperRightThreeImages.images.large"),
            },
            {
              fileUrl: toUrl(ph2),
              alt: t("upperRightThreeImages.images.smallOne"),
            },
            {
              fileUrl: toUrl(ph3),
              alt: t("upperRightThreeImages.images.smallTwo"),
            },
          ],
        },
      },
    ],
  };
}
