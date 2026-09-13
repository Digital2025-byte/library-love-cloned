import {
  DEFAULT_HEADER_IMAGE,
  DEFAULT_PROMO_HREF,
  DEFAULT_PROMO_IMAGE,
} from "./constants";

/**
 * Builds CMS-shaped FormHeader demo data.
 */
export function buildFormHeaderData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("formHeader.title"),
          subtitle: t("formHeader.subtitle"),
          ctaLabel: t("formHeader.ctaLabel"),
          headerImageSrc: DEFAULT_HEADER_IMAGE,
          promoImageSrc: DEFAULT_PROMO_IMAGE,
          promoHref: DEFAULT_PROMO_HREF,
          promoAlt: t("formHeader.promoAlt"),
          isTransportationSurvey: false,
        },
      },
    ],
  };
}
