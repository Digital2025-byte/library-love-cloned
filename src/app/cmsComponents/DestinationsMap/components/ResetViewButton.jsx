"use client";

import { useMap } from "react-leaflet";
import { GpsFixIcon } from "@phosphor-icons/react";

export default function ResetViewButton({ center, zoom }) {
  const map = useMap();

  const resetView = () => {
    map.setView(center, zoom);
  };

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control">
        <button
          type="button"
          onClick={resetView}
          className="mt-2 rounded border border-gray-300 bg-white px-1 py-1 font-semibold text-gray-800 shadow-sm hover:bg-gray-100"
          style={{ zIndex: 1000 }}
          title="Reset to default view"
        >
          <GpsFixIcon size={20} weight="fill" />
        </button>
      </div>
    </div>
  );
}
