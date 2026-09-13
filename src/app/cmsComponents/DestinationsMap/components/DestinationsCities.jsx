"use client";

import Image from "next/image";
import { XIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

/**
 * Destination detail card shown when a map marker is selected.
 */
export default function DestinationsCities({
  destination,
  images = [],
  currentImageIndex = 0,
  onClose,
  onNext,
  onPrev,
  onDotClick,
  lang = "en",
}) {
  if (!destination || !images.length) {
    return null;
  }

  const safeIndex = Math.min(
    Math.max(currentImageIndex, 0),
    images.length - 1
  );
  const currentSrc = images[safeIndex];

  return (
    <div
      className="w-[min(100vw-2rem,320px)] overflow-hidden rounded-2xl bg-white shadow-2xl"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="relative h-44 w-full">
        <Image
          src={currentSrc}
          alt={destination.city || destination.name || "Destination"}
          fill
          className="object-cover"
          sizes="320px"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-secondary-2 shadow"
          aria-label="Close"
        >
          <XIcon size={16} weight="bold" />
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute start-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-2 shadow"
              aria-label="Previous image"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-2 shadow"
              aria-label="Next image"
            >
              <CaretRightIcon size={16} weight="bold" />
            </button>
          </>
        ) : null}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-secondary-2">
            {destination.city}
            {destination.code ? ` (${destination.code})` : ""}
          </h3>
          {destination.isNewRoute ? (
            <span className="rounded bg-[#A6CFE0]/30 px-2 py-0.5 text-xs font-medium text-secondary-2">
              {destination.description}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-secondary-2/70">{destination.country}</p>
        {destination.flightType ? (
          <p className="text-sm text-secondary-2/80">{destination.flightType}</p>
        ) : null}
        {destination.flightsPerWeek ? (
          <p className="text-sm text-secondary-2/80">
            {destination.flightsPerWeek}
          </p>
        ) : null}
        {destination.flightDuration ? (
          <p className="text-sm text-secondary-2/80">
            {destination.flightDuration}
          </p>
        ) : null}
        {destination.price ? (
          <p className="text-base font-semibold text-primary-1">
            {destination.price}
          </p>
        ) : null}

        {images.length > 1 ? (
          <div className="flex justify-center gap-1.5 pt-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Image ${index + 1}`}
                onClick={() => onDotClick?.(index)}
                className={`h-2 rounded-full transition-all ${
                  index === safeIndex
                    ? "w-5 bg-primary-2"
                    : "w-2 bg-primary-2/40"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
