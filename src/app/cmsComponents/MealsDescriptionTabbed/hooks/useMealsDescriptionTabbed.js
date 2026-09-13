"use client";

import { useCallback, useEffect, useState } from "react";

function sectionKey(tabIndex, sectionIndex) {
  return `${tabIndex}-${sectionIndex}`;
}

export function useMealsDescriptionTabbed(tabs = []) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openSections, setOpenSections] = useState({});

  const safeTabIndex =
    tabs.length === 0 ? 0 : Math.min(activeTabIndex, tabs.length - 1);
  const activeTab = tabs[safeTabIndex] || {};
  const activeSections = Array.isArray(activeTab?.sections)
    ? activeTab.sections
    : [];

  useEffect(() => {
    if (activeTabIndex !== safeTabIndex) {
      setActiveTabIndex(safeTabIndex);
    }
  }, [activeTabIndex, safeTabIndex]);

  const isSectionOpen = useCallback(
    (sectionIndex) => {
      const key = sectionKey(safeTabIndex, sectionIndex);
      return openSections[key] ?? true;
    },
    [openSections, safeTabIndex]
  );

  const toggleSection = useCallback(
    (sectionIndex) => {
      const key = sectionKey(safeTabIndex, sectionIndex);
      setOpenSections((prev) => ({
        ...prev,
        [key]: !(prev[key] ?? true),
      }));
    },
    [safeTabIndex]
  );

  const handleTabChange = useCallback((index) => {
    if (typeof index !== "number" || Number.isNaN(index)) {
      return;
    }
    setActiveTabIndex(index);
  }, []);

  return {
    activeTabIndex: safeTabIndex,
    setActiveTabIndex: handleTabChange,
    activeTab,
    activeSections,
    isSectionOpen,
    toggleSection,
  };
}
