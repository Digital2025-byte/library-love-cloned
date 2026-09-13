"use client";

import { useEffect } from "react";

/**
 * Closes the drawer on Escape or a pointer down outside the panel.
 * Page scroll stays enabled. The open trigger is ignored so it can
 * reopen without an immediate close.
 */
export default function useDrawerDismiss({
  isOpen,
  onClose,
  panelRef,
  triggerRef,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const isInside = (ref, target) =>
      target instanceof Node && Boolean(ref?.current?.contains(target));

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const onPointerDown = (event) => {
      const target = event.target;
      if (isInside(panelRef, target) || isInside(triggerRef, target)) return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const timeoutId = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, onClose, panelRef, triggerRef]);
}
