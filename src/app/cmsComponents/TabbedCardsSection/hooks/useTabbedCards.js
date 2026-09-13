import { useEffect, useState } from "react";

export function useTabbedCards(tabs = []) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    if (tabs.length === 0) {
      setActiveTabIndex(0);
      return;
    }

    if (activeTabIndex > tabs.length - 1) {
      setActiveTabIndex(0);
    }
  }, [activeTabIndex, tabs.length]);

  const activeCards = Array.isArray(tabs[activeTabIndex]?.cards)
    ? tabs[activeTabIndex].cards
    : [];

  return {
    activeTabIndex,
    setActiveTabIndex,
    activeCards,
  };
}
