"use client";

import ThreeDSliderLib from "@/components/lightswind/3d-slider";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  CARD_RADIUS_CLASS,
  DRAG_SPEED_VALUE,
  HEIGHT_CLASS,
  WHEEL_SPEED_VALUE,
} from "../utils/style";

export default function ThreeDSliderPanel({ lang = "en", content, style }) {
  const { items } = content;

  return (
    <section className="w-full" lang={lang}>
      <ThreeDSliderLib
        items={items}
        speedWheel={WHEEL_SPEED_VALUE[style.wheelSpeed] ?? WHEEL_SPEED_VALUE.default}
        speedDrag={DRAG_SPEED_VALUE[style.dragSpeed] ?? DRAG_SPEED_VALUE.default}
        heightClass={HEIGHT_CLASS[style.sectionHeight] ?? HEIGHT_CLASS.default}
        cardRadiusClass={
          CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg
        }
        showDots={false}
        showCardImage={style.showCardImage}
        showCardTitle={style.showCardTitle}
        showNumber={style.showNumber}
        showOverlay={style.showOverlay}
        stageBgCss={
          style.showSectionBg
            ? getThemeColorCss(style.sectionBg, "foreground")
            : "transparent"
        }
        titleCss={
          style.cardTitleColor
            ? getThemeColorCss(style.cardTitleColor, "white")
            : undefined
        }
        numberCss={
          style.numberColor
            ? getThemeColorCss(style.numberColor, "white")
            : undefined
        }
        overlayCss={
          style.overlayColor
            ? getThemeColorCss(style.overlayColor, "foreground")
            : undefined
        }
      />
    </section>
  );
}
