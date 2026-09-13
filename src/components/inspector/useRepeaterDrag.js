"use client";

import { useCallback, useId, useRef, useState } from "react";

const DRAG_MIME = "application/x-inspector-repeater";

/** Fallback when browsers strip dataTransfer payloads. */
let activeDrag = null;

function encodePayload(listId, index) {
  return JSON.stringify({ listId, index });
}

function parsePayload(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.listId === "string" &&
      typeof parsed.index === "number"
    ) {
      return parsed;
    }
  } catch {
    // text/plain fallback: "listId::index"
  }

  const sep = raw.lastIndexOf("::");
  if (sep === -1) return null;
  const listId = raw.slice(0, sep);
  const index = Number(raw.slice(sep + 2));
  if (!listId || Number.isNaN(index)) return null;
  return { listId, index };
}

function readPayload(dataTransfer) {
  const fromMime = parsePayload(dataTransfer.getData(DRAG_MIME));
  if (fromMime) return fromMime;

  const fromText = parsePayload(dataTransfer.getData("text/plain"));
  if (fromText) return fromText;

  return activeDrag;
}

/**
 * Isolated HTML5 drag-and-drop for inspector repeaters.
 * Prevents cross-list drops via a stable listId.
 */
export default function useRepeaterDrag({ onMove, enabled = true }) {
  const listId = useId();
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const clear = useCallback(() => {
    activeDrag = null;
    setDraggingIndex(null);
    setOverIndex(null);
  }, []);

  const getDragHandleProps = useCallback(
    (index) => {
      if (!enabled) return {};

      return {
        draggable: true,
        onDragStart: (event) => {
          event.stopPropagation();
          const payload = { listId, index };
          activeDrag = payload;

          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(DRAG_MIME, encodePayload(listId, index));
          // Firefox + some Chromium builds require text/plain.
          event.dataTransfer.setData(
            "text/plain",
            `${listId}::${index}`
          );
          setDraggingIndex(index);
        },
        onDragEnd: () => {
          clear();
        },
      };
    },
    [clear, enabled, listId]
  );

  const getItemProps = useCallback(
    (index) => {
      if (!enabled) return {};

      return {
        onDragOver: (event) => {
          event.preventDefault();
          event.stopPropagation();
          event.dataTransfer.dropEffect = "move";
          setOverIndex((current) => (current === index ? current : index));
        },
        onDragLeave: (event) => {
          event.stopPropagation();
          // Ignore leave events that stay within the same item.
          if (event.currentTarget.contains(event.relatedTarget)) return;
          setOverIndex((current) => (current === index ? null : current));
        },
        onDrop: (event) => {
          event.preventDefault();
          event.stopPropagation();

          const payload = readPayload(event.dataTransfer);
          const fromIndex = payload?.index;
          const sameList = payload?.listId === listId;

          clear();

          if (!sameList || typeof fromIndex !== "number") return;
          if (fromIndex === index) return;

          onMoveRef.current?.(fromIndex, index);
        },
      };
    },
    [clear, enabled, listId]
  );

  return {
    listId,
    enabled,
    draggingIndex,
    overIndex,
    isDragging: draggingIndex !== null,
    getDragHandleProps,
    getItemProps,
  };
}
