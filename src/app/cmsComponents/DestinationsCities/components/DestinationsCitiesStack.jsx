"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CarouselCard from "@/components/ui/CarouselCard";
import {
  CARD_RADIUS_BOTTOM_CLASS,
  CARD_RADIUS_CLASS,
  DEFAULT_DESTINATIONS_CITIES_STYLE,
} from "../utils/style";

export default function DestinationsCitiesStack({
  cities = [],
  cityLinkParts = null,
  lang = "en",
  posParams = "gb",
  style = DEFAULT_DESTINATIONS_CITIES_STYLE,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [transitionInfo, setTransitionInfo] = useState({ from: 0, to: 0 });
  const totalCards = cities.length;

  const handleDragEnd = (_event, info) => {
    const dragDistance = info.offset.x;

    if (dragDistance > 100) {
      setActiveIndex((prevIndex) => {
        const nextIndex = Math.min(prevIndex + 1, totalCards - 1);
        if (nextIndex === prevIndex) return prevIndex;
        setDirection(1);
        setTransitionInfo({ from: prevIndex, to: nextIndex });
        return nextIndex;
      });
    } else if (dragDistance < -100) {
      setActiveIndex((prevIndex) => {
        const nextIndex = Math.max(prevIndex - 1, 0);
        if (nextIndex === prevIndex) return prevIndex;
        setDirection(-1);
        setTransitionInfo({ from: prevIndex, to: nextIndex });
        return nextIndex;
      });
    }
  };

  if (!totalCards) {
    return null;
  }

  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.full;
  const panelRadiusClass =
    CARD_RADIUS_BOTTOM_CLASS[style.cardRadius] ??
    CARD_RADIUS_BOTTOM_CLASS.full;

  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-6">
      <div className="relative ms-auto h-[400px] w-full min-w-0 max-w-xl sm:max-w-lg lg:h-[550px]">
        <motion.div
          className="relative h-full w-full"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cities.map((card, index) => {
            const stackIndex = index - activeIndex;

            return (
              <CarouselCard
                key={`${card.cityName}-${card.IATACode || index}`}
                IATACode={card.IATACode}
                cityName={card.cityName}
                numberOfFlightsPerWeek={card.numberOfFlightsPerWeek}
                description={card.description}
                descriptionParts={cityLinkParts?.[index]?.bodyParts}
                linkStyle={style}
                showLinks={style.showLinks !== false}
                imageUrl={card.imageUrl}
                imageAlt={card.imageAlt}
                duration={card.duration}
                title={card.title}
                subtitle={card.subtitle}
                flights={card.flights}
                versionCard={card.versionCard}
                buttonLabel={card.buttonLabel}
                isActive={index === activeIndex}
                stackIndex={stackIndex}
                direction={direction}
                isLeaving={
                  index === transitionInfo.from && index !== activeIndex
                }
                isEntering={
                  index === transitionInfo.to && index === activeIndex
                }
                onSelect={() => {
                  if (index === activeIndex) return;
                  const dir = index > activeIndex ? 1 : -1;
                  setDirection(dir);
                  setTransitionInfo({ from: activeIndex, to: index });
                  setActiveIndex(index);
                }}
                onDragEnd={handleDragEnd}
                posParams={posParams}
                lang={lang}
                showImage={style.showCardImage}
                showCity={style.showCity}
                showOrigin={style.showOrigin}
                showNew={style.showNew}
                showFlights={style.showFlights}
                showDuration={style.showDuration}
                showDescription={style.showCardDescription}
                showPanel={style.showPanel}
                showInactiveDim={style.showInactiveDim}
                showButton={style.showButton}
                cityColor={style.cityColor}
                originColor={style.originColor}
                originBg={style.originBg}
                metaColor={style.metaColor}
                bodyColor={style.bodyColor}
                panelBg={style.panelBg}
                overlayColor={style.overlayColor}
                buttonBg={style.buttonBg}
                buttonText={style.buttonText}
                cardRadiusClass={radiusClass}
                panelRadiusClass={panelRadiusClass}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
