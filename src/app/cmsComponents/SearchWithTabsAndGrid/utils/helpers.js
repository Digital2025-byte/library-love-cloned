import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function normalizeSight(raw, index) {
  const image =
    raw?.image ||
    raw?.imageUrl ||
    raw?.image?.fileUrl ||
    raw?.image?.url ||
    "";

  return {
    id: raw?.id || `sight-${index + 1}`,
    name: raw?.name || "",
    cityName: raw?.cityName || "",
    tag: raw?.tag || "",
    slug: raw?.slug || "",
    description: raw?.description || "",
    links: normalizeBacklinks(raw?.links),
    image: typeof image === "string" ? image : image?.src || "",
  };
}

export function getSearchWithTabsAndGridContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      searchPlaceholder: "",
      gridTitle: "",
      links: [],
      tags: [],
      sights: [],
      allLabel: "All",
      exploreLabel: "Explore",
      exploreMagazineLabel: "Explore as magazine",
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
  const search = content?.Search || content?.search || {};
  const tagsRaw =
    content?.tabbedNavigation?.tags || content?.TabbedNavigation?.tags || [];
  const sightsRaw =
    content?.photoTileGrid?.sights ||
    content?.PhotoTileGrid?.sights ||
    [];

  const tags = (Array.isArray(tagsRaw) ? tagsRaw : [])
    .map((tag) => ({
      name: tag?.name || "",
      icon: tag?.Icon || tag?.icon || "",
    }))
    .filter((tag) => tag.name);

  const sights = (Array.isArray(sightsRaw) ? sightsRaw : [])
    .map(normalizeSight)
    .filter((sight) => sight.name || sight.image);

  const gridTitle =
    content?.PhotoTileGrid?.title ||
    content?.photoTileGrid?.title ||
    content?.gridTitle ||
    "";

  return {
    searchPlaceholder:
      search?.placeholder ||
      search?.searchPlaceholder ||
      search?.namePlaceholder ||
      "",
    gridTitle,
    links: normalizeBacklinks(content?.links),
    tags,
    sights,
    allLabel: content?.allLabel || (lang === "ar" ? "الكل" : "All"),
    exploreLabel: content?.exploreLabel || (lang === "ar" ? "اكتشف" : "Explore"),
    exploreMagazineLabel:
      content?.exploreMagazineLabel ||
      (lang === "ar" ? "اكتشف كمجلة" : "Explore as magazine"),
    hasContent: Boolean(gridTitle || sights.length || tags.length),
  };
}

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

export function getSearchWithTabsAndGridEditorContent(data, lang = "en") {
  const content = getSearchWithTabsAndGridContent(data, lang);

  return {
    searchPlaceholder: content.searchPlaceholder || "",
    gridTitle: content.gridTitle || "",
    links: toEditorBacklinks(content.links),
    allLabel: content.allLabel || "",
    exploreLabel: content.exploreLabel || "",
    exploreMagazineLabel: content.exploreMagazineLabel || "",
    tags: content.tags.map((tag) => ({
      name: tag.name || "",
      icon: tag.icon || "",
    })),
    items: content.sights.map((sight) => ({
      name: sight.name || "",
      cityName: sight.cityName || "",
      tag: sight.tag || "",
      slug: sight.slug || "",
      description: sight.description || "",
      links: toEditorBacklinks(sight.links),
      imageUrl: sight.image || "",
    })),
  };
}

export function wrapSearchWithTabsAndGridContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          links: normalizeBacklinks(content.links),
          Search: {
            placeholder: content.searchPlaceholder || "",
          },
          PhotoTileGrid: {
            title: content.gridTitle || "",
          },
          tabbedNavigation: {
            tags: (Array.isArray(content.tags) ? content.tags : []).map(
              (tag) => ({
                name: tag?.name || "",
                Icon: tag?.icon || "",
              })
            ),
          },
          photoTileGrid: {
            sights: (Array.isArray(content.items) ? content.items : []).map(
              (item, index) => ({
                id: item?.id || `sight-${index + 1}`,
                name: item?.name || "",
                cityName: item?.cityName || "",
                tag: item?.tag || "",
                slug: item?.slug || "",
                description: item?.description || "",
                links: normalizeBacklinks(item?.links),
                image: item?.imageUrl || "",
              })
            ),
          },
          allLabel: content.allLabel || "",
          exploreLabel: content.exploreLabel || "",
          exploreMagazineLabel: content.exploreMagazineLabel || "",
        },
      },
    ],
  };
}
