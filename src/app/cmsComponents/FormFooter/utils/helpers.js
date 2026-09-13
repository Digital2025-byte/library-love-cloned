import {
  DEFAULT_EMAIL,
  DEFAULT_PHONE,
  DEFAULT_PHONE_HREF,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_WEBSITE,
  TRANSPORT_PHONE,
  TRANSPORT_PHONE_HREF,
} from "./constants";

export function getFormFooterContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  const empty = {
    followTitle: "",
    followDescription: "",
    contactTitle: "",
    email: DEFAULT_EMAIL,
    website: DEFAULT_WEBSITE,
    copyright: "",
    phone: DEFAULT_PHONE,
    phoneHref: DEFAULT_PHONE_HREF,
    transportPhone: TRANSPORT_PHONE,
    transportPhoneHref: TRANSPORT_PHONE_HREF,
    socialLinks: DEFAULT_SOCIAL_LINKS,
    isTransportationSurvey: false,
    hasContent: false,
  };

  if (!translations.length) {
    return empty;
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const socialLinks = Array.isArray(content.socialLinks)
    ? content.socialLinks
    : DEFAULT_SOCIAL_LINKS;

  return {
    followTitle: content.followTitle || "",
    followDescription: content.followDescription || "",
    contactTitle: content.contactTitle || "",
    email: content.email || DEFAULT_EMAIL,
    website: content.website || DEFAULT_WEBSITE,
    copyright: content.copyright || "",
    phone: content.phone || DEFAULT_PHONE,
    phoneHref: content.phoneHref || DEFAULT_PHONE_HREF,
    transportPhone: content.transportPhone || TRANSPORT_PHONE,
    transportPhoneHref: content.transportPhoneHref || TRANSPORT_PHONE_HREF,
    socialLinks,
    isTransportationSurvey: Boolean(content.isTransportationSurvey),
    hasContent: Boolean(
      content.followTitle || content.contactTitle || content.copyright
    ),
  };
}

export function getFormFooterEditorContent(data, lang = "en") {
  const content = getFormFooterContent(data, lang);

  return {
    followTitle: content.followTitle || "",
    followDescription: content.followDescription || "",
    contactTitle: content.contactTitle || "",
    email: content.email || "",
    website: content.website || "",
    copyright: content.copyright || "",
    phone: content.phone || "",
    phoneHref: content.phoneHref || "",
    transportPhone: content.transportPhone || "",
    transportPhoneHref: content.transportPhoneHref || "",
    isTransportationSurvey: Boolean(content.isTransportationSurvey),
    socialLinks: (Array.isArray(content.socialLinks)
      ? content.socialLinks
      : []
    ).map((item) => ({
      href: item?.href || "",
      alt: item?.alt || "",
      src: item?.src || "",
    })),
  };
}

export function wrapFormFooterContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          followTitle: content.followTitle || "",
          followDescription: content.followDescription || "",
          contactTitle: content.contactTitle || "",
          email: content.email || "",
          website: content.website || "",
          copyright: content.copyright || "",
          phone: content.phone || "",
          phoneHref: content.phoneHref || "",
          transportPhone: content.transportPhone || "",
          transportPhoneHref: content.transportPhoneHref || "",
          isTransportationSurvey: Boolean(content.isTransportationSurvey),
          socialLinks: (Array.isArray(content.socialLinks)
            ? content.socialLinks
            : []
          ).map((item) => ({
            href: item?.href || "",
            alt: item?.alt || "",
            src: item?.src || "",
          })),
        },
      },
    ],
  };
}
