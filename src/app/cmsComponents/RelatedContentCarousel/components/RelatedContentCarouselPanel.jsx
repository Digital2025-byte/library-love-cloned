"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselHeader from "./CarouselHeader";
import CarouselNavigation from "./CarouselNavigation";
import CarouselSlider from "./CarouselSlider";
import { useCarouselSettings } from "../hooks/useCarouselSettings";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getCurrentSlidesToShow } from "../utils/helpers";

export default function RelatedContentCarouselPanel({
  lang = "en",
  content,
  style,
  cId,
}) {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { title, description, links = [], cards } = content;
  const showLinks = style.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(cards, links)
    : null;

  const [slidesToShow, setSlidesToShow] = useState(() =>
    getCurrentSlidesToShow(cards.length)
  );

  useEffect(() => {
    const update = () =>
      setSlidesToShow(getCurrentSlidesToShow(cards.length, window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cards.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [lang, cards.length]);

  const handleBeforeChange = useCallback((_, next) => {
    setActiveIndex(next);
  }, []);

  const settings = useCarouselSettings(cards.length, handleBeforeChange);

  const handlePrev = useCallback(() => {
    sliderRef.current?.slickPrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.slickNext();
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  const maxIndex = Math.max(0, cards.length - Math.ceil(slidesToShow));
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;
  const progressSteps = maxIndex + 1;
  const progress = (Math.min(activeIndex, maxIndex) + 1) / progressSteps;

  return (
    <div aria-label={title || "Cards carousel"}>
      <CarouselHeader
        title={title}
        description={description}
        links={links}
        style={style}
      />

      <CarouselSlider
        sliderRef={sliderRef}
        settings={settings}
        cards={cards}
        itemLinkParts={itemLinkParts}
        lang={lang}
        cId={cId}
        activeIndex={activeIndex}
        slidesToShow={slidesToShow}
        onKeyDown={handleKeyDown}
        style={style}
      />

      <CarouselNavigation
        lang={lang}
        onPrev={handlePrev}
        onNext={handleNext}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        currentIndex={activeIndex}
        totalSlides={cards.length}
        progress={progress}
        showNavigation={style.showArrows}
        style={style}
      />
    </div>
  );
}
