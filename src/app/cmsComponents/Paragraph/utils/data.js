/**
 * Builds CMS-shaped Paragraph data from i18next translations.
 */
export function buildParagraphData(t, lang = "en") {
  const isAr = String(lang || "").toLowerCase() === "ar";

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("paragraph.title"),
          description: t("paragraph.description"),
          links: [
            {
              text: isAr ? "فلاي شام" : "FlyCham",
              type: "internal",
              href: "/gb/en/about",
              occurrence: "first",
            },
          ],
        },
      },
    ],
  };
}
