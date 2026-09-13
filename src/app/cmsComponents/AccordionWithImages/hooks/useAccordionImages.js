"use client";

import { useEffect, useRef, useState } from "react";

export function useAccordionImages(items) {
  const [openIndex, setOpenIndex] = useState(0);
  const [panelIndex, setPanelIndex] = useState(0);
  const itemRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (items.length === 0) {
      setOpenIndex(0);
      setPanelIndex(0);
      return;
    }

    if (openIndex != null && openIndex > items.length - 1) {
      setOpenIndex(0);
      setPanelIndex(0);
    }
  }, [items, openIndex]);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }

    setOpenIndex(index);
    setPanelIndex(index);

    setTimeout(() => {
      const container = containerRef.current;
      const item = itemRefs.current[index];
      if (!container || !item) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const relativeTop =
        itemRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: relativeTop,
        behavior: "smooth",
      });
    }, 100);
  };

  const setItemRef = (index, element) => {
    itemRefs.current[index] = element;
  };

  return {
    openIndex,
    panelIndex,
    containerRef,
    setItemRef,
    toggleAccordion,
  };
}
