"use client";

import { useState } from "react";

export function useAccordion() {
  const [openIndices, setOpenIndices] = useState(new Set());

  const toggleAccordion = (index) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const isOpen = (index) => openIndices.has(index);

  return { isOpen, toggleAccordion };
}
