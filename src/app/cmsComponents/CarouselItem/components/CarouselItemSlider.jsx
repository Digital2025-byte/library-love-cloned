"use client";

import dynamic from "next/dynamic";
import CustomCard from "@/components/ui/CustomCard";
import { CARD_RADIUS_CLASS } from "../utils/style";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

function resolveTakeUrl(card, lang, posParams) {
  const raw = card?.takeATripUrl || "";
  if (!raw || raw === "#") return raw || "#";
  if (/^https?:\/\//i.test(raw) || raw.startsWith(`/${posParams}/`)) {
    return raw;
  }
  return `/${posParams}/${lang}/our-destinations${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export default function CarouselItemSlider({
  sliderRef,
  settings,
  destinations = [],
  lang = "en",
  posParams = "gb",
  cId,
  style,
}) {
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;

  return (
    <div className="z-10 w-full px-2 py-8">
      <Slider ref={sliderRef} {...settings}>
        {destinations.map((card, index) => (
          <div key={`${card.cityName}-${card.iataCode || index}`} className="px-2">
            <CustomCard
              ImageUrl={card.imageUrl}
              IATACode={card.iataCode}
              CityName={card.cityName}
              CountryName={card.countryName}
              TakeUrl={resolveTakeUrl(card, lang, posParams)}
              discoverLabel={card.discoverLabel}
              imageAlt={card.imageAlt}
              lang={lang}
              cId={cId}
              gradient={style.showOverlay}
              showImage={style.showCardImage}
              showCity={style.showCity}
              showIata={style.showIata}
              showCountry={style.showCountry}
              showButton={style.showButton}
              showHoverDim={style.showHoverDim}
              cardRadiusClass={`${radiusClass} shadow-lg`}
              cityColor={style.cityColor}
              countryColor={style.countryColor}
              overlayColor={style.overlayColor}
              buttonBg={style.buttonBg}
              buttonText={style.buttonText}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
