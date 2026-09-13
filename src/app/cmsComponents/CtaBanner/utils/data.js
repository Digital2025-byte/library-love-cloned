const BANNER_IMAGE = "/help/help/ph1.png";

/**
 * Builds CMS-shaped CtaBanner data from i18next translations.
 */
export function buildCtaBannerData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("ctaBanner.title"),
          description: t("ctaBanner.description"),
          ctaButton: {
            content: t("ctaBanner.ctaLabel"),
            href: t("ctaBanner.ctaHref"),
            slug: t("ctaBanner.ctaSlug"),
          },
          backgroundImage: {
            fileUrl: BANNER_IMAGE,
            alt: t("ctaBanner.imageAlt"),
          },
        },
      },
    ],
  };
}
