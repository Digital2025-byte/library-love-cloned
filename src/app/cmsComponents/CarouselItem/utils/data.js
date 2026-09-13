import ph1 from "@/assets/CarouselItem/ph1.png";
import ph2 from "@/assets/CarouselItem/ph2.png";
import ph3 from "@/assets/CarouselItem/ph3.png";
import ph4 from "@/assets/CarouselItem/ph4.png";
import ph5 from "@/assets/CarouselItem/ph5.png";
import ph6 from "@/assets/CarouselItem/ph6.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

const IMAGES = [ph1, ph2, ph3, ph4, ph5, ph6].map(toUrl);

/**
 * Builds CMS-shaped CarouselItem (destinations) demo data.
 * Images: assets/CarouselItem/ph1–ph6
 * Cards use the same CustomCard shape as PhotoTileGrid.
 */
export function buildCarouselItemData(t, lang = "en") {
  const destinations = t("carouselItem.destinations", { returnObjects: true });
  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const discover = t("carouselItem.discover");

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("carouselItem.title"),
          destinations: safeDestinations.map((item, index) => ({
            countryName: item?.countryName || "",
            cityName: item?.cityName || "",
            iataCode: item?.iataCode || "",
            takeATripUrl: item?.takeATripUrl || "#",
            imageAlt: item?.imageAlt || item?.cityName || "",
            imageUrl: IMAGES[index % IMAGES.length],
            discoverLabel: `${discover} ${item?.cityName || ""}`.trim(),
          })),
        },
      },
    ],
  };
}
