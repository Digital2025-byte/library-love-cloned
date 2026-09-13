import TabbedCardsCard from "./TabbedCardsCard";
import { CARD_GAP_CLASS, DEFAULT_TABBED_CARDS_STYLE } from "../utils/style";

export default function TabbedCardsGrid({
  cards,
  style = DEFAULT_TABBED_CARDS_STYLE,
}) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return null;
  }

  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;

  return (
    <div
      className={`flex snap-x snap-mandatory overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] scrollbar-none lg:grid lg:snap-none lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden ${gapClass}`}
      role="list"
    >
      {cards.map((card, index) => (
        <div
          key={`${card.title}-${index}`}
          role="listitem"
          className="w-[82%] shrink-0 snap-start sm:w-[70%] md:w-[55%] lg:w-auto lg:shrink"
        >
          <TabbedCardsCard card={card} style={style} />
        </div>
      ))}
    </div>
  );
}
