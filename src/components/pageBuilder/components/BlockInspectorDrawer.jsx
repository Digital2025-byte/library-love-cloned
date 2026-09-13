"use client";

import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

/**
 * Shared inspector for the block currently being edited. Mounted only while
 * a block is active, so there is exactly one drawer on the page at a time.
 *
 * Content/style edits flow straight back to the page state, so the preview
 * updates live as fields change.
 */
export default function BlockInspectorDrawer({
  entry,
  content,
  contentDefaults,
  style,
  onContentChange,
  onStyleChange,
  onClose,
}) {
  const drawer = useDrawer({ defaultOpen: true });
  const PropsForm = entry.PropsForm;

  const handleClose = () => {
    drawer.close();
    onClose();
  };

  return (
    <Drawer
      isOpen={drawer.isOpen}
      onOpen={drawer.open}
      onClose={handleClose}
      triggerRef={drawer.triggerRef}
      panelRef={drawer.panelRef}
      titleId={drawer.titleId}
      title={entry.label}
      footer={
        <InspectorFooter>
          <InspectorSubmitButton onClick={handleClose}>
            Done
          </InspectorSubmitButton>
        </InspectorFooter>
      }
    >
      <PropsForm
        content={content}
        onContentChange={onContentChange}
        contentDefaults={contentDefaults}
        style={style}
        onStyleChange={onStyleChange}
      />
    </Drawer>
  );
}
