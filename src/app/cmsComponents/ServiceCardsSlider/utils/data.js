import ph1 from "@/assets/ServiceCardsSlider/ph1.png";
import ph2 from "@/assets/ServiceCardsSlider/ph2.png";
import ph3 from "@/assets/ServiceCardsSlider/ph3.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

const IMAGES = [toUrl(ph1), toUrl(ph2), toUrl(ph3)];

const SERVICES = [
  { key: "baggage", iconName: "Suitcase" },
  { key: "seats", iconName: "Armchair" },
  { key: "transfer", iconName: "Car" },
];

/**
 * Builds CMS-shaped ServiceCardsSlider data from i18next translations.
 */
export function buildServiceCardsSliderData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("serviceCardsSlider.title"),
          description: t("serviceCardsSlider.description"),
          services: SERVICES.map(({ key, iconName }, index) => ({
            title: t(`serviceCardsSlider.services.${key}.title`),
            description: t(`serviceCardsSlider.services.${key}.description`),
            iconName,
            image: {
              fileUrl: IMAGES[index],
              alt: t(`serviceCardsSlider.services.${key}.imageAlt`),
            },
            link: {
              slug: t(`serviceCardsSlider.services.${key}.slug`),
              label: t(`serviceCardsSlider.services.${key}.cta`),
            },
          })),
        },
      },
    ],
  };
}
