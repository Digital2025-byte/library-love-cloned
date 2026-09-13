import ph1 from "@/assets/ConnectionStepsList/ph1.png";
import ph2 from "@/assets/ConnectionStepsList/ph2.png";
import ph3 from "@/assets/ConnectionStepsList/ph3.png";
import ph4 from "@/assets/ConnectionStepsList/ph4.png";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset.src);

const IMAGES = [toUrl(ph1), toUrl(ph2), toUrl(ph3), toUrl(ph4)];

/**
 * Builds CMS-shaped ConnectionStepsList data from i18next translations.
 */
export function buildConnectionStepsListData(t, lang = "en") {
  const steps = t("connectionStepsList.steps", { returnObjects: true });

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("connectionStepsList.title"),
          stepLabel: t("connectionStepsList.stepLabel"),
          steps: Array.isArray(steps)
            ? steps.map((step, index) => ({
                description: step?.description || "",
                image: {
                  fileUrl: IMAGES[index % IMAGES.length],
                  alt: step?.imageAlt || `Step ${index + 1}`,
                },
              }))
            : [],
        },
      },
    ],
  };
}
