"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import PageContentContainer from "@/components/layout/PageContentContainer";
import SliderSlideContent from "./SliderSlideContent";
import { resolveImageOverlay } from "../utils/imageOverlay";

export default function SliderSlide({
  slide,
  descriptionParts,
  lang = "en",
  posParams = "gb",
  cId,
  priority = false,
  imageOverlay,
  isActive = false,
  isPaused = false,
  style,
  adaptiveHeight = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isActive && !isPaused) {
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
      if (!isActive) {
        video.currentTime = 0;
      }
    }
  }, [isActive, isPaused]);

  if (!slide) {
    return null;
  }

  const overlay = resolveImageOverlay(imageOverlay);
  const hasVideo = Boolean(slide.video);
  const hasImage = Boolean(slide.image);

  const heightClass = adaptiveHeight
    ? "min-h-[200px] sm:min-h-[240px]"
    : "min-h-[280px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[500px]";
  const contentHeightClass = adaptiveHeight ? "h-auto" : `h-full ${heightClass}`;

  return (
    <div
      className={`relative box-border w-full overflow-hidden leading-normal ${heightClass}`}
      draggable={false}
    >
      {hasVideo || hasImage ? (
        <div className="pointer-events-none absolute inset-0 h-full w-full select-none">
          {hasVideo ? (
            <video
              ref={videoRef}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
              src={slide.video}
              poster={slide.image || undefined}
              muted
              loop
              playsInline
              autoPlay={isActive && !isPaused}
              preload={priority || isActive ? "auto" : "metadata"}
              draggable={false}
              aria-label={slide.alt || slide.title || "Slide video"}
            />
          ) : (
            <Image
              src={slide.image}
              alt={slide.alt || slide.title || "Slide"}
              fill
              draggable={false}
              className="pointer-events-none object-cover object-center"
              priority={priority}
              sizes="100vw"
            />
          )}
          {overlay ? (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: overlay.backgroundImage }}
              aria-hidden
            />
          ) : null}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-primary-800" aria-hidden />
      )}

      <div
        className={`pointer-events-none relative z-[1] flex w-full items-end py-8 leading-normal sm:py-10 md:py-12 lg:py-16 ${contentHeightClass}`}
      >
        <PageContentContainer className="w-full">
          <SliderSlideContent
            lang={lang}
            posParams={posParams}
            cId={cId}
            title={slide.title}
            subtitle={slide.subtitle}
            description={slide.description}
            descriptionParts={descriptionParts}
            buttonText={slide.buttonText}
            ctaHref={slide.ctaHref}
            style={style}
          />
        </PageContentContainer>
      </div>
    </div>
  );
}
