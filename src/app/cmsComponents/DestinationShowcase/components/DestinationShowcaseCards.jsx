"use client";

import Image from "next/image";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  CARD_ACTIVE_W_PX,
  CARD_GAP_PX,
  CARD_IMAGE_SIZES,
  CARD_INACTIVE_W_PX,
  CARD_STEP_PX,
} from "../utils/constants";
import { isUsableImageSrc } from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_DESTINATION_SHOWCASE_STYLE,
} from "../utils/style";

export default function DestinationShowcaseCards({
  infiniteList,
  destinationsLength,
  virtualIndex,
  jumping,
  lang = "en",
  onCardClick,
  style = DEFAULT_DESTINATION_SHOWCASE_STYLE,
}) {
  const radiusClass = CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const overlayCss = getThemeColorCss(style.cardOverlayColor, "main");

  return (
    <div className="relative mt-12 flex w-full items-center justify-start overflow-hidden py-4 md:mt-0">
      <div className="relative h-[220px] w-full md:h-[230px]">
        <div
          className={`flex h-full items-end ${
            jumping
              ? ""
              : "transition-transform duration-900 ease-[cubic-bezier(0.33,1,0.68,1)]"
          }`}
          style={{
            gap: `${CARD_GAP_PX}px`,
            paddingInlineStart: `calc(50% - ${CARD_ACTIVE_W_PX / 2}px)`,
            transform:
              lang === "ar"
                ? `translateX(${virtualIndex * CARD_STEP_PX}px)`
                : `translateX(-${virtualIndex * CARD_STEP_PX}px)`,
          }}
        >
          {infiniteList.map((dest, index) => {
            const isActive = index === virtualIndex;
            const mappedIndex =
              destinationsLength > 0 ? index % destinationsLength : 0;
            const imageSrc = dest.cardImageUrl || dest.imageUrl;

            return (
              <button
                key={`${dest.id}-${index}`}
                type="button"
                onClick={() => onCardClick(mappedIndex)}
                className={`relative shrink-0 cursor-pointer overflow-hidden shadow-lg ${radiusClass} ${
                  jumping ? "" : "transition-all duration-300"
                } ${
                  isActive
                    ? "ring-3 shadow-2xl ring-50/80"
                    : "opacity-80 hover:opacity-100"
                }`}
                style={{
                  width: `${isActive ? CARD_ACTIVE_W_PX : CARD_INACTIVE_W_PX}px`,
                  height: isActive ? "100%" : "75%",
                }}
                aria-label={dest.name || "Destination"}
              >
                {isUsableImageSrc(imageSrc) ? (
                  <Image
                    src={imageSrc}
                    alt={dest.imageAlt || dest.name || "Destination"}
                    fill
                    sizes={CARD_IMAGE_SIZES}
                    className="object-cover"
                    unoptimized={
                      typeof imageSrc === "string" && imageSrc.startsWith("http")
                    }
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary-700" aria-hidden />
                )}
                {style.showCardOverlay ? (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${overlayCss} 30%, transparent), transparent)`,
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
