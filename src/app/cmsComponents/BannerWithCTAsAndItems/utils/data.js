import travelHeader from "@/assets/travelHeader.webp";

const travelHeaderUrl =
  typeof travelHeader === "string" ? travelHeader : travelHeader.src;

/**
 * Builds CMS-shaped BannerWithCTAsAndItems data from i18next translations.
 */
export function buildBannerWithCTAsAndItemsData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("bannerWithCTAsAndItems.title"),
          description: t("bannerWithCTAsAndItems.description"),
          backgroundImage: {
            fileUrl: travelHeaderUrl,
            alt: t("bannerWithCTAsAndItems.imageAlt"),
          },
          ctaPrimaryButton: {
            label: t("bannerWithCTAsAndItems.primaryLabel"),
            href: t("bannerWithCTAsAndItems.primaryHref"),
            slug: t("bannerWithCTAsAndItems.primarySlug"),
          },
          ctaSecondaryButton: {
            label: t("bannerWithCTAsAndItems.secondaryLabel"),
            href: t("bannerWithCTAsAndItems.secondaryHref"),
            slug: t("bannerWithCTAsAndItems.secondarySlug"),
          },
          items: [
            { content: t("bannerWithCTAsAndItems.items.0") },
            { content: t("bannerWithCTAsAndItems.items.1") },
            { content: t("bannerWithCTAsAndItems.items.2") },
          ],
        },
      },
    ],
  };
}
