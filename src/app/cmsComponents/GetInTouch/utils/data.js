const AGENT_IMAGE = "/help/contact-us/ph2.png";

/**
 * Builds CMS-shaped GetInTouch data from i18next translations.
 */
export function buildGetInTouchData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("getInTouch.title"),
          label: t("getInTouch.label"),
          phone: {
            display: t("getInTouch.phoneDisplay"),
            href: t("getInTouch.phoneHref"),
          },
          hours: t("getInTouch.hours"),
          note: t("getInTouch.note"),
          image: {
            fileUrl: AGENT_IMAGE,
            alt: t("getInTouch.imageAlt"),
          },
        },
      },
    ],
  };
}
