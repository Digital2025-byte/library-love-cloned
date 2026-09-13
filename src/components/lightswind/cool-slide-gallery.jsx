"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/components/lib/utils";

const DEFAULT_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    alt: "Mountain peaks at golden hour",
    title: "Alpine Summit",
    subtitle: "Swiss Alps, 2024",
    badge: "Featured",
  },
  {
    src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&auto=format&fit=crop",
    alt: "Misty forest trail",
    title: "Forest Trail",
    subtitle: "Oregon, USA",
    badge: "Nature",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
    alt: "Starry night over mountains",
    title: "Midnight Sky",
    subtitle: "Patagonia, Chile",
    badge: "Astro",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    alt: "Desert dunes at sunset",
    title: "Sand Waves",
    subtitle: "Sahara Desert",
    badge: "Desert",
  },
  {
    src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop",
    alt: "Tropical ocean shore",
    title: "Ocean Horizon",
    subtitle: "Maldives",
    badge: "Ocean",
  },
];

const EASING_MAP = {
  smooth: [0.22, 1, 0.36, 1],
  spring: [0.34, 1.56, 0.64, 1],
  bouncy: [0.5, 1.7, 0.5, 1],
  snappy: [0.16, 1, 0.3, 1],
};

function getTitleStyles(position) {
  const base = { position: "absolute", pointerEvents: "none" };
  switch (position) {
    case "top-left":
      return { ...base, top: 0, left: 0, right: 0, textAlign: "start" };
    case "top-right":
      return { ...base, top: 0, left: 0, right: 0, textAlign: "end" };
    case "center":
      return {
        ...base,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        width: "100%",
      };
    case "bottom-right":
      return { ...base, bottom: 0, left: 0, right: 0, textAlign: "end" };
    case "bottom-left":
    default:
      return { ...base, bottom: 0, left: 0, right: 0, textAlign: "start" };
  }
}

function getGradientForPosition(position, overlayCss) {
  const color = overlayCss || "#000000";
  switch (position) {
    case "top-left":
    case "top-right":
      return `linear-gradient(180deg, color-mix(in srgb, ${color} 75%, transparent) 0%, transparent 60%)`;
    case "center":
      return `radial-gradient(ellipse at center, color-mix(in srgb, ${color} 60%, transparent) 0%, transparent 70%)`;
    case "bottom-left":
    case "bottom-right":
    default:
      return `linear-gradient(0deg, color-mix(in srgb, ${color} 80%, transparent) 0%, transparent 65%)`;
  }
}

/**
 * Lightswind CoolSlideGallery — official coverflow (stage + outside controls).
 * @see https://lightswind.com/components/cool-slide-gallery
 */
