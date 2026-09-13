import { useMemo } from "react";
import { getCardsCarouselFillImageContent } from "../utils/helpers";

export function useCarouselData(data, lang = "en", posParams = "gb") {
  return useMemo(
    () => getCardsCarouselFillImageContent(data, lang, posParams),
    [data, lang, posParams]
  );
}
