import { useCallback, useMemo } from "react";

export function useCarouselNavigation(sliderRef) {
  const handleNext = useCallback(() => {
    sliderRef.current?.slickNext();
  }, [sliderRef]);

  const handlePrev = useCallback(() => {
    sliderRef.current?.slickPrev();
  }, [sliderRef]);

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

  return {
    handleNext,
    handlePrev,
    handleKeyDown,
  };
}

export function useCarouselNavigationState(
  isMobile,
  activeIndex,
  cardsLength
) {
  return useMemo(() => {
    const slidesToShow = isMobile ? 1 : 2.8;
    return {
      slidesToShow,
      canGoPrev: activeIndex > 0,
      canGoNext: activeIndex < cardsLength - slidesToShow,
      showNavigation: cardsLength > slidesToShow,
    };
  }, [isMobile, activeIndex, cardsLength]);
}
