/**
 * Builds CMS-shaped TrackRequest data from i18next translations.
 */
export function buildTrackRequestData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("trackRequest.title"),
          subtitle: t("trackRequest.subtitle"),
          caseNumberLabel: t("trackRequest.caseNumberLabel"),
          lastNameLabel: t("trackRequest.lastNameLabel"),
          submitLabel: t("trackRequest.submitLabel"),
        },
      },
    ],
  };
}
