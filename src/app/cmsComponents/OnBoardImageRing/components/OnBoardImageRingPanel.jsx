"use client";

import { getThemeColorCss } from "@/styles/themeColors";
import OnBoardImageRingHeader from "./OnBoardImageRingHeader";
import OnBoardImageRingTrack from "./OnBoardImageRingTrack";
import { RING_HEIGHT, SECTION_BG } from "../utils/constants";
import {
  CARD_GAP_VALUE,
  DEFAULT_ON_BOARD_IMAGE_RING_STYLE,
} from "../utils/style";

export default function OnBoardImageRingPanel({
  lang = "en",
  content,
  style = DEFAULT_ON_BOARD_IMAGE_RING_STYLE,
  imageGap,
}) {
  const resolvedGap =
    imageGap ?? CARD_GAP_VALUE[style.cardGap] ?? CARD_GAP_VALUE.default;
  const backgroundColor = !style.showSectionBg
    ? "transparent"
    : style.sectionBg === DEFAULT_ON_BOARD_IMAGE_RING_STYLE.sectionBg
      ? SECTION_BG
      : getThemeColorCss(style.sectionBg, "primary-800");

  return (
    <section
      className="w-full overflow-hidden"
      style={{ backgroundColor }}
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <OnBoardImageRingHeader
        title={content.title}
        description={content.description}
        links={content.links || []}
        style={style}
      />

      <div className={`w-full ${RING_HEIGHT}`}>
        <OnBoardImageRingTrack
          images={content.images}
          captions={content.captions}
          lang={lang}
          imageGap={resolvedGap}
          style={style}
        />
      </div>
    </section>
  );
}
