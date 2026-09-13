import ph1 from "@/assets/DataTableWithImage/ph1.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped DataTableWithImage data from i18next translations.
 */
export function buildDataTableWithImageData(t, lang = "en") {
  const headers = t("dataTableWithImage.tableHeaders", {
    returnObjects: true,
  });
  const rows = t("dataTableWithImage.tableRows", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          sectionTitle: t("dataTableWithImage.sectionTitle"),
          tableHeaders: Array.isArray(headers) ? headers : [],
          tableRows: Array.isArray(rows)
            ? rows.map((row) => ({
                row: Array.isArray(row) ? row : row?.row || [],
              }))
            : [],
          infoNote: {
            text: t("dataTableWithImage.infoNote"),
          },
          illustrationImage: {
            fileUrl: toUrl(ph1),
            alt: t("dataTableWithImage.imageAlt"),
          },
        },
      },
    ],
  };
}
