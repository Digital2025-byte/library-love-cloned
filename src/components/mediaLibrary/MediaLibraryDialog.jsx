"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import MediaAttachmentDetails from "./components/MediaAttachmentDetails";
import MediaDialogFooter from "./components/MediaDialogFooter";
import MediaDialogHeader from "./components/MediaDialogHeader";
import MediaDialogSidebar from "./components/MediaDialogSidebar";
import MediaDialogTabs from "./components/MediaDialogTabs";
import MediaLibraryGrid from "./components/MediaLibraryGrid";
import MediaUploadPanel from "./components/MediaUploadPanel";
import MediaUrlPanel from "./components/MediaUrlPanel";
import useMediaLibrary from "./useMediaLibrary";

/**
 * WordPress-style Insert Media dialog.
 * Isolated + reusable — pass onSelect({ url, alt, title, ... }).
 */
export default function MediaLibraryDialog({
  isOpen,
  onClose,
  onSelect,
  title = "Insert Media",
  initialUrl = "",
  items,
}) {
  const media = useMediaLibrary({ isOpen, initialUrl, items });

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleSelect = () => {
    if (!media.selectionPayload) return;
    onSelect?.(media.selectionPayload);
    onClose?.();
  };

  const dialog = (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close media dialog overlay"
        className="absolute inset-0 cursor-pointer bg-black/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-library-title"
        className="relative z-10 flex h-[min(860px,92vh)] w-full max-w-6xl flex-col overflow-hidden rounded-sm border border-200 bg-white shadow-2xl"
      >
        <MediaDialogHeader title={title} onClose={onClose} />

        <div className="flex min-h-0 flex-1">
          <MediaDialogSidebar
            action={media.action}
            onActionChange={media.setAction}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            {media.action === "url" ? (
              <MediaUrlPanel
                value={media.urlDraft}
                onChange={media.setUrlDraft}
              />
            ) : (
              <>
                <MediaDialogTabs
                  tab={media.tab}
                  onTabChange={media.setTab}
                  search={media.search}
                  onSearchChange={media.setSearch}
                  showSearch={media.tab === "library"}
                />

                <div className="flex min-h-0 flex-1">
                  <div className="flex min-w-0 flex-1 flex-col">
                    {media.tab === "upload" ? (
                      <MediaUploadPanel
                        isDragging={media.isDragging}
                        onDraggingChange={media.setIsDragging}
                        onFiles={media.addFiles}
                        maxUploadLabel={media.maxUploadLabel}
                      />
                    ) : (
                      <MediaLibraryGrid
                        items={media.filteredItems}
                        selectedId={media.selectedId}
                        onSelect={media.setSelectedId}
                      />
                    )}
                  </div>

                  {media.tab === "library" ? (
                    <MediaAttachmentDetails
                      item={media.selectedItem}
                      onChange={media.updateSelected}
                      onDelete={media.removeSelected}
                    />
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>

        <MediaDialogFooter
          canSelect={Boolean(media.selectionPayload)}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
