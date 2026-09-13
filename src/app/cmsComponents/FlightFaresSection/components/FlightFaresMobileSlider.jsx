import FlightFareCard from "./FlightFareCard";
import { getImageIndexForPosition } from "../utils/helpers";

export default function FlightFaresMobileSlider({ items, lang, style }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 sm:-mx-6 sm:px-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <FlightFareCard
            key={`${item.id || item.cityId || item.title}-${index}`}
            lang={lang}
            item={item}
            imageIndex={getImageIndexForPosition(items, index)}
            className="h-72 w-[78vw] max-w-80 shrink-0 snap-start sm:h-80 sm:w-[46vw] sm:max-w-none md:h-85 md:w-[42vw]"
            style={style}
          />
        ))}
      </div>
    </div>
  );
}
