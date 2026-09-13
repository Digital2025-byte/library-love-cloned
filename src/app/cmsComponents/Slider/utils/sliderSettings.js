/**
 * Default react-slick settings for the hero Slider.
 * Pass a `settings` prop from the parent to override any of these.
 *
 * `arrows` controls the custom overlay arrows (not slick's built-in ones).
 *
 * @example
 * <Slider
 *   lang={lang}
 *   data={sliderData}
 *   settings={{
 *     autoplay: true,
 *     autoplaySpeed: 6000,
 *     dots: true,
 *     fade: false,
 *     arrows: true,
 *   }}
 * />
 */
export const DEFAULT_SLIDER_SETTINGS = {
  /** Show one full-bleed slide at a time */
  slidesToShow: 1,
  slidesToScroll: 1,

  /** Infinite loop when there is more than one slide */
  infinite: true,

  /** Horizontal slide (set `fade: true` from parent for cross-fade) */
  fade: false,

  /** Auto-advance */
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  pauseOnFocus: true,

  /**
   * Show custom overlay arrows (handled outside react-slick).
   * Slick's own arrows stay off so positioning is reliable.
   */
  arrows: true,
  dots: true,
  dotsClass: "slick-dots slider-hero-dots",

  /** Motion */
  speed: 700,
  cssEase: "ease-in-out",
  waitForAnimate: true,

  /** Accessibility (always LTR for slick — Arabic uses content `dir`) */
  accessibility: true,
  adaptiveHeight: false,
  rtl: false,

  /** Touch */
  swipe: true,
  draggable: true,
  touchThreshold: 8,
};

/**
 * Merge parent overrides on top of defaults.
 * Parent wins for every key it provides.
 * Note: do not force `rtl: true` — slick track breaks under document RTL.
 */
export function mergeSliderSettings(parentSettings = {}) {
  return {
    ...DEFAULT_SLIDER_SETTINGS,
    ...parentSettings,
    rtl: false,
  };
}
