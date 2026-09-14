"use client";

import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

/**
 * Shared inspector for the block currently being edited. Mounted only while
 * a block is active, so there is exactly one drawer on the page at a time.
 *
 * Content/style edits update the live preview only. Persist happens when
 * the user clicks Done.
 */
export default function BlockInspectorDrawer({
  entry,
  content,
  contentDefaults,
  style,
  onContentChange,
  onStyleChange,
  onSubmit,
  onClose,
  isSaving = false,
}) {
  const drawer = useDrawer({ defaultOpen: true });
  const PropsForm = entry.PropsForm;

  const handleDismiss = () => {
    if (isSaving) {
      return;
    }
    onClose();
  };

  return (
    <Drawer
      isOpen={drawer.isOpen}
      onOpen={drawer.open}
      onClose={handleDismiss}
      triggerRef={drawer.triggerRef}
      panelRef={drawer.panelRef}
      titleId={drawer.titleId}
      title={entry.label}
      footer={
        <InspectorFooter>
          <InspectorSubmitButton onClick={onSubmit} loading={isSaving}>
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
