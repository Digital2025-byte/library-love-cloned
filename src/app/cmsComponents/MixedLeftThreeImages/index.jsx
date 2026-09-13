"use client";

/**
 * @deprecated Use MixedRightThreeImages with style={{ imageSide: "left" }} instead.
 * Kept as a thin wrapper for existing imports.
 */
import MixedRightThreeImages from "@/app/cmsComponents/MixedRightThreeImages";

const MixedLeftThreeImages = ({ lang = "en", data, style }) => (
  <MixedRightThreeImages
    lang={lang}
    data={data}
    style={{ ...style, imageSide: "left" }}
  />
);

export default MixedLeftThreeImages;
