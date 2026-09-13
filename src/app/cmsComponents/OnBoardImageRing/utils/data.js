import ph1 from "@/assets/ThreeDImageRingSection/ph1.png";
import ph2 from "@/assets/ThreeDImageRingSection/ph2.png";
import ph3 from "@/assets/ThreeDImageRingSection/ph3.png";
import { PANEL_COUNT, RING_COPIES } from "./constants";

const toUrl = (asset) => (typeof asset === "string" ? asset : asset?.src || "");

const IMAGE_POOL = [ph1, ph2, ph3].map(toUrl);

/**
 * Builds CMS-shaped demo data for OnBoardImageRing.
 */
export function buildOnBoardImageRingData(t, lang = "en") {
  const captions = t("onBoardImageRing.captions", {
    returnObjects: true,
  });
  const safeCaptions = Array.isArray(captions) ? captions : [];
  const uniqueCount = Math.max(safeCaptions.length, PANEL_COUNT);
  const total = uniqueCount * RING_COPIES;

  const images = Array.from(
    { length: total },
    (_, index) => IMAGE_POOL[index % IMAGE_POOL.length]
  );

  const resolvedCaptions = Array.from(
    { length: total },
    (_, index) => safeCaptions[index % Math.max(safeCaptions.length, 1)] || ""
  );

  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: t("onBoardImageRing.title"),
          description: t("onBoardImageRing.description"),
          images,
          captions: resolvedCaptions,
        },
      },
    ],
  };
}
