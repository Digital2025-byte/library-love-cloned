"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../slider-hero.css";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import SliderTrack from "./SliderTrack";
import { mergeSliderSettings } from "../utils/sliderSettings";
import {
  sliderStyleToImageOverlay,
  sliderStyleToSettings,
} from "../utils/style";

export default function SliderPanel({
  lang = "en",
  posParams = "gb",
  cId,
  content,
  style,
}) {
  const slides = content.slides || [];
  const links = content.links || [];
  const showLinks = style.showLinks !== false;
  const slideLinkParts = showLinks
    ? buildItemBacklinkParts(slides, links)
    : null;
  const settings = mergeSliderSettings(sliderStyleToSettings(style));

  if (slides.length <= 1) {
    settings.infinite = false;
    settings.autoplay = false;
    settings.dots = false;
    settings.swipe = false;
    settings.arrows = false;
  }

  const arrowsVisible = settings.arrows !== false && slides.length > 1;
  const sliderKey = [
    lang,
    settings.fade,
    settings.infinite,
    settings.speed,
    settings.autoplay,
    settings.cssEase,
    settings.swipe,
    settings.draggable,
    settings.adaptiveHeight,
    settings.waitForAnimate,
    settings.touchThreshold,
  ].join("-");

  return (
    <section className="relative w-full overflow-hidden leading-none" dir="ltr">
      <SliderTrack
        key={sliderKey}
        slides={slides}
        slideLinkParts={slideLinkParts}
        settings={settings}
        lang={lang}
        posParams={posParams}
        cId={cId}
        sliderKey={sliderKey}
        style={style}
        showArrows={arrowsVisible}
        imageOverlay={sliderStyleToImageOverlay(style)}
      />
    </section>
  );
}
