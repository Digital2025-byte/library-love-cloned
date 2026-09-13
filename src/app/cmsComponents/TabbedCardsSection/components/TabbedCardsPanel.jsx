"use client";

import TabbedCardsGrid from "./TabbedCardsGrid";
import TabbedCardsHeader from "./TabbedCardsHeader";
import TabbedCardsTabs from "./TabbedCardsTabs";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { useTabbedCards } from "../hooks/useTabbedCards";
import { DEFAULT_TABBED_CARDS_STYLE } from "../utils/style";

export default function TabbedCardsPanel({
  lang = "en",
  content,
  style = DEFAULT_TABBED_CARDS_STYLE,
}) {
  void lang;
  const { activeTabIndex, setActiveTabIndex } = useTabbedCards(
    content.tabs
  );
  const showLinks = style.showLinks !== false;
  const allCards = (content.tabs || []).flatMap((tab) => tab.cards || []);
  const allLinkParts = showLinks
    ? buildItemBacklinkParts(allCards, content.links || [])
    : null;

  let cardCursor = 0;
  const tabsWithParts = (content.tabs || []).map((tab) => ({
    ...tab,
    cards: (tab.cards || []).map((card) => {
      const parts = allLinkParts?.[cardCursor++];
      return {
        ...card,
        titleParts: parts?.titleParts,
        bodyParts: parts?.bodyParts,
      };
    }),
  }));

  const visibleCards = style.showTabs
    ? tabsWithParts[activeTabIndex]?.cards || []
    : tabsWithParts.flatMap((tab) => tab.cards || []);

  return (
    <>
      <TabbedCardsHeader
        title={content.title}
        subtitle={content.subtitle}
        links={content.links}
        style={style}
      />
      {style.showTabs ? (
        <TabbedCardsTabs
          tabs={content.tabs}
          activeTabIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
          style={style}
        />
      ) : null}
      <TabbedCardsGrid
        key={style.showTabs ? activeTabIndex : "all"}
        cards={visibleCards}
        style={style}
      />
    </>
  );
}
