/**
 * Builds CMS-shaped PhotoTileGrid data from i18next translations.
 * Destinations match the "All destinations" UI reference.
 */
export function buildPhotoTileGridData(t, lang = "en") {
  const destinations = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
      iataCode: "DXB",
      cityKey: "dubai",
      countryKey: "uae",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80",
      iataCode: "AUH",
      cityKey: "abuDhabi",
      countryKey: "uae",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=900&q=80",
      iataCode: "SHJ",
      cityKey: "sharjah",
      countryKey: "uae",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=900&q=80",
      iataCode: "KWI",
      cityKey: "kuwait",
      countryKey: "kuwait",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=80",
      iataCode: "MCT",
      cityKey: "muscat",
      countryKey: "oman",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
      iataCode: "DOH",
      cityKey: "doha",
      countryKey: "qatar",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8f7?auto=format&fit=crop&w=900&q=80",
      iataCode: "RUH",
      cityKey: "riyadh",
      countryKey: "saudi",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=900&q=80",
      iataCode: "JED",
      cityKey: "jeddah",
      countryKey: "saudi",
      takeATripUrl: "#",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80",
      iataCode: "AMM",
      cityKey: "amman",
      countryKey: "jordan",
      takeATripUrl: "#",
    },
  ];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("photoTileGrid.title"),
          destinations: destinations.map((item) => ({
            imageUrl: item.imageUrl,
            iataCode: item.iataCode,
            cityName: t(`photoTileGrid.cities.${item.cityKey}`),
            countryName: t(`photoTileGrid.countries.${item.countryKey}`),
            takeATripUrl: item.takeATripUrl,
            discoverLabel: `${t("photoTileGrid.discover")} ${t(
              `photoTileGrid.cities.${item.cityKey}`
            )}`,
          })),
        },
      },
    ],
  };
}
