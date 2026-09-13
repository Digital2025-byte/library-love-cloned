import {
  CARD_GAP_CLASS,
  DEFAULT_GRID_INFO_STYLE,
} from "../utils/style";
import GridInfoCard from "./GridInfoCard";

export default function GridInfoGrid({
  items,
  lang,
  style = DEFAULT_GRID_INFO_STYLE,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${gapClass}`}>
      {items.map((item, index) => (
        <GridInfoCard
          key={`${item.name}-${item.city}-${index}`}
          item={item}
          lang={lang}
          style={style}
        />
      ))}
    </div>
  );
}
