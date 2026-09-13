import ph1 from "@/assets/HeaderWithCityInfo/ph1.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/**
 * Builds CMS-shaped HeaderWithCityInfo data from i18next translations.
 */
export function buildHeaderWithCityInfoData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("headerWithCityInfo.title"),
          countryName: t("headerWithCityInfo.countryName"),
          weatherTitle: t("headerWithCityInfo.weatherTitle"),
          description: t("headerWithCityInfo.description"),
          weather: t("headerWithCityInfo.weather"),
          localTime: t("headerWithCityInfo.localTime"),
          duration: t("headerWithCityInfo.duration"),
          numberOfFlightPerWeek: t("headerWithCityInfo.numberOfFlightPerWeek"),
          nextFlight: t("headerWithCityInfo.nextFlight"),
          labels: {
            weather: t("headerWithCityInfo.labels.weather"),
            localTime: t("headerWithCityInfo.labels.localTime"),
            flightDuration: t("headerWithCityInfo.labels.flightDuration"),
            flightsPerWeek: t("headerWithCityInfo.labels.flightsPerWeek"),
            nextFlight: t("headerWithCityInfo.labels.nextFlight"),
          },
          backgroundImage: {
            fileUrl: toUrl(ph1),
            alt: t("headerWithCityInfo.imageAlt"),
          },
        },
      },
    ],
  };
}
