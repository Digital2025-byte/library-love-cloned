import FlightFareCard from "./FlightFareCard";
import { getImageIndexForPosition } from "../utils/helpers";
import {
  buildFeaturedDesktopLayout,
  DEFAULT_FLIGHT_FARES_STYLE,
} from "../utils/style";

export default function FlightFaresDesktopGrid({ items, lang, style }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const { gridTemplateColumns, slots } = buildFeaturedDesktopLayout(
    style?.columnsOrder || DEFAULT_FLIGHT_FARES_STYLE.columnsOrder
  );

  return (
    <div
      className="hidden min-h-147.5 gap-4 lg:grid lg:auto-rows-42.5 lg:grid-rows-2"
      style={{ gridTemplateColumns }}
    >
      {slots.map(({ index, gridColumn, gridRow }) => {
        const item = items[index];
        if (!item) return null;

        return (
          <FlightFareCard
            key={`${item.id || item.cityId || item.title}-${index}`}
            lang={lang}
            item={item}
            imageIndex={getImageIndexForPosition(items, index)}
            style={style}
            gridStyle={{ gridColumn, gridRow }}
          />
        );
      })}
    </div>
  );
}
