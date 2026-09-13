import ph1 from "@/assets/DualImageText/ph1.png";
import ph2 from "@/assets/DualImageText/ph2.png";
import ph3 from "@/assets/DualImageText/ph3.png";
import ph4 from "@/assets/DualImageText/ph4.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

const ph1Url = toUrl(ph1);
const ph2Url = toUrl(ph2);
const ph3Url = toUrl(ph3);
const ph4Url = toUrl(ph4);

/**
 * Builds CMS-shaped DualImageText data from i18next translations.
 */
export function buildDualImageTextData(t, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          variant: "towards",
          exploreButton: {
            label: t("dualImageText.exploreMore"),
            slug: t("dualImageText.exploreSlug"),
          },
          extraImage: {
            fileUrl: ph3Url,
            alt: t("dualImageText.extraImageAlt"),
          },
          firstSection: {
            title: t("dualImageText.firstSection.title"),
            descriptions: (() => {
              const value = t("dualImageText.firstSection.descriptions", {
                returnObjects: true,
              });
              return Array.isArray(value) ? value : [String(value || "")];
            })(),
            image: {
              fileUrl: ph4Url,
              alt: t("dualImageText.firstSection.imageAlt"),
            },
          },
          items: [
            {
              item: {
                title: t("dualImageText.towards.itemOne.title"),
                description: t("dualImageText.towards.itemOne.description"),
                image: {
                  fileUrl: ph1Url,
                  alt: t("dualImageText.towards.itemOne.imageAlt"),
                },
              },
            },
            {
              item: {
                title: t("dualImageText.towards.itemTwo.title"),
                description: t("dualImageText.towards.itemTwo.description"),
                image: {
                  fileUrl: ph2Url,
                  alt: t("dualImageText.towards.itemTwo.imageAlt"),
                },
              },
            },
          ],
        },
      },
    ],
  };
}
