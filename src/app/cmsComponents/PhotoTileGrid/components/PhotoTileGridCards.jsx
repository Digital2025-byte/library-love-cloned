import CustomCard from "@/components/ui/CustomCard";
import {
  CARD_GAP_CLASS,
  CARD_RADIUS_CLASS,
  DEFAULT_PHOTO_TILE_GRID_STYLE,
} from "../utils/style";

export default function PhotoTileGridCards({
  lang = "en",
  destinations = [],
  cId,
  style = DEFAULT_PHOTO_TILE_GRID_STYLE,
}) {
  if (!destinations.length) {
    return null;
  }

  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;

  return (
    <div className={`mt-4 grid w-full grid-cols-1 py-4 sm:grid-cols-2 lg:grid-cols-3 ${gapClass}`}>
      {destinations.map((card) => (
        <CustomCard
          key={`${card.cityName}-${card.iataCode}-${card.imageUrl}`}
          ImageUrl={card.imageUrl}
          IATACode={card.iataCode}
          CityName={card.cityName}
          CountryName={card.countryName}
          TakeUrl={card.takeATripUrl}
          discoverLabel={card.discoverLabel}
          imageAlt={card.imageAlt}
          lang={lang}
          cId={cId}
          showImage={style.showCardImage}
          showCity={style.showCity}
          showIata={style.showIata}
          showCountry={style.showCountry}
          showButton={style.showButton}
          gradient={style.showOverlay}
          showHoverDim={style.showHoverDim}
          cardRadiusClass={`${radiusClass} shadow-lg`}
          cityColor={style.cityColor}
          countryColor={style.countryColor}
          overlayColor={style.overlayColor}
          buttonBg={style.buttonBg}
          buttonText={style.buttonText}
        />
      ))}
    </div>
  );
}
