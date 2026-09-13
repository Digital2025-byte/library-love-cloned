"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import {
  MAP_LAND_COLOR,
  MAP_LAND_BORDER_COLOR,
} from "../utils/helpers";

/**
 * Renders world landmasses as flat filled polygons so the map has an exact
 * land/sea color scheme instead of relying on raster tiles.
 */
export default function WorldLandLayer() {
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/geo/world.geojson")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setGeo(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!geo) return null;

  return (
    <GeoJSON
      data={geo}
      interactive={false}
      style={{
        fillColor: MAP_LAND_COLOR,
        fillOpacity: 1,
        color: MAP_LAND_BORDER_COLOR,
        weight: 0.6,
        opacity: 0.35,
      }}
    />
  );
}
