import {
  CARD_GAP_CLASS,
  DEFAULT_SIMPLE_GRID_STYLE,
} from "../utils/style";
import SimpleGridCard from "./SimpleGridCard";

export default function SimpleGrid({
  items,
  lang,
  cId,
  style = DEFAULT_SIMPLE_GRID_STYLE,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gapClass}`}>
      {items.map((item, index) => (
        <SimpleGridCard
          key={`${item.title}-${item.userName}-${index}`}
          item={item}
          lang={lang}
          cId={cId}
          style={style}
        />
      ))}
    </div>
  );
}
