import { useMemo } from "react";
import { getRelatedContentCarouselContent } from "../utils/helpers";

export function useCarouselData(data, lang = "en", posParams = "gb") {
  return useMemo(
    () => getRelatedContentCarouselContent(data, lang, posParams),
    [data, lang, posParams]
  );
}
