"use client";

import { useId } from "react";
import { cn } from "@/components/lib/utils";
import { TabsContext } from "./context";
import { Tab, TabsList } from "./components/TabsList";
import TabsPanel from "./components/TabsPanel";
import useTabs from "./hooks/useTabs";

/**
 * Accessible tabs for splitting drawer (or other) content.
 *
 * @example
 * <Tabs defaultValue="content">
 *   <TabsList>
 *     <Tab value="content">Content</Tab>
 *     <Tab value="styling">Styling</Tab>
 *   </TabsList>
 *   <TabsPanel value="content">...</TabsPanel>
 *   <TabsPanel value="styling">...</TabsPanel>
 * </Tabs>
 */
export default function Tabs({
  defaultValue,
  value,
  onChange,
  children,
  className,
}) {
  const baseId = useId();
  const tabs = useTabs({ defaultValue, value, onChange });

  return (
    <TabsContext.Provider value={{ ...tabs, baseId }}>
      <div className={cn("flex min-h-full flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export { Tab, TabsList, TabsPanel, useTabs };
