"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DRAWER_DEFAULT_WIDTH,
  DRAWER_LARGE_BREAKPOINT,
  DRAWER_MAX_RATIO_LARGE,
  DRAWER_MAX_RATIO_SMALL,
  DRAWER_MIN_WIDTH,
} from "../utils/constants";

function getMaxWidth() {
  if (typeof window === "undefined") return DRAWER_DEFAULT_WIDTH;
  const ratio =
    window.innerWidth >= DRAWER_LARGE_BREAKPOINT
      ? DRAWER_MAX_RATIO_LARGE
      : DRAWER_MAX_RATIO_SMALL;
  return window.innerWidth * ratio;
}

function clampWidth(value) {
  return Math.min(getMaxWidth(), Math.max(DRAWER_MIN_WIDTH, value));
}

/**
 * Drag the drawer open from the screen edge, and resize it from
 * the inner edge. Width is capped at 50% on large screens and
 * 100% on small screens.
 */
export default function useDrawerDrag({ onOpen, onClose, side = "left" }) {
  const [width, setWidth] = useState(DRAWER_DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const widthRef = useRef(DRAWER_DEFAULT_WIDTH);
  const lastOpenWidthRef = useRef(DRAWER_DEFAULT_WIDTH);
  const dragRef = useRef(null);

  const commitWidth = useCallback((value) => {
    widthRef.current = value;
    setWidth(value);
  }, []);

  const applyDelta = useCallback(
    (clientX, startX, startWidth) => {
      const delta = side === "left" ? clientX - startX : startX - clientX;
      return startWidth + delta;
    },
    [side]
  );

  const beginDrag = useCallback(
    (event, startWidth) => {
      if (event.button != null && event.button !== 0) return;

      event.preventDefault();
      dragRef.current = {
        startX: event.clientX,
        startWidth,
      };
      setIsDragging(true);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";

      const onMove = (moveEvent) => {
        const drag = dragRef.current;
        if (!drag) return;
        const next = applyDelta(moveEvent.clientX, drag.startX, drag.startWidth);
        commitWidth(clampWidth(next));
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);

        const next = clampWidth(widthRef.current);
        dragRef.current = null;
        setIsDragging(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        lastOpenWidthRef.current = next;
        commitWidth(next);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    },
    [applyDelta, commitWidth]
  );

  useEffect(() => {
    const onResize = () => {
      const max = getMaxWidth();
      const next = Math.min(max, Math.max(DRAWER_MIN_WIDTH, widthRef.current));
      lastOpenWidthRef.current = Math.min(max, lastOpenWidthRef.current);
      commitWidth(next);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [commitWidth]);

  const onHandlePointerDown = useCallback(
    (event) => {
      beginDrag(event, widthRef.current);
    },
    [beginDrag]
  );

  const onTriggerPointerDown = useCallback(
    (event) => {
      if (event.button != null && event.button !== 0) return;

      const startX = event.clientX;
      const onMove = (moveEvent) => {
        if (Math.abs(moveEvent.clientX - startX) < 8) return;
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        commitWidth(clampWidth(lastOpenWidthRef.current));
        onOpen();
        beginDrag(moveEvent, 0);
      };
      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [beginDrag, commitWidth, onOpen]
  );

  const onTriggerClick = useCallback(
    (event) => {
      event.stopPropagation();
      commitWidth(clampWidth(lastOpenWidthRef.current));
      onOpen();
    },
    [commitWidth, onOpen]
  );

  return {
    width,
    isDragging,
    onHandlePointerDown,
    onTriggerPointerDown,
    onTriggerClick,
  };
}
