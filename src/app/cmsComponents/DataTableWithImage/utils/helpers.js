function toImageSrc(value) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return value.src || value.fileUrl || value.url || "";
}

export function isUsableImageSrc(src) {
  const value = String(toImageSrc(src) || "").trim();
  if (!value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeHeader(item) {
  if (typeof item === "string") {
    return item;
  }
  return item?.header || item?.title || item?.text || "";
}

function normalizeRow(row) {
  const rowData = row?.row || row;

  if (Array.isArray(rowData)) {
    return rowData.map((cell) =>
      typeof cell === "string" ? cell : cell?.cell || cell?.content || ""
    );
  }

  if (Array.isArray(rowData?.cells)) {
    return rowData.cells.map((cell) =>
      typeof cell === "string" ? cell : cell?.cell || cell?.content || ""
    );
  }

  return [];
}

export function getDataTableWithImageContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      headers: [],
      rows: [],
      note: "",
      imageSrc: "",
      imageAlt: "",
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        String(translation?.languageCode || "").toLowerCase() ===
        normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const title = content?.sectionTitle || content?.title || "";

  const headers = Array.isArray(content?.tableHeaders)
    ? content.tableHeaders.map(normalizeHeader).filter(Boolean)
    : [];

  const rows = Array.isArray(content?.tableRows)
    ? content.tableRows.map(normalizeRow).filter((row) => row.length > 0)
    : [];

  const note =
    content?.infoNote?.text ||
    content?.infoNote ||
    content?.note ||
    "";

  const imageSrc = toImageSrc(
    content?.illustrationImage?.fileUrl ||
      content?.illustrationImage?.url ||
      content?.imageUrl ||
      ""
  );
  const imageAlt =
    content?.illustrationImage?.alt ||
    content?.imageAlt ||
    (lang === "ar" ? "رسم توضيحي لحجم الأمتعة" : "Baggage size illustration");

  return {
    title,
    headers,
    rows,
    note: typeof note === "string" ? note : "",
    imageSrc,
    imageAlt,
    hasContent: Boolean(title || rows.length || imageSrc),
  };
}

export function getDataTableWithImageEditorContent(data, lang = "en") {
  const content = getDataTableWithImageContent(data, lang);

  return {
    title: content.title || "",
    note: content.note || "",
    headers: content.headers.map((text) => ({ text })),
    rows: content.rows.map((cells) => ({ cells })),
    imageUrl: content.imageSrc || "",
    imageAlt: content.imageAlt || "",
  };
}

export function wrapDataTableWithImageContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          sectionTitle: content.title || "",
          tableHeaders: (Array.isArray(content.headers)
            ? content.headers
            : []
          ).map((header) => header?.text || ""),
          tableRows: (Array.isArray(content.rows) ? content.rows : []).map(
            (row) => ({
              row: Array.isArray(row?.cells) ? row.cells : [],
            })
          ),
          infoNote: {
            text: content.note || "",
          },
          illustrationImage: {
            fileUrl: content.imageUrl || "",
            alt: content.imageAlt || "",
          },
        },
      },
    ],
  };
}
