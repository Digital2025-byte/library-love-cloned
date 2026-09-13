export function toPhoneHref(phone = "") {
  const cleaned = String(phone).replace(/[^+\d]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

export function toEmailHref(email = "") {
  const value = String(email).trim();
  return value ? `mailto:${value}` : "";
}

function normalizeOffice(office) {
  return {
    name: office?.name || "",
    address: office?.address || "",
    phone: office?.phone || "",
    email: office?.email || "",
    hours: office?.hours || "",
    weekend: office?.weekend || "",
  };
}

function normalizeTab(tab) {
  return {
    label: tab?.label || "",
    offices: Array.isArray(tab?.offices) ? tab.offices.map(normalizeOffice) : [],
  };
}

export function getOfficeDirectoryContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      callLabel: "",
      emailLabel: "",
      weekendLabel: "",
      tabsLabel: "",
      tabs: [],
      hasContent: false,
    };
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
    .filter((tab) => tab.label || tab.offices.length);

  return {
    callLabel: content?.callLabel || "",
    emailLabel: content?.emailLabel || "",
    weekendLabel: content?.weekendLabel || "",
    tabsLabel: content?.tabsLabel || "",
    tabs,
    hasContent: tabs.length > 0,
  };
}

export function getOfficeDirectoryEditorContent(data, lang = "en") {
  const { callLabel, emailLabel, weekendLabel, tabsLabel, tabs } =
    getOfficeDirectoryContent(data, lang);
  return {
    callLabel: callLabel || "",
    emailLabel: emailLabel || "",
    weekendLabel: weekendLabel || "",
    tabsLabel: tabsLabel || "",
    tabs: tabs.map((tab) => ({
      label: tab.label || "",
      offices: tab.offices.map((o) => ({ ...o })),
    })),
  };
}

export function wrapOfficeDirectoryContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          callLabel: content.callLabel || "",
          emailLabel: content.emailLabel || "",
          weekendLabel: content.weekendLabel || "",
          tabsLabel: content.tabsLabel || "",
          tabs: (Array.isArray(content.tabs) ? content.tabs : []).map((tab) => ({
            label: tab?.label || "",
            offices: (Array.isArray(tab?.offices) ? tab.offices : []).map(
              normalizeOffice
            ),
          })),
        },
      },
    ],
  };
}
