"use client";

import UpperRightThreeImagesPanel from "./components/UpperRightThreeImagesPanel";
import { getUpperRightThreeImagesContent } from "./utils/helpers";

const UpperRightThreeImages = ({
  lang = "en",
  data,
  cId,
  /** "right" (default) = large left / smalls right; "left" = smalls left / large right */
  side = "right",
}) => {
  const content = getUpperRightThreeImagesContent(data, lang);

  if (!content.hasContent) {
    return null;
  }

  return (
    <UpperRightThreeImagesPanel
      lang={lang}
      cId={cId}
      side={side}
      title={content.title}
      description={content.description}
      primaryCta={content.primaryCta}
      secondaryCta={content.secondaryCta}
      largeImage={content.largeImage}
      smallImageOne={content.smallImageOne}
      smallImageTwo={content.smallImageTwo}
    />
  );
};

export default UpperRightThreeImages;
