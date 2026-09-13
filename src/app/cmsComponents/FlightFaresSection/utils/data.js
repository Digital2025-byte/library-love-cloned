import { defaultFareLabels, formatFarePrice } from "./helpers";

const ITEM_IMAGES = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
];

/**
 * Builds CMS-shaped FlightFaresSection data from i18next translations.
 */
function readItemsList(t) {
  const fromItems = t("flightFares.items", { returnObjects: true });
  if (Array.isArray(fromItems)) return fromItems;

  const fromCities = t("flightFares.cities", { returnObjects: true });
  if (Array.isArray(fromCities)) return fromCities;

  return [];
}

export function buildFlightFaresData(t, lang = "en") {
  const rawItems = readItemsList(t);
  const labels = defaultFareLabels(lang);
  const economyFrom = t("flightFares.economyFrom");

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("flightFares.title"),
          items: rawItems.map((item, index) => {
            const baseTitle = item?.title || item?.cityName || "";
            const iata = item?.IATACode || item?.iataCode || "";
            const title =
              iata && baseTitle && !baseTitle.includes(`(${iata})`)
                ? `${baseTitle} (${iata})`
                : baseTitle;
            const price = item?.price || "";
            const currency = item?.currency || "";
            const subtitle =
              item?.subtitle ||
              formatFarePrice(economyFrom, price, currency, labels.subtitle);

            return {
              id: item?.id || item?.cityId || index + 1,
              cityId: item?.cityId || item?.id || index + 1,
              title,
              cityName: title,
              countryName: item?.countryName || "",
              price,
              currency,
              topBadge: item?.topBadge || labels.topBadge,
              hasTopBadge: true,
              subtitle,
              hasExtraBadge: Boolean(
                item?.hasExtraBadge ?? item?.isNew ?? false
              ),
              extraBadge: item?.extraBadge || labels.extraBadge,
              images: [
                {
                  url: ITEM_IMAGES[index % ITEM_IMAGES.length],
                  alt: title,
                },
              ],
            };
          }),
        },
      },
    ],
  };
}
