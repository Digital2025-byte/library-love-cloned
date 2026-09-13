/**
 * Builds CMS-shaped SimpleGridWithPrefix data from i18next translations.
 */
export function buildSimpleGridWithPrefixData(t, lang = "en") {
  const channels = t("simpleGridWithPrefix.channels", { returnObjects: true });
  const prefix = t("simpleGridWithPrefix.prefix");
  const chip = t("simpleGridWithPrefix.chip");

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("simpleGridWithPrefix.title"),
          description: t("simpleGridWithPrefix.description"),
          channels: Array.isArray(channels)
            ? channels.map((channel) => ({
                grid: {
                  title: channel?.title || "",
                  userName: channel?.userName || "",
                  link: channel?.link || "#",
                  icon: channel?.icon || "",
                  prefix: channel?.prefix || prefix,
                  chip: channel?.chip || chip,
                },
              }))
            : [],
        },
      },
    ],
  };
}
