"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEMO_MEDIA_ITEMS,
  createUploadedMediaItem,
} from "./demoMedia";

const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 GB (demo limit label)

/**
 * Shared state for the Insert Media dialog.
 */
export default function useMediaLibrary({
  isOpen,
  initialUrl = "",
  items: externalItems,
} = {}) {
  const [action, setAction] = useState("insert"); // insert | url
  const [tab, setTab] = useState("upload"); // upload | library
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(() =>
    Array.isArray(externalItems) && externalItems.length
      ? externalItems
      : DEMO_MEDIA_ITEMS
  );
  const [selectedId, setSelectedId] = useState(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setAction("insert");
    setTab(initialUrl ? "library" : "upload");
    setSearch("");
    setUrlDraft(initialUrl || "");
    setIsDragging(false);

    const match = items.find((item) => item.url === initialUrl);
    setSelectedId(match?.id || null);
  }, [isOpen, initialUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => {
      const haystack = `${item.title} ${item.alt} ${item.caption}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [items, search]);

  const updateSelected = useCallback((patch) => {
    if (!selectedId) return;
    setItems((current) =>
      current.map((item) =>
        item.id === selectedId ? { ...item, ...patch } : item
      )
    );
  }, [selectedId]);

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []).filter((file) =>
      String(file.type || "").startsWith("image/")
    );
    if (!files.length) return;

    const nextItems = files.map((file) => {
      const objectUrl = URL.createObjectURL(file);
      return createUploadedMediaItem(file, objectUrl);
    });

    setItems((current) => [...nextItems, ...current]);
    setSelectedId(nextItems[0]?.id || null);
    setTab("library");
    setAction("insert");
  }, []);

  const removeSelected = useCallback(() => {
    if (!selectedId) return;
    setItems((current) => {
      const target = current.find((item) => item.id === selectedId);
      if (target?.source === "upload" && target.url?.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return current.filter((item) => item.id !== selectedId);
    });
    setSelectedId(null);
  }, [selectedId]);

  const selectionPayload = useMemo(() => {
    if (action === "url") {
      const url = urlDraft.trim();
      if (!url) return null;
      return {
        url,
        alt: "",
        title: url.split("/").pop() || "Image",
        caption: "",
        description: "",
      };
    }

    if (!selectedItem) return null;
    return {
      url: selectedItem.url,
      alt: selectedItem.alt || "",
      title: selectedItem.title || "",
      caption: selectedItem.caption || "",
      description: selectedItem.description || "",
      id: selectedItem.id,
    };
  }, [action, selectedItem, urlDraft]);

  return {
    action,
    setAction,
    tab,
    setTab,
    search,
    setSearch,
    items,
    filteredItems,
    selectedId,
    setSelectedId,
    selectedItem,
    updateSelected,
    removeSelected,
    urlDraft,
    setUrlDraft,
    isDragging,
    setIsDragging,
    addFiles,
    selectionPayload,
    maxUploadLabel: "1 GB",
    maxUploadBytes: MAX_UPLOAD_BYTES,
  };
}
