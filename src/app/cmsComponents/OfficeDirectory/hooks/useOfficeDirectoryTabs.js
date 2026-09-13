"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Accessible tab state for the office city tabs — mirrors the source
 * `useOfficeTabs`: roving tabindex, arrow/Home/End keyboard navigation
 * (RTL-aware), and stable tab/panel id pairs for ARIA wiring.
 *
 * Index-based because the CMS tabs come from editable content.
 *
 * @param {number} count number of tabs
 */
export default function useOfficeDirectoryTabs(count) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const baseId = useId();

  // Keep the active tab valid when the tab count shrinks.
  useEffect(() => {
    if (count > 0 && activeIndex > count - 1) {
      setActiveIndex(0);
    }
  }, [count, activeIndex]);

  const focusTab = useCallback((index) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  }, []);

  const onTabKeyDown = useCallback(
    (event, currentIndex) => {
      if (count <= 0) {
        return;
      }

      const isRtl =
        typeof window !== "undefined" &&
        getComputedStyle(event.currentTarget).direction === "rtl";
      const nextKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const prevKey = isRtl ? "ArrowRight" : "ArrowLeft";

      if (event.key === nextKey) {
        event.preventDefault();
        focusTab((currentIndex + 1) % count);
        return;
      }

      if (event.key === prevKey) {
        event.preventDefault();
        focusTab((currentIndex - 1 + count) % count);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusTab(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusTab(count - 1);
      }
    },
    [count, focusTab]
  );

  const tabId = (index) => `${baseId}-tab-${index}`;
  const panelId = (index) => `${baseId}-panel-${index}`;
  const setTabRef = (index) => (node) => {
    tabRefs.current[index] = node;
  };

  return {
    activeIndex,
    setActiveIndex,
    onTabKeyDown,
    tabId,
    panelId,
    setTabRef,
  };
}
