"use client";

import dynamic from "next/dynamic";
import FillImageCard from "./FillImageCard";
import { getCardKey } from "../utils/helpers";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

function CarouselStyles({ edgePad }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      .cards-carousel-fill .slick-list {
        overflow: hidden;
        margin: 0;
        padding-block: 0 !important;
        padding-inline: ${edgePad}px !important;
      }
      .cards-carousel-fill .slick-track {
        display: flex !important;
        align-items: stretch;
        margin: 0 !important;
      }
      .cards-carousel-fill .slick-slide {
        height: auto;
        float: none;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box;
      }
      .cards-carousel-fill .slick-slide > div {
        height: 100%;
        display: flex;
        padding-inline: 9px;
        box-sizing: border-box;
      }
      .cards-carousel-fill .slick-slide > div > div {
        width: 100%;
        display: flex;
      }
      .cards-carousel-fill:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 2px;
      }

      .cards-carousel-fill--rtl .slick-list {
        transform: scaleX(-1);
      }
      .cards-carousel-fill--rtl .slick-slide {
        transform: scaleX(-1);
      }
    `,
      }}
    />
  );
}

export default function FillImageCarouselSlider({
  sliderKey,
  sliderRef,
  settings,
  cards,
  itemLinkParts,
  lang,
  cId,
  onKeyDown,
  edgePad = 16,
  style,
}) {
  const isRtl = lang === "ar";

  return (
    <div className="relative" onKeyDown={onKeyDown} tabIndex={0}>
      <CarouselStyles edgePad={edgePad} />
      <div
        className={`cards-carousel-fill${isRtl ? " cards-carousel-fill--rtl" : ""}`}
        role="region"
        aria-label="Fill image carousel"
      >
        <Slider key={sliderKey ?? lang} ref={sliderRef} {...settings}>
          {cards.map((card, index) => (
            <div key={getCardKey(card, index)} className="h-full">
              <FillImageCard
                card={card}
                lang={lang}
                cId={cId}
                style={style}
                titleParts={itemLinkParts?.[index]?.titleParts}
                bodyParts={itemLinkParts?.[index]?.bodyParts}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
