/**
 * POS code -> country names (en + ar) to exclude:
 * hide items tagged with the current origin country.
 */
export const POS_COUNTRY_NAMES = {
  sy: ["syria", "سورية"],
  ae: ["united arab emirates", "uae", "الإمارات العربية المتحدة", "الإمارات"],
  kw: ["kuwait", "الكويت"],
  iq: ["iraq", "baghdad", "العراق", "بغداد"],
  om: ["oman", "muscat", "عمان", "مسقط"],
  tr: ["turkey", "تركيا"],
  am: ["armenia", "yerevan", "أرمينيا", "يريفان"],
  gb: ["united kingdom", "great britain", "المملكة المتحدة", "بريطانيا"],
};

export function normalizeForMatch(str) {
  return (str || "").trim().toLowerCase();
}

export function isItemInPosCountry(item, posCode) {
  const names = POS_COUNTRY_NAMES[posCode];
  if (!names || !Array.isArray(names)) return false;
  const country = normalizeForMatch(item?.countryName || "");
  return names.some((name) => normalizeForMatch(name) === country);
}

/**
 * For duplicate id/title: first occurrence uses images[0],
 * second images[1], etc.
 */
export function getImageIndexForPosition(items, index) {
  const current = items[index];
  if (!current) return 0;

  const key = (item) =>
    item?.id != null
      ? String(item.id)
      : item?.cityId != null
        ? String(item.cityId)
        : (item?.title || item?.cityName || "").trim().toLowerCase();

  const currentKey = key(current);
  let occurrence = 0;

  for (let i = 0; i < index; i += 1) {
    if (key(items[i]) === currentKey) occurrence += 1;
  }

  return occurrence;
}

export function filterItemsByPos(items = [], posParams) {
  const posCode = String(posParams || "")
    .trim()
    .toLowerCase();

  if (!posCode) return items;

  return items.filter((item) => !isItemInPosCountry(item, posCode));
}

export function defaultFareLabels(lang = "en") {
  const isAr = String(lang || "").toLowerCase() === "ar";

  return {
    topBadge: isAr ? "اتجاه واحد" : "One-way",
    extraBadge: isAr ? "جديد" : "New",
    subtitle: isAr ? "الدرجة الاقتصادية" : "Economy class",
  };
}

export function normalizeFareItem(item, defaults = {}) {
  const images = Array.isArray(item?.images)
    ? item.images
        .map((image) => ({
          url: image?.url || image?.fileUrl || "",
          alt: image?.alt || item?.title || item?.cityName || "",
        }))
        .filter((image) => image.url)
    : [];

  const baseTitle = item?.title || item?.cityName || "";
  const iata = item?.IATACode || item?.iataCode || "";
  const title =
    iata && baseTitle && !baseTitle.includes(`(${iata})`)
      ? `${baseTitle} (${iata})`
      : baseTitle;
  const topBadge =
    item?.topBadge || item?.oneWayLabel || defaults.topBadge || "";
  const subtitle =
    item?.subtitle || item?.fromTemplate || defaults.subtitle || "";
  const extraBadge =
    item?.extraBadge ||
    item?.badgeLabel ||
    item?.newLabel ||
    defaults.extraBadge ||
    "";

  return {
    id: item?.id ?? item?.cityId ?? null,
    cityId: item?.cityId ?? item?.id ?? null,
    title,
    cityName: title,
    countryName: item?.countryName || "",
    price: item?.price || "",
    currency: item?.currency || "",
    hasTopBadge:
      item?.hasTopBadge !== undefined && item?.hasTopBadge !== null
        ? Boolean(item.hasTopBadge)
        : Boolean(item?.topBadge || item?.oneWayLabel || defaults.topBadge),
    topBadge,
    subtitle,
    hasExtraBadge: Boolean(
      item?.hasExtraBadge ??
        item?.hasBadge ??
        item?.isNew ??
        item?.showBadge ??
        false
    ),
    extraBadge,
    images,
  };
}

/** @deprecated Use normalizeFareItem */
export const normalizeFareCity = normalizeFareItem;

export function isUsableImageSrc(src) {
  const value = String(src || "").trim();
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

export function formatFarePrice(template, price, currency, fallback) {
  if (!template) {
    return fallback;
  }

  return String(template)
    .replaceAll("{{price}}", price ?? "")
    .replaceAll("{{currency}}", currency ?? "")
    .replaceAll("{price}", price ?? "")
    .replaceAll("{currency}", currency ?? "");
}

function getRawItems(content = {}) {
  if (Array.isArray(content.items) && content.items.length) {
    return content.items;
  }
  if (Array.isArray(content.cities)) {
    return content.cities;
  }
  return [];
}

export function getFlightFaresContent(data, lang = "en", posParams) {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      items: [],
      hasContent: false,
    };
  }

  const normalizedLang = String(lang || "").toLowerCase();
  const matchedTranslation =
    translations.find(
      (translation) =>
        translation?.languageCode?.toLowerCase() === normalizedLang
    ) || translations[0];

  const content = matchedTranslation?.content || {};
  const title = content?.title || "";
  const labels = defaultFareLabels(lang);
  const defaults = {
    topBadge: content?.topBadge || content?.oneWayLabel || labels.topBadge,
    extraBadge:
      content?.extraBadge ||
      content?.badgeLabel ||
      content?.newLabel ||
      labels.extraBadge,
    subtitle: content?.subtitle || content?.fromTemplate || labels.subtitle,
  };
  const items = filterItemsByPos(
    getRawItems(content).map((item) => normalizeFareItem(item, defaults)),
    posParams
  );

  return {
    title,
    items,
    /** @deprecated Use items */
    cities: items,
    hasContent: Boolean(title || items.length),
  };
}

export function getFlightFaresEditorContent(data, lang = "en") {
  const content = getFlightFaresContent(data, lang);

  return {
    title: content.title || "",
    items: content.items.map((item) => ({
      title: item.title || "",
      hasTopBadge: Boolean(item.hasTopBadge),
      topBadge: item.topBadge || "",
      subtitle: item.subtitle || "",
      hasExtraBadge: Boolean(item.hasExtraBadge),
      extraBadge: item.extraBadge || "",
      imageUrl: item.images?.[0]?.url || "",
      imageAlt: item.images?.[0]?.alt || item.title || "",
    })),
  };
}

export function wrapFlightFaresContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          items: (Array.isArray(content.items) ? content.items : []).map(
            (item, index) => ({
              id: item?.id ?? item?.cityId ?? index + 1,
              title: item?.title || "",
              hasTopBadge: Boolean(item?.hasTopBadge),
              topBadge: item?.topBadge || "",
              subtitle: item?.subtitle || "",
              hasExtraBadge: Boolean(item?.hasExtraBadge),
              extraBadge: item?.extraBadge || "",
              images: item?.imageUrl
                ? [
                    {
                      url: item.imageUrl,
                      alt: item.imageAlt || item.title || "",
                    },
                  ]
                : [],
            })
          ),
        },
      },
    ],
  };
}
