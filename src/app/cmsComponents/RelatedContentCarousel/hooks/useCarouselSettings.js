import { useMemo } from "react";

export function useCarouselSettings(cardsCount = 0, onBeforeChange) {
  return useMemo(() => {
    const desktopShow = Math.min(2.35, Math.max(cardsCount, 1));

    return {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 500,
      slidesToShow: desktopShow,
      slidesToScroll: 1,
      swipeToSlide: true,
      accessibility: true,
      autoplay: false,
      // Keep LTR always — slick rtl breaks initial track position with flex slides.
      // Arabic opposite motion is handled via CSS mirror in CarouselSlider.
      rtl: false,
      beforeChange: onBeforeChange,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(1.7, Math.max(cardsCount, 1)),
            slidesToScroll: 1,
            infinite: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(1.15, Math.max(cardsCount, 1)),
            slidesToScroll: 1,
            infinite: false,
          },
        },
      ],
    };
  }, [cardsCount, onBeforeChange]);
}
