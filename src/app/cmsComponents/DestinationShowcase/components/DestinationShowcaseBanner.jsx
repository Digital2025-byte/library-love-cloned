"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getObjectFitClass } from "@/app/cmsComponents/shared/backgroundImage";
import DestinationShowcaseBlueLayer from "./DestinationShowcaseBlueLayer";
import DestinationShowcaseContent from "./DestinationShowcaseContent";
import DestinationShowcaseNav from "./DestinationShowcaseNav";
import DestinationShowcaseCards from "./DestinationShowcaseCards";
import DestinationShowcaseControls from "./DestinationShowcaseControls";
import {
  HERO_IMAGE_QUALITY,
  HERO_IMAGE_SIZES,
} from "../utils/constants";
import { isUsableImageSrc } from "../utils/helpers";
import {
  BANNER_RADIUS_CLASS,
  DEFAULT_DESTINATION_SHOWCASE_STYLE,
} from "../utils/style";

export default function DestinationShowcaseBanner({
  lang = "en",
  exploreLabel,
  current,
  activeIndex,
  direction,
  virtualIndex,
  jumping,
  infiniteList,
  destinationsLength,
  onPrev,
  onNext,
  onCardClick,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  if (!current) return null;

  const radiusClass =
    BANNER_RADIUS_CLASS[style.bannerRadius] ?? BANNER_RADIUS_CLASS.sm;
  const heroSrc = current.imageUrl;

  return (
    <div className={`relative min-h-[540px] overflow-hidden shadow-xl ${radiusClass}`}>
      <div className="absolute inset-0 min-h-[540px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.01, opacity: 1 }}
            transition={{ duration: 0.3, ease: "circOut", delay: 0.01 }}
            className="absolute inset-0"
          >
            {style.showHeroImage && isUsableImageSrc(heroSrc) ? (
              <Image
                src={heroSrc}
                alt={current.imageAlt || current.name || "Destination"}
                fill
                sizes={HERO_IMAGE_SIZES}
                quality={HERO_IMAGE_QUALITY}
                className={getObjectFitClass(style)}
                priority={activeIndex === 0}
                unoptimized={
                  typeof heroSrc === "string" && heroSrc.startsWith("http")
                }
              />
            ) : (
              <div className="absolute inset-0 bg-primary-800" aria-hidden />
            )}
          </motion.div>
        </AnimatePresence>
        {style.showOverlay ? (
          <DestinationShowcaseBlueLayer color={style.overlayColor} />
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-[540px] flex-col overflow-hidden">
        <div className="relative flex flex-1 flex-col justify-between gap-6 pb-4 pt-10 sm:pt-12 md:flex-row md:items-stretch md:gap-6 md:px-12 md:pb-6 md:pt-14 lg:px-16">
          <div className="relative z-10 w-full max-w-xl shrink-0 px-5 sm:px-8 md:flex md:flex-1 md:flex-col md:justify-center md:px-0">
            <DestinationShowcaseContent
              name={current.name}
              description={current.description}
              titleParts={current.titleParts}
              bodyParts={current.bodyParts}
              activeIndex={activeIndex}
              direction={direction}
              style={style}
            />
            <DestinationShowcaseNav
              exploreLabel={exploreLabel}
              exploreHref={current.exploreLink}
              style={style}
            />
          </div>

          {style.showCards ? (
            <div className="relative z-20 w-full min-w-0 max-w-full overflow-hidden md:flex md:w-[min(100%,560px)] md:shrink-0 md:items-end md:self-end lg:w-[min(100%,640px)]">
              <DestinationShowcaseCards
                infiniteList={infiniteList}
                destinationsLength={destinationsLength}
                virtualIndex={virtualIndex}
                jumping={jumping}
                lang={lang}
                onCardClick={onCardClick}
                style={style}
              />
            </div>
          ) : null}
        </div>

        <div className="relative z-30 flex shrink-0 justify-center px-5 pb-6 pt-2 sm:pb-8">
          <DestinationShowcaseControls
            lang={lang}
            activeIndex={activeIndex}
            count={destinationsLength}
            onPrev={onPrev}
            onNext={onNext}
            onDotClick={onCardClick}
            style={style}
          />
        </div>
      </div>
    </div>
  );
}
