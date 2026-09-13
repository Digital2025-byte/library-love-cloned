import ph1 from "@/assets/RelatedContentCarousel/ph1.png";
import ph2 from "@/assets/RelatedContentCarousel/ph2.png";
import ph3 from "@/assets/RelatedContentCarousel/ph3.png";
import ph4 from "@/assets/RelatedContentCarousel/ph4.png";
import ph5 from "@/assets/RelatedContentCarousel/ph5.png";

const CARD_IMAGES = [ph1, ph2, ph3, ph4, ph5];

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped RelatedContentCarousel data from i18next translations.
 */
export function buildRelatedContentCarouselData(t, lang = "en") {
  const pages = t("relatedContentCarousel.pages", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("relatedContentCarousel.title"),
          description: t("relatedContentCarousel.description"),
          pages: Array.isArray(pages)
            ? pages.map((page, index) => ({
                id: page?.id || `page-${index + 1}`,
                title: page?.title || "",
                description: page?.description || "",
                CardImage: {
                  fileUrl: toUrl(CARD_IMAGES[index % CARD_IMAGES.length]),
                  width: CARD_IMAGES[index % CARD_IMAGES.length]?.width,
                  height: CARD_IMAGES[index % CARD_IMAGES.length]?.height,
                  alt: page?.imageAlt || page?.title || "",
                },
                CTA: {
                  content: page?.buttonText || "",
                  slug: page?.slug || "",
                },
                buttonLink: page?.buttonLink || "#",
              }))
            : [],
        },
      },
    ],
  };
}
