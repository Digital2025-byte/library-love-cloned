"use client";

import { useRef } from "react";
import { typography } from "@/styles/typography";
import { cn } from "@/components/lib/utils";
import { useTabsContext } from "../context";

export function TabsList({ children, className }) {
  const listRef = useRef(null);

  const onKeyDown = (event) => {
    const tabs = Array.from(
      listRef.current?.querySelectorAll('[role="tab"]:not([disabled])') || []
    );
    if (!tabs.length) return;

    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;

    const lastIndex = tabs.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn("sticky top-0 z-10 flex border-b border-200 bg-white", className)}
    >
      {children}
    </div>
  );
}

export function Tab({ value, children, className }) {
  const { selected, select, baseId } = useTabsContext();
  const isActive = selected === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => select(value)}
      className={cn(
        typography.caption,
        "flex flex-1 cursor-pointer flex-col items-center gap-1 border-b-2 px-2 py-2.5 font-medium",
        isActive
          ? "border-primary-1 text-primary-1"
          : "border-transparent text-500 hover:text-main",
        className
      )}
    >
      {children}
    </button>
  );
}
