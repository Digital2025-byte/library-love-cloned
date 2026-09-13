const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80";

/**
 * Builds CMS-shaped BannerWithCta data from i18next translations.
 */
export function buildBannerWithCtaData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("bannerWithCta.title"),
          description: t("bannerWithCta.description"),
          ctaButton: {
            content: t("bannerWithCta.ctaLabel"),
            href: t("bannerWithCta.ctaHref"),
            slug: t("bannerWithCta.ctaSlug"),
          },
          backgroundImage: {
            fileUrl: BANNER_IMAGE,
            alt: t("bannerWithCta.imageAlt"),
          },
        },
      },
    ],
  };
}
