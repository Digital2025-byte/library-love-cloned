"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import DrawerHeader from "./components/DrawerHeader";
import DrawerPanel from "./components/DrawerPanel";
import DrawerTrigger from "./components/DrawerTrigger";
import useDrawerDismiss from "./hooks/useDrawerDismiss";
import useDrawerDrag from "./hooks/useDrawerDrag";

/**
 * Reusable side drawer. Content is passed as children so each
 * component playground can render its own props form.
 *
 * Drag the edge tab to pull it open, or drag the inner edge to
 * resize. Width is capped at 50% on large screens and 100% on small.
 */
export default function Drawer({
  isOpen,
  onClose,
  onOpen,
  children,
  footer,
  title,
  side = "left",
  triggerRef,
  panelRef: panelRefProp,
  titleId = "drawer-title",
  triggerLabel = "Edit props",
}) {
  const internalPanelRef = useRef(null);
  const panelRef = panelRefProp ?? internalPanelRef;
  const drag = useDrawerDrag({ isOpen, onOpen, onClose, side });

  useDrawerDismiss({
    isOpen,
    onClose,
    panelRef,
    triggerRef,
  });

  const drawer = (
    <>
      <DrawerTrigger
        triggerRef={triggerRef}
        onClick={drag.onTriggerClick}
        onPointerDown={drag.onTriggerPointerDown}
        isOpen={isOpen}
        side={side}
        label={triggerLabel}
      />
      <DrawerPanel
        panelRef={panelRef}
        isOpen={isOpen}
        isDragging={drag.isDragging}
        side={side}
        titleId={titleId}
        width={drag.width}
        onResizePointerDown={drag.onHandlePointerDown}
      >
        <DrawerHeader titleId={titleId} title={title} onClose={onClose} />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer}
        </div>
      </DrawerPanel>
    </>
  );

  if (typeof document === "undefined") {
    return drawer;
  }

  return createPortal(drawer, document.body);
}

export { default as useDrawer } from "./hooks/useDrawer";
export { default as useDrawerDismiss } from "./hooks/useDrawerDismiss";
export { default as useDrawerDrag } from "./hooks/useDrawerDrag";
