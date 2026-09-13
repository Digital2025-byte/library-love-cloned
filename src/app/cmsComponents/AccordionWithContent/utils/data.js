/**
 * Builds CMS-shaped accordion data from i18next translations.
 */
export function buildAccordionData(t) {
  const items = t("accordion.items", { returnObjects: true });

  return {
    translations: [
      {
        content: {
          title: t("accordion.title"),
          buttonLabel: t("accordion.buttonLabel"),
          buttonHref: t("accordion.buttonHref"),
          items: Array.isArray(items) ? items : [],
        },
      },
    ],
  };
}
