/**
 * Demo DestinationsMap data (cities + routes).
 * Images use Unsplash placeholders for the CMS showcase.
 */
const DEMO_IMAGES = {
  damascus:
    "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=900&q=80",
  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  baghdad:
    "https://images.unsplash.com/photo-1546412414-8035f128c3c5?auto=format&fit=crop&w=900&q=80",
  kuwait:
    "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=900&q=80",
  doha: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
  beirut:
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
};

export function buildDestinationsMapData(t, lang = "en") {
  const cities = t("destinationsMap.cities", { returnObjects: true });
  const routes = t("destinationsMap.routes", { returnObjects: true });
  const safeCities = Array.isArray(cities) ? cities : [];
  const safeRoutes = Array.isArray(routes) ? routes : [];

  const imageByKey = [
    DEMO_IMAGES.damascus,
    DEMO_IMAGES.dubai,
    DEMO_IMAGES.baghdad,
    DEMO_IMAGES.kuwait,
    DEMO_IMAGES.doha,
    DEMO_IMAGES.beirut,
  ];

  return {
    type: "DestinationsMap",
    translations: [
      {
        languageCode: lang,
        content: {
          labels: {
            from: t("destinationsMap.labels.from"),
            to: t("destinationsMap.labels.to"),
            reset: t("destinationsMap.labels.reset"),
            bookNow: t("destinationsMap.labels.bookNow"),
            newRoutes: t("destinationsMap.labels.newRoutes"),
            ourNetwork: t("destinationsMap.labels.ourNetwork"),
          },
          cities: safeCities.map((city, index) => ({
            cityId: city.cityId,
            cityName: city.cityName,
            countryName: city.countryName,
            IATACode: city.IATACode,
            latitude: city.latitude,
            longitude: city.longitude,
            isNewCity: Boolean(city.isNewCity),
            price: city.price,
            currency: city.currency,
            numberOfFlightsPerWeek: city.numberOfFlightsPerWeek,
            duration: city.duration,
            flightType: city.flightType,
            imageUrl: [imageByKey[index % imageByKey.length]],
          })),
          routes: safeRoutes.map((route) => ({
            fromCityId: route.fromCityId,
            toCityId: route.toCityId,
          })),
        },
      },
    ],
  };
}
