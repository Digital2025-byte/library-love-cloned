"use client";

import { useRef, useState } from "react";
import { remapOpenIndexes, reorderItems } from "./reorderItems";

export default function useRepeater({ items = [], onChange, createItem }) {
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [openIndexes, setOpenIndexes] = useState(
    () => new Set(items.length ? [0] : [])
  );

  const toggleItem = (index) => {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addItem = () => {
    const nextIndex = itemsRef.current.length;
    onChange([...itemsRef.current, createItem()]);
    setOpenIndexes((current) => new Set(current).add(nextIndex));
  };

  const removeItem = (index) => {
    onChange(itemsRef.current.filter((_, itemIndex) => itemIndex !== index));
    setOpenIndexes((current) => {
      const next = new Set();
      current.forEach((itemIndex) => {
        if (itemIndex < index) next.add(itemIndex);
        if (itemIndex > index) next.add(itemIndex - 1);
      });
      return next;
    });
  };

  const updateItem = (index, key, value) => {
    onChange(
      itemsRef.current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    onChange(reorderItems(itemsRef.current, fromIndex, toIndex));
    setOpenIndexes((current) =>
      remapOpenIndexes(current, fromIndex, toIndex)
    );
  };

  return {
    openIndexes,
    isOpen: (index) => openIndexes.has(index),
    toggleItem,
    addItem,
    removeItem,
    updateItem,
    moveItem,
  };
}
