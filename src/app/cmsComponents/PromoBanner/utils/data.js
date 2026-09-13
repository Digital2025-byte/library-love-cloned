const BANNER_IMAGE = "/help/our-gsa/ph2.png";

/**
 * Builds CMS-shaped PromoBanner data from i18next translations.
 */
export function buildPromoBannerData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("promoBanner.title"),
          description: t("promoBanner.description"),
          ctaButton: {
            content: t("promoBanner.ctaLabel"),
            href: t("promoBanner.ctaHref"),
          },
          image: {
            fileUrl: BANNER_IMAGE,
            alt: t("promoBanner.imageAlt"),
          },
        },
      },
    ],
  };
}
