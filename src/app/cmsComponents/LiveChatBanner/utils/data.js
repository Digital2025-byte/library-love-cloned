/**
 * Builds CMS-shaped LiveChatBanner data from i18next translations.
 */
export function buildLiveChatBannerData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("liveChatBanner.title"),
          description: t("liveChatBanner.description"),
          ctaButton: {
            content: t("liveChatBanner.ctaLabel"),
            href: t("liveChatBanner.ctaHref"),
            slug: t("liveChatBanner.ctaSlug"),
          },
        },
      },
    ],
  };
}