export default function CoolSlideGallery({
  slides: slidesProp,
  cardWidth = 380,
  cardHeight = 440,
  radius = 5,
  tilt = 14,
  sideTilt = 6,
  gap = 8,
  dimOpacity = 55,
  autoplay = false,
  autoplayDirection = "right-to-left",
  autoplayDelay = 2.8,
  animationDuration = 0.6,
  easing = "smooth",
  showTitle = true,
  showSubtitle = true,
  titlePosition = "bottom-left",
  showArrows = true,
  showDots = true,
  showCounter = false,
  showBadge = true,
  showCardImage = true,
  titleCss,
  subtitleCss,
  titleFontWeight,
  subtitleFontWeight,
  overlayCss,
  badgeBgCss,
  badgeTextCss,
  arrowsCss,
  dotsCss,
  controlsBgCss,
  clickable = true,
  draggable = true,
  dragThreshold = 45,
  keyboardNavigation = true,
  maxVisible = 2,
  depth = 230,
  scaleStep = 0.15,
  perspective = 1500,
  className,
  onSlideChange,
}) {
  const slides = slidesProp?.length ? slidesProp : DEFAULT_SLIDES;
  const count = slides.length;

  const [active, setActive] = useState(0);
  const lockRef = useRef(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const touchStartX = useRef(null);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, Math.max(50, animationDuration * 1000));
  }, [animationDuration]);

  const step = useCallback(
    (dir) => {
      if (lockRef.current) return;
      lock();
      setActive((current) => {
        const next = (((current + dir) % count) + count) % count;
        onSlideChange?.(next, slides[next]);
        return next;
      });
    },
    [count, lock, onSlideChange, slides]
  );

  const goTo = useCallback(
    (index) => {
      if (lockRef.current || index === active) return;
      lock();
      setActive(index);
      onSlideChange?.(index, slides[index]);
    },
    [active, lock, onSlideChange, slides]
  );

  useEffect(() => {
    if (!keyboardNavigation) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardNavigation, step]);

  useEffect(() => {
    if (!autoplay || count < 2) return undefined;
    const ms = Math.max(300, autoplayDelay * 1000);
    const dir = autoplayDirection === "left-to-right" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayDelay, autoplayDirection, count, step]);

  const handlePointerDown = (event) => {
    if (!draggable || lockRef.current) return;
    isDragging.current = true;
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) > dragThreshold) {
      step(delta > 0 ? -1 : 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const delta = touchStartX.current - event.changedTouches[0].clientX;
    if (Math.abs(delta) > dragThreshold) {
      step(delta > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  const ease = EASING_MAP[easing] || EASING_MAP.smooth;
  const transition = {
    type: "tween",
    duration: animationDuration,
    ease,
  };

  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) *
    (Math.min(cardWidth, cardHeight) / 2);
  const dimValue = 1 - Math.max(0, Math.min(100, dimOpacity)) / 100;

  return (
    <div
      className={cn(
        "relative flex w-full select-none flex-col items-center justify-center overflow-hidden",
        className
      )}
      style={{
        minHeight: cardHeight + 80,
        perspective: `${perspective}px`,
        touchAction: "none",
        cursor: draggable ? "grab" : "default",
      }}
      tabIndex={keyboardNavigation ? 0 : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label="Cool Slide Gallery"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          position: "relative",
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        {slides.map((slide, index) => {
          let rel = index - active;
          if (rel > count / 2) rel -= count;
          if (rel < -count / 2) rel += count;

          const abs = Math.abs(rel);
          const visible = abs <= maxVisible;
          const isActive = rel === 0;
          const scale = Math.max(0.3, 1 - abs * scaleStep);
          const tx = rel * (gap * 30);
          const tz = -abs * depth;
          const rotateY = -rel * tilt;
          const rotateZ = rel * sideTilt;

          return (
            <motion.div
              key={index}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: cardWidth,
                height: cardHeight,
                borderRadius: effectiveRadius,
                overflow: "hidden",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                pointerEvents: visible && !autoplay ? "auto" : "none",
                willChange: "transform, opacity",
                cursor: clickable && visible && !isActive ? "pointer" : "default",
              }}
              animate={{
                x: `calc(-50% + ${tx}px)`,
                y: "-50%",
                z: tz,
                rotateY,
                rotateZ,
                scale,
                opacity: visible ? 1 : 0,
              }}
              transition={transition}
              onClick={() => {
                if (clickable && !isDragging.current && !isActive && visible) {
                  goTo(index);
                }
              }}
              aria-label={slide.title ?? slide.alt ?? `Slide ${index + 1}`}
              aria-hidden={!visible}
            >
              {showCardImage ? (
                <img
                  src={slide.src}
                  alt={slide.alt ?? slide.title ?? `Slide ${index + 1}`}
                  draggable={false}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              ) : null}

              {(showTitle && slide.title) ||
              (showSubtitle && slide.subtitle) ||
              (showBadge && slide.badge) ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: getGradientForPosition(titlePosition, overlayCss),
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ ...getTitleStyles(titlePosition), padding: "20px 22px" }}>
                    {slide.badge && showBadge ? (
                      <span
                        className="mb-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm"
                        style={{
                          color: badgeTextCss || "#ffffff",
                          backgroundColor: badgeBgCss
                            ? `color-mix(in srgb, ${badgeBgCss} 20%, transparent)`
                            : "rgba(255,255,255,0.2)",
                          borderColor: badgeBgCss
                            ? `color-mix(in srgb, ${badgeBgCss} 30%, transparent)`
                            : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {slide.badge}
                      </span>
                    ) : null}
                    {showTitle && slide.title ? (
                      <p
                        className={titleCss ? "font-bold" : "font-bold text-white"}
                        style={{
                          fontSize: "clamp(18px, 2.5vw, 26px)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.15,
                          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                          whiteSpace: "pre-line",
                          color: titleCss,
                          fontWeight: titleFontWeight ?? 700,
                        }}
                      >
                        {slide.title}
                      </p>
                    ) : null}
                    {showSubtitle && slide.subtitle ? (
                      <p
                        className={
                          subtitleCss
                            ? "mt-1 font-medium"
                            : "mt-1 font-medium text-white/75"
                        }
                        style={{
                          fontSize: "clamp(11px, 1.2vw, 14px)",
                          letterSpacing: "0.01em",
                          textShadow: "0 1px 6px rgba(0,0,0,0.4)",
                          color: subtitleCss,
                          fontWeight: subtitleFontWeight ?? 500,
                        }}
                      >
                        {slide.subtitle}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : null}

              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000000",
                  pointerEvents: "none",
                }}
                animate={{ opacity: isActive ? 0 : dimValue }}
                transition={transition}
              />
            </motion.div>
          );
        })}
      </div>

      {showArrows || showDots || showCounter ? (
      <div
        className="mt-6 flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-md"
        style={{
          pointerEvents: "all",
          backgroundColor: controlsBgCss
            ? `color-mix(in srgb, ${controlsBgCss} 18%, transparent)`
            : "rgba(255,255,255,0.05)",
          borderColor: controlsBgCss
            ? `color-mix(in srgb, ${controlsBgCss} 22%, transparent)`
            : "rgba(255,255,255,0.1)",
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        onTouchEnd={(event) => event.stopPropagation()}
      >
        {showArrows ? (
          <motion.button
            type="button"
            aria-label="Previous slide"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            className="rounded-full p-2 opacity-60 transition-opacity hover:bg-white/10 hover:opacity-100"
            style={{ color: arrowsCss || "#ffffff" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CaretLeftIcon size={16} weight="bold" />
          </motion.button>
        ) : null}

        {showDots ? (
          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <motion.button
                key={`${slide.src}-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index);
                }}
                className="cursor-pointer rounded-full transition-colors"
                animate={{
                  width: active === index ? 24 : 6,
                  height: 6,
                  opacity: active === index ? 1 : 0.4,
                }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.45 }}
                style={{
                  minWidth: 6,
                  backgroundColor: dotsCss || "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        ) : null}

        {showCounter ? (
          <span className="px-1 text-xs font-medium text-white/60">
            {active + 1} / {count}
          </span>
        ) : null}

        {showArrows ? (
          <motion.button
            type="button"
            aria-label="Next slide"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            className="rounded-full p-2 opacity-60 transition-opacity hover:bg-white/10 hover:opacity-100"
            style={{ color: arrowsCss || "#ffffff" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CaretRightIcon size={16} weight="bold" />
          </motion.button>
        ) : null}
      </div>
      ) : null}
    </div>
  );
}
