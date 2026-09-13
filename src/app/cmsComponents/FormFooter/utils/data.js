import {
  DEFAULT_EMAIL,
  DEFAULT_PHONE,
  DEFAULT_PHONE_HREF,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_WEBSITE,
  TRANSPORT_PHONE,
  TRANSPORT_PHONE_HREF,
} from "./constants";

/**
 * Builds CMS-shaped FormFooter demo data.
 */
export function buildFormFooterData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          followTitle: t("formFooter.followTitle"),
          followDescription: t("formFooter.followDescription"),
          contactTitle: t("formFooter.contactTitle"),
          copyright: t("formFooter.copyright"),
          email: DEFAULT_EMAIL,
          website: DEFAULT_WEBSITE,
          phone: DEFAULT_PHONE,
          phoneHref: DEFAULT_PHONE_HREF,
          transportPhone: TRANSPORT_PHONE,
          transportPhoneHref: TRANSPORT_PHONE_HREF,
          socialLinks: DEFAULT_SOCIAL_LINKS,
          isTransportationSurvey: false,
        },
      },
    ],
  };
}
