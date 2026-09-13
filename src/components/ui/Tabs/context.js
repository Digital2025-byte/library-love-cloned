"use client";

import { createContext, useContext } from "react";

export const TabsContext = createContext(null);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs>.");
  }
  return context;
}
