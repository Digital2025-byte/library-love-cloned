const HERO_IMAGE = "/help/our-offices/ph1.png";

/**
 * Builds CMS-shaped PageHero data from i18next translations.
 */
export function buildPageHeroData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("pageHero.title"),
          subtitle: t("pageHero.subtitle"),
          image: {
            fileUrl: HERO_IMAGE,
            alt: t("pageHero.imageAlt"),
          },
        },
      },
    ],
  };
}
