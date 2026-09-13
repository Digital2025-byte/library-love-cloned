import { withCampaignPath } from "@/utils/withCampaignPath";
import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

function resolveImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image.url === "string") return image.url;
  if (image.url?.src) return image.url.src;
  if (image.src) return image.src;
  if (image.fileUrl) return image.fileUrl;
  return "";
}

function uniqueCities(cities) {
  const seen = new Set();
  return cities.filter((city) => {
    const name = city?.cityName?.trim().toLowerCase();
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/**
 * Normalize CMS DestinationShowcase payload.
 */
export function getDestinationShowcaseContent(
  data,
  lang = "en",
  { posParams = "gb", cId } = {}
) {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      viewAllLabel: "",
      viewAllHref: "",
      exploreLabel: "",
      destinations: [],
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (entry) =>
        String(entry?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const rawCities = uniqueCities(
    Array.isArray(content.cities) ? content.cities : []
  );

  const destinations = rawCities.map((city, index) => {
    const slug = toSlug(city.slug || city.cityName);
    const imageUrl =
      resolveImageUrl(city.heroImageUrl) ||
      resolveImageUrl(city.heroImage) ||
      resolveImageUrl(city.cardImageUrl) ||
      resolveImageUrl(city.cardImage) ||
      resolveImageUrl(city.imageUrl) ||
      resolveImageUrl(city.image);
    const explorePath =
      city.exploreHref ||
      city.exploreLink ||
      `/${posParams}/${lang}/our-destinations/${slug}`;

    return {
      id: city.cityId || city.airportId || index,
      name: city.cityName || "",
      countryName: city.countryName || "",
      description:
        city.description ||
        [city.cityName, city.countryName].filter(Boolean).join(" — "),
      links: normalizeBacklinks(city.links),
      slug,
      imageUrl,
      imageAlt: city.imageAlt || city.cityName || "",
      cardImageUrl: imageUrl,
      exploreLink: withCampaignPath(explorePath, cId),
    };
  });

  const viewAllPath =
    data?.style?.ctaButton?.slug ||
    content?.ctaButton?.slug ||
    content?.viewAllHref ||
    `/${posParams}/${lang}/our-destinations`;

  return {
    title: content.title || "",
    description: content.description || "",
    links: normalizeBacklinks(content.links),
    viewAllLabel:
      content?.ctaButton?.content ||
      content?.viewAllLabel ||
      (lang === "ar" ? "عرض كل الوجهات" : "View all destinations"),
    viewAllHref: withCampaignPath(viewAllPath, cId),
    exploreLabel: content.exploreLabel || (lang === "ar" ? "اكتشف" : "Explore"),
    destinations,
    hasContent: Boolean(content.title || content.description || destinations.length),
  };
}

export function getDestinationShowcaseEditorContent(
  data,
  lang = "en",
  options = {}
) {
  const content = getDestinationShowcaseContent(data, lang, options);

  return {
    title: content.title || "",
    description: content.description || "",
    links: toEditorBacklinks(content.links),
    viewAllLabel: content.viewAllLabel || "",
    viewAllHref: content.viewAllHref || "",
    viewAllLinkType: "internal",
    exploreLabel: content.exploreLabel || "",
    items: content.destinations.map((dest) => ({
      cityName: dest.name || "",
      countryName: dest.countryName || "",
      description: dest.description || "",
      links: toEditorBacklinks(dest.links),
      slug: dest.slug || "",
      imageUrl: dest.imageUrl || "",
      imageAlt: dest.imageAlt || "",
    })),
  };
}

export function wrapDestinationShowcaseContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          viewAllLabel: content.viewAllLabel || "",
          exploreLabel: content.exploreLabel || "",
          ctaButton: {
            content: content.viewAllLabel || "",
            slug: content.viewAllHref || "",
          },
          cities: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              cityName: item?.cityName || "",
              countryName: item?.countryName || "",
              description: item?.description || "",
              links: normalizeBacklinks(item?.links),
              slug: item?.slug || toSlug(item?.cityName),
              imageAlt: item?.imageAlt || item?.cityName || "",
              heroImageUrl: item?.imageUrl || "",
              cardImageUrl: item?.imageUrl || "",
            })
          ),
        },
      },
    ],
  };
}

/**
 * Build a seamless infinite track. With `cloneCount === destinations.length`
 * this yields three identical copies ([A B C][A B C][A B C]), so the slider is
 * always filled on both sides and can recenter into the middle copy invisibly.
 */
export function buildInfiniteList(destinations, cloneCount = 2) {
  if (destinations.length <= 1) return destinations;
  return [
    ...destinations.slice(-cloneCount),
    ...destinations,
    ...destinations.slice(0, cloneCount),
  ];
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
