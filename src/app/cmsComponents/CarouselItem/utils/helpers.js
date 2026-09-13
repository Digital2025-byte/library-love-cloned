/**
 * Map slick's left-slide index to which page dot is active
 * (desktop: multiple slides per view).
 */
export function getActivePageIndex(activeSlideIndex, slideCount, slidesPerView) {
  if (slideCount <= slidesPerView) return 0;
  const maxLeft = slideCount - slidesPerView;
  const pageCount = Math.max(1, Math.ceil(slideCount / slidesPerView));
  if (activeSlideIndex >= maxLeft) return pageCount - 1;
  return Math.floor(activeSlideIndex / slidesPerView);
}

export function getCarouselItemContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];
  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (t) => String(t?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];
  return matched?.content || null;
}

export function getDestinations(content) {
  return (Array.isArray(content?.destinations) ? content.destinations : [])
    .map((card) => {
      const imageUrl =
        card?.imageUrl ||
        card?.image?.fileUrl ||
        card?.image?.url ||
        card?.fileUrl ||
        "";
      const cityName = card?.cityName || card?.CityName || "";
      const countryName = card?.countryName || card?.CountryName || "";
      const iataCode = card?.iataCode || card?.IATACode || "";
      const discoverLabel = card?.discoverLabel || "";

      if (!imageUrl && !cityName && !countryName && !iataCode && !discoverLabel) {
        return null;
      }

      return {
        imageUrl,
        imageAlt: card?.imageAlt || card?.image?.alt || cityName || "",
        iataCode,
        cityName,
        countryName,
        takeATripUrl: card?.takeATripUrl || card?.TakeUrl || card?.href || "#",
        discoverLabel,
      };
    })
    .filter(Boolean);
}

export function getCarouselItemEditorContent(data, lang = "en") {
  const content = getCarouselItemContent(data, lang) || {};
  const destinations = getDestinations(content);

  return {
    title: content.title || "",
    items: destinations.map((card) => ({
      cityName: card.cityName || "",
      countryName: card.countryName || "",
      iataCode: card.iataCode || "",
      imageUrl: card.imageUrl || "",
      imageAlt: card.imageAlt || "",
      discoverLabel: card.discoverLabel || "",
      buttonHref: card.takeATripUrl || "",
      buttonLinkType: "internal",
    })),
  };
}

export function wrapCarouselItemContent(content = {}, lang = "en") {
  return {
    translations: [
      {
        languageCode: lang,
        content: {
          title: content.title || "",
          destinations: (Array.isArray(content.items) ? content.items : []).map(
            (item) => ({
              cityName: item?.cityName || "",
              countryName: item?.countryName || "",
              iataCode: item?.iataCode || "",
              imageUrl: item?.imageUrl || "",
              imageAlt: item?.imageAlt || item?.cityName || "",
              takeATripUrl: item?.buttonHref || "#",
              discoverLabel: item?.discoverLabel || "",
            })
          ),
        },
      },
    ],
  };
}

export function getDotCount(slideCount, isMobile, slidesPerView) {
  if (slideCount === 0) return 0;
  if (isMobile) return slideCount;
  return Math.max(1, Math.ceil(slideCount / slidesPerView));
}

export function buildSliderSettings({
  isMobile,
  slidesPerView,
  slidesToScroll,
  onBeforeChange,
}) {
  return {
    centerMode: false,
    centerPadding: isMobile ? "40px" : "0px",
    slidesToShow: slidesPerView,
    slidesToScroll,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 5000,
    speed: 500,
    arrows: false,
    swipeToSlide: true,
    beforeChange: onBeforeChange,
    responsive: [
      { breakpoint: 768, settings: { centerPadding: "30px" } },
      { breakpoint: 480, settings: { centerPadding: "30px" } },
    ],
  };
}

export function resolvePageSlideIndex({
  pageIndex,
  slideCount,
  isMobile,
  slidesPerView,
  slidesToScroll,
}) {
  if (!slideCount) return 0;
  if (isMobile) {
    return Math.min(pageIndex, slideCount - 1);
  }
  const maxLeft = Math.max(0, slideCount - slidesPerView);
  return Math.min(pageIndex * slidesToScroll, maxLeft);
}
