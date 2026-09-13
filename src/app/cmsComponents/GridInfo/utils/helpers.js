export function getItemCity(item) {
  return item?.grid?.city || item?.city || item?.cityName || "";
}

export function isDamascusCity(city) {
  const value = String(city || "")
    .trim()
    .toLowerCase();
  return value === "damascus" || value === "دمشق";
}

export function getUniqueCities(items = []) {
  const uniqueCities = [
    ...new Set(items.map((item) => getItemCity(item)).filter(Boolean)),
  ];

  return uniqueCities.sort((a, b) => {
    const aIsDamascus = isDamascusCity(a);
    const bIsDamascus = isDamascusCity(b);
    if (aIsDamascus && !bIsDamascus) return -1;
    if (!aIsDamascus && bIsDamascus) return 1;
    return String(a).localeCompare(String(b));
  });
}

export function getPreferredCity(cities = []) {
  return cities.find((city) => isDamascusCity(city)) || cities[0] || null;
}

export function normalizeGridItem(item) {
  const grid = item?.grid || {};

  return {
    name: grid?.name || item?.name || "",
    city: getItemCity(item),
    address: grid?.address || item?.address || "",
    phone: grid?.phone || item?.phone || "",
    email: grid?.email || item?.email || "",
    workingHoursText: grid?.workingHoursText || item?.workingHoursText || "",
  };
}

export function getGridInfoContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations) ? data.translations : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
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
  const description = content?.description || "";
  const rawItems = content?.branches || content?.items || [];
  const items = Array.isArray(rawItems)
    ? rawItems.map(normalizeGridItem)
    : [];

  return {
    title,
    description,
    items,
    hasContent: Boolean(title || description || items.length),
  };
}

export function getGridInfoEditorContent(data, lang = "en") {
  const content = getGridInfoContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    items: content.items.map((item) => ({
      name: item.name || "",
      city: item.city || "",
      address: item.address || "",
      phone: item.phone || "",
      email: item.email || "",
      workingHoursText: item.workingHoursText || "",
    })),
  };
}

export function wrapGridInfoContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          branches: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              grid: {
                name: item?.name || "",
                city: item?.city || "",
                address: item?.address || "",
                phone: item?.phone || "",
                email: item?.email || "",
                workingHoursText: item?.workingHoursText || "",
              },
            })
          ),
        },
      },
    ],
  };
}
