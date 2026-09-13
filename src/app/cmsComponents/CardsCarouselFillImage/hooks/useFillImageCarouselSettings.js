import { useMemo } from "react";

/**
 * Fractional slidesToShow (not variableWidth) so slick natively:
 * - start: full | full | peek
 * - end:   peek | full | full  (via built-in slideOffset, smooth animation)
 */
export function useFillImageCarouselSettings(
  cardsCount = 0,
  slidesToShow = 2.7,
  onBeforeChange,
  onAfterChange
) {
  return useMemo(() => {
    const count = Math.max(cardsCount, 1);
    const show = Math.min(slidesToShow, count);

    return {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 550,
      cssEase: "ease-in-out",
      variableWidth: false,
      slidesToShow: show,
      slidesToScroll: 1,
      swipeToSlide: true,
      accessibility: true,
      autoplay: false,
      centerMode: false,
      centerPadding: "0px",
      rtl: false,
      beforeChange: onBeforeChange,
      afterChange: onAfterChange,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(1.55, count),
            slidesToScroll: 1,
            infinite: false,
            centerMode: false,
            variableWidth: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(1.15, count),
            slidesToScroll: 1,
            infinite: false,
            centerMode: false,
            variableWidth: false,
          },
        },
      ],
    };
  }, [cardsCount, slidesToShow, onBeforeChange, onAfterChange]);
}
