"use client";

import { useCallback, useId, useRef, useState } from "react";

/**
 * Shared open/close state for Drawer.
 * Pass `triggerRef` to the button that opens it so outside-click
 * dismiss does not treat that button as an outside click.
 */
export default function useDrawer({ defaultOpen = false } = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const titleId = useId();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    panelRef,
    titleId,
  };
}
