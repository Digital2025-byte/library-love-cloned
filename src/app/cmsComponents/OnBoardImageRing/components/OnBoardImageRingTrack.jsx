"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  CARD_ASPECT,
  CARD_GAP_PX,
  CONCAVE_PUSH,
  LG_MIN_PX,
  RING_PERSPECTIVE,
  VISIBLE_COUNT,
  VISIBLE_COUNT_LG,
  VISIBLE_COUNT_XL,
  XL_MIN_PX,
} from "../utils/constants";
import { isUsableImageSrc } from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_ON_BOARD_IMAGE_RING_STYLE,
} from "../utils/style";

function visibleCountForWidth(width) {
  if (width >= XL_MIN_PX) return VISIBLE_COUNT_XL;
  if (width >= LG_MIN_PX) return VISIBLE_COUNT_LG;
  return VISIBLE_COUNT;
}

/**
 * Concave cylinder: cards sit on the INNER surface.
 * Center goes back (tight / smaller). Left & right come forward (wide / taller).
 * Radius is sized so the current visible count spans the full viewport.
 */
function layoutForWidth(containerWidth, count, gapPx) {
  const usable = Math.max(containerWidth, 320);
  const visible = visibleCountForWidth(usable);
  const angle = count > 0 ? 360 / count : 0;
  const edgeSteps = Math.floor((visible - 1) / 2);
  const edgeRad = ((angle * edgeSteps) * Math.PI) / 180;
  const radius =
    (usable * 0.5) / Math.max(Math.sin(edgeRad) || 0.35, 0.2);

  const packedWidth = 2 * radius * Math.tan(Math.PI / Math.max(count, 2));
  const gap = Math.max(0, Number(gapPx) || 0);
  const cardWidth = Math.round(
    Math.min(420, Math.max(120, packedWidth - gap))
  );

  return {
    cardWidth,
    cardHeight: Math.round(cardWidth * CARD_ASPECT),
    radius,
    angle,
    pushZ: radius * CONCAVE_PUSH,
  };
}

export default function OnBoardImageRingTrack({
  images = [],
  captions = [],
  lang = "en",
  imageGap = CARD_GAP_PX,
  style = DEFAULT_ON_BOARD_IMAGE_RING_STYLE,
}) {
  void lang;

  const viewportRef = useRef(null);
  const ringRef = useRef(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const currentRotation = useRef(0);

  const count = images.length;
  const rotationY = useMotionValue(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const { cardWidth, cardHeight, radius, angle, pushZ } = useMemo(
    () => layoutForWidth(containerWidth, count, imageGap),
    [containerWidth, count, imageGap]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;

    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const applyTransform = (value) => {
    if (!ringRef.current) return;
    ringRef.current.style.transform = `translateZ(${pushZ}px) rotateY(${value}deg)`;
  };

  useEffect(() => {
    applyTransform(rotationY.get());
    const unsubscribe = rotationY.on("change", (latest) => {
      currentRotation.current = latest;
      applyTransform(latest);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotationY, pushZ]);

  const onPointerDown = (event) => {
    isDragging.current = true;
    lastX.current = event.clientX;
    velocity.current = 0;
    rotationY.stop();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging.current) return;
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    // Invert so the strip follows the pointer (drag left → cards move left).
    velocity.current = -delta * 0.35;
    rotationY.set(currentRotation.current + velocity.current);
  };

  const onPointerUp = (event) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }

    if (!angle) return;
    const initial = rotationY.get();
    const boost = velocity.current * 14;
    animate(initial, initial + boost, {
      type: "inertia",
      velocity: boost,
      power: 0.82,
      timeConstant: 280,
      restDelta: 0.4,
      modifyTarget: (target) => Math.round(target / angle) * angle,
      onUpdate: (latest) => rotationY.set(latest),
    });
    velocity.current = 0;
  };

  if (!count) return null;

  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.none;
  const overlayCss = getThemeColorCss(style.overlayColor, "foreground");
  const captionCss = getThemeColorCss(style.captionColor, "white");

  return (
    <div
      ref={viewportRef}
      className="relative h-full w-full touch-none select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="presentation"
      style={{
        perspective: `${RING_PERSPECTIVE}px`,
        perspectiveOrigin: "50% 46%",
        cursor: "grab",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: cardWidth,
          height: cardHeight,
          marginLeft: -cardWidth / 2,
          marginTop: -cardHeight / 2,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={ringRef}
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${pushZ}px) rotateY(0deg)`,
          }}
        >
          {images.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className={`absolute inset-0 overflow-hidden bg-cover bg-center bg-no-repeat ${radiusClass}`}
              style={{
                backgroundImage:
                  style.showCardImage && isUsableImageSrc(imageUrl)
                    ? `url(${imageUrl})`
                    : undefined,
                backgroundColor:
                  style.showCardImage && isUsableImageSrc(imageUrl)
                    ? undefined
                    : "var(--color-primary-700)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: `rotateY(${index * angle}deg) translateZ(${-radius}px)`,
              }}
            >
              {style.showOverlay ? (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${overlayCss} 50%, transparent), transparent)`,
                  }}
                />
              ) : null}
              {style.showCaptions && captions[index] ? (
                <p
                  className={`${typography.itemTitle} pointer-events-none absolute bottom-4 start-4 z-10 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] md:bottom-5 md:start-5`}
                  style={{ color: captionCss }}
                >
                  {captions[index]}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
