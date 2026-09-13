"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { pageContentPadding } from "@/styles/layout";
import { fallingCardEasing } from "../utils/easing";
import { isUsableImageSrc } from "../utils/helpers";
import { resolveFallingCardsSettings } from "../utils/style";

function pickCardCount(mode) {
  if (mode === "one") return 1;
  if (mode === "two") return 2;
  return Math.random() < 0.5 ? 1 : 2;
}

export default function AnimatedFallingCards({ images = [], style }) {
  const settings = resolveFallingCardsSettings(style);
  const [activeCards, setActiveCards] = useState([]);
  const cardIdRef = useRef(0);
  const sectionRef = useRef(null);
  const spawnTimeoutRef = useRef(null);
  const imagesRef = useRef(images);
  const settingsRef = useRef(settings);
  imagesRef.current = images;
  settingsRef.current = settings;

  const removeCard = (cardId) => {
    setActiveCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  useEffect(() => {
    if (!images.length) {
      setActiveCards([]);
      return undefined;
    }

    setActiveCards([]);

    const nextDelayMs = () => {
      const { spawnBaseMs, spawnJitterMs } = settingsRef.current;
      return spawnBaseMs + Math.random() * spawnJitterMs;
    };

    const spawnCards = () => {
      const currentImages = imagesRef.current;
      const currentSettings = settingsRef.current;
      if (!currentImages.length) return;

      const numCards = pickCardCount(currentSettings.cardsPerSpawn);
      const newCards = [];

      for (let i = 0; i < numCards; i += 1) {
        const randomImage =
          currentImages[Math.floor(Math.random() * currentImages.length)];
        const startDelay =
          numCards === 2 && i === 1 ? 0.8 : Math.random() * 0.3;

        newCards.push({
          id: cardIdRef.current++,
          image: randomImage,
          leftPct: Math.random() * 78,
          startDelay,
        });
      }

      setActiveCards((prev) => [...prev, ...newCards]);
    };

    let cancelled = false;
    const startId = requestAnimationFrame(() => {
      if (cancelled) return;
      spawnCards();

      const scheduleNext = () => {
        spawnTimeoutRef.current = setTimeout(() => {
          spawnCards();
          scheduleNext();
        }, nextDelayMs());
      };

      spawnTimeoutRef.current = setTimeout(scheduleNext, nextDelayMs());
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(startId);
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
      }
    };
  }, [
    images.length,
    settings.fallDuration,
    settings.spawnBaseMs,
    settings.spawnJitterMs,
    settings.cardsPerSpawn,
  ]);

  if (!images.length) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-1 ${pageContentPadding}`}
    >
      <div
        ref={sectionRef}
        className="relative mx-auto h-full w-full max-w-7xl overflow-hidden"
      >
        <AnimatePresence>
          {activeCards.map((card) => {
            const sectionHeight = sectionRef.current?.offsetHeight || 700;

            return (
              <div
                key={card.id}
                className="absolute top-0"
                style={{ left: `${card.leftPct}%` }}
              >
                <motion.div
                  initial={{ y: -150, opacity: 0 }}
                  animate={{
                    y: sectionHeight + 150,
                    opacity: [0, 1, 1, 0.9, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: settings.fallDuration,
                    delay: card.startDelay || 0,
                    ease: fallingCardEasing,
                    times: [0, 0.1, 0.5, 0.9, 1],
                  }}
                  onAnimationComplete={() => removeCard(card.id)}
                >
                  <div className={settings.cardSizeClass}>
                    {isUsableImageSrc(card.image?.src) ? (
                      <Image
                        src={card.image.src}
                        alt={card.image?.alt || "Travel experience"}
                        width={settings.imageSize.width}
                        height={settings.imageSize.height}
                        className="h-full w-full object-cover"
                        sizes={`${settings.imageSize.width}px`}
                        quality={75}
                      />
                    ) : null}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
