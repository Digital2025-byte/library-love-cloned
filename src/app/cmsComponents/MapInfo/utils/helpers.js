export const CITY_TABS_LIMIT = 6;

export function makeMapUrl(latitude, longitude) {
  if (!latitude || !longitude) return null;
  return `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
}

/** Unique countries in branch order (first appearance). No alphabetical sort. */
export function getUniqueCountries(branches = []) {
  return [...new Set(branches.map((branch) => branch.country))].filter(Boolean);
}

export function groupBranchesByCountry(branches = []) {
  const grouped = {};

  branches.forEach((branch) => {
    if (!branch.country) return;
    if (!grouped[branch.country]) {
      grouped[branch.country] = {};
    }
    if (!grouped[branch.country][branch.city]) {
      grouped[branch.country][branch.city] = [];
    }
    grouped[branch.country][branch.city].push(branch);
  });

  return grouped;
}

export function normalizeMapBranch(branch) {
  return {
    id: branch?.id || branch?.branchId || "",
    name: branch?.name || "",
    country: branch?.country || "",
    city: branch?.city || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    email: branch?.email || "",
    workingHours: branch?.workingHours || branch?.workingHoursText || "",
    latitude: branch?.latitude || "",
    longitude: branch?.longitude || "",
  };
}

export function normalizeMapOffice(office = {}) {
  return {
    id: office?.id || "",
    name: office?.name || "",
    city: office?.city || "",
    address: office?.address || "",
    phone: office?.phone || "",
    email: office?.email || "",
    workingHours: office?.workingHours || office?.workingHoursText || "",
    latitude: office?.latitude || "",
    longitude: office?.longitude || "",
  };
}

/** Flat branches → editor tabs (country → offices). */
export function branchesToTabs(branches = []) {
  const order = [];
  const byCountry = new Map();

  (Array.isArray(branches) ? branches : []).forEach((branch) => {
    const normalized = normalizeMapBranch(branch);
    const country = normalized.country || "";
    if (!byCountry.has(country)) {
      byCountry.set(country, []);
      order.push(country);
    }
    byCountry.get(country).push(normalizeMapOffice(normalized));
  });

  return order.map((country) => ({
    country,
    items: byCountry.get(country) || [],
  }));
}

/** Editor tabs → flat branches for runtime / CMS storage. */
export function tabsToBranches(tabs = []) {
  const branches = [];

  (Array.isArray(tabs) ? tabs : []).forEach((tab, tabIndex) => {
    const country = tab?.country || "";
    const items = Array.isArray(tab?.items) ? tab.items : [];

    items.forEach((item, itemIndex) => {
      const office = normalizeMapOffice(item);
      branches.push({
        ...office,
        id: office.id || `branch-${tabIndex + 1}-${itemIndex + 1}`,
        country,
      });
    });
  });

  return branches;
}

export function getMapInfoContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      branches: [],
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

  let branches = [];
  if (Array.isArray(content?.tabs) && content.tabs.length) {
    branches = tabsToBranches(content.tabs).map(normalizeMapBranch);
  } else if (Array.isArray(content?.branches)) {
    branches = content.branches.map(normalizeMapBranch);
  }

  return {
    title,
    description,
    branches,
    hasContent: Boolean(title || description || branches.length),
  };
}

export function getContactFieldLabels(t) {
  return {
    address: t("mapInfo.labels.address"),
    phone: t("mapInfo.labels.phone"),
    email: t("mapInfo.labels.email"),
    workingHours: t("mapInfo.labels.workingHours"),
    city: t("mapInfo.labels.city"),
    mapUnavailable: t("mapInfo.labels.mapUnavailable"),
  };
}

export function getMapInfoEditorContent(data, lang = "en") {
  const content = getMapInfoContent(data, lang);

  return {
    title: content.title || "",
    description: content.description || "",
    tabs: branchesToTabs(content.branches),
  };
}

export function wrapMapInfoContent(content = {}, lang = "en") {
  const branches = Array.isArray(content.tabs)
    ? tabsToBranches(content.tabs)
    : Array.isArray(content.branches)
      ? content.branches.map(normalizeMapBranch)
      : [];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          branches,
        },
      },
    ],
  };
}
