import heroPh1 from "@/assets/DestinationCities/ph1.webp";
import heroPh2 from "@/assets/DestinationCities/ph2.webp";
import heroPh3 from "@/assets/DestinationCities/ph3.webp";
import heroPh4 from "@/assets/DestinationCities/ph4.webp";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

/** Same asset for banner background and carousel cards */
const DESTINATION_IMAGES = [heroPh1, heroPh2, heroPh3, heroPh4].map(toUrl);

/**
 * Builds CMS-shaped DestinationShowcase demo data.
 * Background and card images share the same DestinationCities photo per city.
 */
export function buildDestinationShowcaseData(t, lang = "en") {
  const cities = t("destinationShowcase.cities", { returnObjects: true });
  const safeCities = Array.isArray(cities) ? cities : [];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("destinationShowcase.title"),
          description: t("destinationShowcase.description"),
          viewAllLabel: t("destinationShowcase.viewAllLabel"),
          exploreLabel: t("destinationShowcase.exploreLabel"),
          ctaButton: {
            content: t("destinationShowcase.viewAllLabel"),
            slug: t("destinationShowcase.viewAllHref"),
          },
          cities: safeCities.map((city, index) => {
            const imageUrl =
              DESTINATION_IMAGES[index % DESTINATION_IMAGES.length];
            return {
              ...city,
              heroImageUrl: imageUrl,
              cardImageUrl: imageUrl,
            };
          }),
        },
      },
    ],
  };
}
