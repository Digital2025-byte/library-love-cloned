export function getPhotoTileGridContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return {
      title: "",
      destinations: [],
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
  const title = content?.title || "";

  const destinations = (
    Array.isArray(content?.destinations) ? content.destinations : []
  )
    .map((card) => {
      const imageUrl =
        card?.imageUrl ||
        card?.image?.fileUrl ||
        card?.image?.url ||
        card?.fileUrl ||
        "";
      const cityName = card?.cityName || card?.CityName || "";
      const countryName = card?.countryName || card?.CountryName || "";
      const iataCode = card?.iataCode || card?.IATACode || "";
      const discoverLabel = card?.discoverLabel || "";

      if (!imageUrl && !cityName && !countryName && !iataCode && !discoverLabel) {
        return null;
      }

      return {
        imageUrl,
        imageAlt: card?.imageAlt || card?.image?.alt || cityName || "",
        iataCode,
        cityName,
        countryName,
        takeATripUrl: card?.takeATripUrl || card?.TakeUrl || card?.href || "",
        discoverLabel,
      };
    })
    .filter(Boolean);

  return {
    title,
    destinations,
    hasContent: Boolean(title || destinations.length),
  };
}

export function getPhotoTileGridEditorContent(data, lang = "en") {
  const content = getPhotoTileGridContent(data, lang);

  return {
    title: content.title || "",
    items: content.destinations.map((card) => ({
      cityName: card.cityName || "",
      countryName: card.countryName || "",
      iataCode: card.iataCode || "",
      imageUrl: card.imageUrl || "",
      imageAlt: card.imageAlt || "",
      discoverLabel: card.discoverLabel || "",
      buttonHref: card.takeATripUrl === "#" ? "" : card.takeATripUrl || "",
      buttonLinkType: "internal",
    })),
  };
}

export function wrapPhotoTileGridContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          destinations: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              cityName: item?.cityName || "",
              countryName: item?.countryName || "",
              iataCode: item?.iataCode || "",
              imageUrl: item?.imageUrl || "",
              imageAlt: item?.imageAlt || "",
              discoverLabel: item?.discoverLabel || "",
              takeATripUrl: item?.buttonHref || "",
            })
          ),
        },
      },
    ],
  };
}
