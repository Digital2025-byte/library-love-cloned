/**
 * Builds CMS-shaped CallUs data from i18next translations.
 */
export function buildCallUsData(t) {
  return {
    translations: [
      {
        content: {
          upperText: t("callUs.upperText"),
          mainText: t("callUs.mainText"),
          bottomText: t("callUs.bottomText"),
        },
      },
    ],
  };
}
