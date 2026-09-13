"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselHeader from "@/app/cmsComponents/RelatedContentCarousel/components/CarouselHeader";
import { CardsCarouselFillImageInset } from "./CardsCarouselFillImageContainer";
import FillImageCarouselNavigation from "./FillImageCarouselNavigation";
import FillImageCarouselSlider from "./FillImageCarouselSlider";
import { useFillImageCarouselSettings } from "../hooks/useFillImageCarouselSettings";
import {
  getMaxSlideIndex,
  isAtLastStep,
  usePeekSlideWidth,
} from "../hooks/usePeekSlideWidth";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";

export default function CardsCarouselFillImagePanel({
  lang = "en",
  content,
  style,
  cId,
}) {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { edgePad, visibleCount } = usePeekSlideWidth();
  const { title, description, links = [], cards } = content;
  const showLinks = style.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(cards, links)
    : null;

  const maxIndex = getMaxSlideIndex(cards.length, visibleCount);
  const atStart = activeIndex <= 0;
  const atEnd = isAtLastStep(activeIndex, cards.length, visibleCount);
  const canGoPrev = !atStart;
  const canGoNext = !atEnd && maxIndex > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [lang]);

  const syncIndex = useCallback(
    (index) => {
      const next = Math.max(0, Math.min(Number(index) || 0, maxIndex));
      setActiveIndex(next);
    },
    [maxIndex]
  );

  const handleBeforeChange = useCallback(
    (_, next) => {
      syncIndex(next);
    },
    [syncIndex]
  );

  const handleAfterChange = useCallback(
    (current) => {
      syncIndex(current);
    },
    [syncIndex]
  );

  const settings = useFillImageCarouselSettings(
    cards.length,
    visibleCount,
    handleBeforeChange,
    handleAfterChange
  );

  const handlePrev = useCallback(() => {
    if (atStart) return;
    const prevIndex = Math.max(0, Math.ceil(activeIndex) - 1);
    sliderRef.current?.slickGoTo(prevIndex);
    setActiveIndex(prevIndex);
  }, [atStart, activeIndex]);

  const handleNext = useCallback(() => {
    if (atEnd) return;
    const nextIndex = Math.min(maxIndex, Math.floor(activeIndex) + 1);
    sliderRef.current?.slickGoTo(nextIndex);
    setActiveIndex(nextIndex);
  }, [atEnd, activeIndex, maxIndex]);

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

  const showNavigation = maxIndex > 0;

  return (
    <div aria-label={title || "Cards carousel"}>
      <CardsCarouselFillImageInset>
        <CarouselHeader
          title={title}
          description={description}
          links={links}
          style={style}
        />
      </CardsCarouselFillImageInset>

      <div className="m-0 w-screen max-w-[100vw] ms-[calc(50%-50vw)] px-0">
        <FillImageCarouselSlider
          sliderKey={`${lang}-${visibleCount}`}
          sliderRef={sliderRef}
          settings={settings}
          cards={cards}
          itemLinkParts={itemLinkParts}
          lang={lang}
          cId={cId}
          onKeyDown={handleKeyDown}
          edgePad={edgePad}
          style={style}
        />
      </div>

      <CardsCarouselFillImageInset>
        <FillImageCarouselNavigation
          lang={lang}
          onPrev={handlePrev}
          onNext={handleNext}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          currentIndex={activeIndex}
          totalSlides={cards.length}
          showNavigation={style.showArrows && showNavigation}
          style={style}
        />
      </CardsCarouselFillImageInset>
    </div>
  );
}
