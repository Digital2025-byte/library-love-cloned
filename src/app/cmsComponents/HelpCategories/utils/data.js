const CATEGORY_SEED = [
  { id: "contact", icon: "phone", href: "/help/contact-us" },
  { id: "faqs", icon: "question", href: "/help/faqs" },
  { id: "offices", icon: "mapPin", href: "/help/contact-us/our-offices" },
  { id: "forms", icon: "clipboard", href: "/help/contact-us/forms" },
  { id: "track", icon: "track", href: "" },
];

/**
 * Builds CMS-shaped HelpCategories data from i18next translations.
 */
export function buildHelpCategoriesData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("helpCategories.title"),
          subtitle: t("helpCategories.subtitle"),
          cards: CATEGORY_SEED.map((cat) => ({
            icon: cat.icon,
            title: t(`helpCategories.items.${cat.id}.title`),
            description: t(`helpCategories.items.${cat.id}.description`),
            href: cat.href,
          })),
        },
      },
    ],
  };
}
