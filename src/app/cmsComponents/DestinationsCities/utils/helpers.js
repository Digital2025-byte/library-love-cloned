import {
  normalizeBacklinks,
  toEditorBacklinks,
} from "@/app/cmsComponents/shared/backlinks";

export function getDestinationsCitiesContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      description: "",
      links: [],
      cities: [],
      hasContent: false,
    };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (t) => String(t?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || {};
  const cities = (Array.isArray(content.cities) ? content.cities : [])
    .map((city) => {
      const cityName = city?.cityName || "";
      const IATACode = city?.IATACode || city?.iataCode || "";
      const description = city?.description || "";
      const imageUrl =
        typeof city?.imageUrl === "string"
          ? city.imageUrl
          : city?.imageUrl?.src ||
            city?.imageUrl?.[0] ||
            city?.image?.fileUrl ||
            "";

      if (!cityName && !IATACode && !description && !imageUrl) {
        return null;
      }

      return {
        IATACode,
        cityName,
        numberOfFlightsPerWeek: city?.numberOfFlightsPerWeek ?? "",
        description,
        links: normalizeBacklinks(city?.links),
        imageUrl,
        imageAlt: city?.imageAlt || city?.image?.alt || cityName || "",
        duration: city?.duration || "",
        title: city?.title || cityName,
        subtitle: city?.subtitle || "",
        flights: city?.flights,
        versionCard: city?.versionCard,
        buttonLabel: city?.buttonLabel || "",
      };
    })
    .filter(Boolean);

  return {
    title: content.title || "",
    description: content.description || "",
    links: normalizeBacklinks(content?.links),
    cities,
    hasContent: Boolean(content.title || content.description || cities.length),
  };
}

export function getDestinationsCitiesEditorContent(data, lang = "en") {
  const { title, description, links, cities } = getDestinationsCitiesContent(
    data,
    lang
  );

  return {
    title,
    description,
    links: toEditorBacklinks(links),
    items: cities.map((city) => ({
      cityName: city.cityName || "",
      IATACode: city.IATACode || "",
      subtitle: city.subtitle || "",
      numberOfFlightsPerWeek: String(city.numberOfFlightsPerWeek ?? ""),
      duration: city.duration || "",
      description: city.description || "",
      links: toEditorBacklinks(city.links),
      imageUrl: city.imageUrl || "",
      imageAlt: city.imageAlt || "",
      buttonLabel: city.buttonLabel || "",
    })),
  };
}

export function wrapDestinationsCitiesContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          description: content.description || "",
          links: normalizeBacklinks(content.links),
          cities: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              cityName: item?.cityName || "",
              IATACode: item?.IATACode || "",
              subtitle: item?.subtitle || "",
              numberOfFlightsPerWeek: item?.numberOfFlightsPerWeek || "",
              duration: item?.duration || "",
              description: item?.description || "",
              links: normalizeBacklinks(item?.links),
              imageUrl: item?.imageUrl || "",
              imageAlt: item?.imageAlt || item?.cityName || "",
              buttonLabel: item?.buttonLabel || "",
            })
          ),
        },
      },
    ],
  };
}
