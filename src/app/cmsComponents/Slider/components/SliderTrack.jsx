"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import SliderSlide from "./SliderSlide";
import SliderArrowNav from "./SliderArrow";
import SliderProgressNav from "./SliderProgressNav";
import { resolveTheme } from "../utils/themes";

const ReactSlick = dynamic(() => import("react-slick"), { ssr: false });

export default function SliderTrack({
  slides = [],
  slideLinkParts = null,
  settings = {},
  lang = "en",
  posParams = "gb",
  cId,
  sliderKey,
  style,
  showArrows = true,
  imageOverlay,
}) {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const colors = resolveTheme(style.theme);

  if (!slides.length) {
    return null;
  }

  const {
    arrows: _ignoredArrows,
    prevArrow: _p,
    nextArrow: _n,
    dots: showProgress = true,
    autoplaySpeed = 5000,
    swipe = true,
    draggable = true,
    waitForAnimate = true,
    cssEase = "ease-in-out",
    touchThreshold = 8,
    adaptiveHeight = false,
    pauseOnHover = true,
    pauseOnFocus = true,
    autoplay = true,
    fade = false,
    infinite = true,
    speed = 700,
    ...slickSettings
  } = settings;

  const enableSwipe = swipe !== false;
  const enableDrag = draggable !== false;
  const enableGesture = enableSwipe || enableDrag;
  const useAdaptiveHeight = Boolean(adaptiveHeight);
  const blockTouch = enableDrag && !enableSwipe;

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (nextPaused) {
      sliderRef.current?.slickPause?.();
    } else {
      sliderRef.current?.slickPlay?.();
    }
  };

  return (
    <div
      className={[
        "slider-hero relative w-full overflow-hidden select-none",
        enableDrag ? "slider-hero--drag" : "",
        useAdaptiveHeight ? "slider-hero--adaptive" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      dir="ltr"
      role="region"
      aria-label="Hero slider"
      style={{
        "--slider-theme-bg": colors.bg,
        "--slider-theme-hover": colors.hoverBg,
        "--slider-theme-icon": colors.icon,
      }}
      onDragStart={(event) => event.preventDefault()}
      onTouchStartCapture={
        blockTouch
          ? (event) => {
              if (event.target.closest("button, a")) {
                return;
              }
              event.stopPropagation();
            }
          : undefined
      }
    >
      <ReactSlick
        ref={sliderRef}
        key={sliderKey ?? lang}
        className="slider-hero-slick !mb-0"
        {...slickSettings}
        arrows={false}
        dots={false}
        fade={Boolean(fade)}
        infinite={infinite !== false}
        speed={Number(speed) || 700}
        cssEase={cssEase}
        autoplay={!isPaused && autoplay !== false}
        autoplaySpeed={Number(autoplaySpeed) || 5000}
        pauseOnHover={pauseOnHover !== false}
        pauseOnFocus={pauseOnFocus !== false}
        waitForAnimate={Boolean(waitForAnimate)}
        swipe={enableGesture}
        draggable={enableDrag}
        touchMove={enableGesture}
        touchThreshold={Number(touchThreshold) || 8}
        adaptiveHeight={useAdaptiveHeight}
        beforeChange={(_, next) => setActiveIndex(next)}
        afterChange={(current) => setActiveIndex(current)}
      >
        {slides.map((slide, index) => (
          <div key={slide.id || `slide-${index}`}>
            <SliderSlide
              slide={slide}
              descriptionParts={slideLinkParts?.[index]?.bodyParts}
              lang={lang}
              posParams={posParams}
              cId={cId}
              priority={index === 0}
              imageOverlay={imageOverlay}
              isActive={index === activeIndex}
              isPaused={isPaused}
              style={style}
              adaptiveHeight={useAdaptiveHeight}
            />
          </div>
        ))}
      </ReactSlick>

      {showArrows ? (
        <SliderArrowNav
          onPrev={() => sliderRef.current?.slickPrev()}
          onNext={() => sliderRef.current?.slickNext()}
          theme={style.theme}
        />
      ) : null}

      {showProgress !== false && slides.length > 1 ? (
        <SliderProgressNav
          slideCount={slides.length}
          activeIndex={activeIndex}
          autoplaySpeed={autoplaySpeed}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onGoTo={(index) => sliderRef.current?.slickGoTo?.(index)}
          theme={style.theme}
        />
      ) : null}
    </div>
  );
}
