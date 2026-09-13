import ph1 from "@/assets/CarouselmageText6/ph1.png";
import ph2 from "@/assets/CarouselmageText6/ph2.png";
import ph3 from "@/assets/CarouselmageText6/ph3.png";
import ph4 from "@/assets/CarouselmageText6/ph4.png";
import ph5 from "@/assets/CarouselmageText6/ph5.png";
import ph6 from "@/assets/CarouselmageText6/ph6.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

const IMAGE_POOL = [
  toUrl(ph1),
  toUrl(ph2),
  toUrl(ph3),
  toUrl(ph4),
  toUrl(ph5),
  toUrl(ph6),
];

/**
 * Builds CMS-shaped CarouselImageText6 (Our Values) data.
 */
export function buildCarouselImageText6Data(t, lang = "en") {
  const valueKeys = [
    "safety",
    "comfort",
    "hospitality",
    "reliability",
    "excellence",
    "community",
  ];

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("carouselImageText6.title"),
          items: valueKeys.map((key, index) => ({
            item: {
              title: t(`carouselImageText6.values.${key}.title`),
              description: t(`carouselImageText6.values.${key}.description`),
              image: {
                fileUrl: IMAGE_POOL[index],
                alt: t(`carouselImageText6.values.${key}.imageAlt`),
              },
            },
          })),
        },
      },
    ],
  };
}
