"use client";

import { useCallback, useRef } from "react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_MEALS_TABBED_STYLE } from "../utils/style";

export default function MealsDescriptionTabs({
  tabs = [],
  activeTabIndex = 0,
  onTabChange,
  idPrefix = "meals-tabs",
  isRtl = false,
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  const tabRefs = useRef([]);
  const activeCss = getThemeColorCss(style.tabActive, "primary-1");
  const idleCss = getThemeColorCss(style.tabIdle, "500");
  const borderCss = getThemeColorCss(style.tabBorder, "surface-2");

  const focusTab = useCallback((index) => {
    tabRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event, index) => {
      if (!tabs.length) {
        return;
      }

      let nextIndex = null;
      const goNext = isRtl ? "ArrowLeft" : "ArrowRight";
      const goPrev = isRtl ? "ArrowRight" : "ArrowLeft";

      if (event.key === goNext) {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === goPrev) {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex === null) {
        return;
      }

      event.preventDefault();
      onTabChange?.(nextIndex);
      focusTab(nextIndex);
    },
    [focusTab, isRtl, onTabChange, tabs.length]
  );

  if (!tabs.length) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label="Meal types"
      className="grid border-b"
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        borderColor: borderCss,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = index === activeTabIndex;
        const tabId = `${idPrefix}-tab-${index}`;
        const panelId = `${idPrefix}-panel-${index}`;

        return (
          <button
            key={`${tab?.label || "tab"}-${index}`}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={tabId}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange?.(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`${typography.button} cursor-pointer -mb-px border-b-2 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            style={{
              borderColor: isActive ? activeCss : "transparent",
              color: isActive ? activeCss : idleCss,
              "--tw-ring-color": `color-mix(in srgb, ${activeCss} 40%, transparent)`,
            }}
          >
            {tab?.label || `Tab ${index + 1}`}
          </button>
        );
      })}
    </div>
  );
}
