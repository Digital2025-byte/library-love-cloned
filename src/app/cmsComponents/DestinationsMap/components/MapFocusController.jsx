"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFocusController({ target, onMoveEnd }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return undefined;

    const { lat, lng } = target;
    map.setView([lat, lng], map.getZoom(), {
      animate: true,
      duration: 0.8,
    });

    if (!onMoveEnd) return undefined;

    const handleMoveEnd = () => {
      onMoveEnd();
    };

    map.once("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [target, map, onMoveEnd]);

  return null;
}
