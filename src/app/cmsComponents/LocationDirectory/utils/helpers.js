export function toPhoneHref(phone = "") {
  const cleaned = String(phone).replace(/[^+\d]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

export function toEmailHref(email = "") {
  const value = String(email).trim();
  return value ? `mailto:${value}` : "";
}

export function toMapsHref(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return "";
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Parse a coordinate that may arrive as a number or a string field. */
function toCoord(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeLocation(location) {
  return {
    name: location?.name || "",
    city: location?.city || "",
    address: location?.address || "",
    phone: location?.phone || "",
    email: location?.email || "",
    hours: location?.hours || "",
    lat: toCoord(location?.lat),
    lng: toCoord(location?.lng),
  };
}

export function locationHasCoords(location) {
  return Number.isFinite(location?.lat) && Number.isFinite(location?.lng);
}

function normalizeTab(tab) {
  return {
    label: tab?.label || "",
    locations: Array.isArray(tab?.locations)
      ? tab.locations.map(normalizeLocation)
      : [],
  };
}

export function getLocationDirectoryContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { title: "", subtitle: "", tabs: [], hasContent: false };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (item) => String(item?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawTabs = Array.isArray(content.tabs) ? content.tabs : [];
  const tabs = rawTabs
    .map(normalizeTab)
    .filter((tab) => tab.label || tab.locations.length);

  return {
    title: content?.title || "",
    subtitle: content?.subtitle || "",
    tabs,
    hasContent: tabs.length > 0 || Boolean(content?.title),
  };
}

export function getLocationDirectoryEditorContent(data, lang = "en") {
  const { title, subtitle, tabs } = getLocationDirectoryContent(data, lang);
  return {
    title: title || "",
    subtitle: subtitle || "",
    tabs: tabs.map((tab) => ({
      label: tab.label || "",
      locations: tab.locations.map((loc) => ({
        ...loc,
        lat: loc.lat == null ? "" : String(loc.lat),
        lng: loc.lng == null ? "" : String(loc.lng),
      })),
    })),
  };
}

export function wrapLocationDirectoryContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          subtitle: content.subtitle || "",
          tabs: (Array.isArray(content.tabs) ? content.tabs : []).map((tab) => ({
            label: tab?.label || "",
            locations: (Array.isArray(tab?.locations) ? tab.locations : []).map(
              normalizeLocation
            ),
          })),
        },
      },
    ],
  };
}
