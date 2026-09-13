"use client";

import { cn } from "@/components/lib/utils";
import { useTabsContext } from "../context";

export default function TabsPanel({ value, children, className }) {
  const { selected, baseId } = useTabsContext();
  const isActive = selected === value;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      className={cn(isActive ? "flex flex-col" : "hidden", className)}
    >
      {isActive ? children : null}
    </div>
  );
}
