"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function createPinIcon(color, selected) {
  const size = selected ? 42 : 32;
  // Use the CSS `fill` property (not the attribute) so a theme var() resolves.
  return L.divIcon({
    className: "location-map-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="fill:${color};filter:drop-shadow(0 1px 1px rgba(0,0,0,0.35))" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
    </svg>`,
  });
}

/** Keeps the view synced to the active tab (fit bounds) and selection (fly to). */
function MapSync({ tabKey, points, selected }) {
  const map = useMap();
  const prevTabKey = useRef(tabKey);

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(frame);
  }, [map, tabKey]);

  useEffect(() => {
    if (!points.length) return;

    const tabChanged = prevTabKey.current !== tabKey;
    prevTabKey.current = tabKey;

    if (selected) {
      map.flyTo([selected.lat, selected.lng], 14, { duration: 0.55 });
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 13);
      return;
    }
    if (tabChanged || true) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
    }
  }, [map, tabKey, points, selected]);

  return null;
}

export default function LocationMapCanvas({
  points = [],
  selectedIndex,
  onSelect,
  pinColor = "#006080",
  zoom = 12,
  tabKey = "",
}) {
  const selected =
    selectedIndex != null ? points[selectedIndex] || null : null;
  const center = useMemo(() => {
    if (selected) return [selected.lat, selected.lng];
    if (points.length) return [points[0].lat, points[0].lng];
    return [34.8021, 38.9968]; // Syria fallback
  }, [points, selected]);

  const defaultIcon = useMemo(() => createPinIcon(pinColor, false), [pinColor]);
  const selectedIcon = useMemo(() => createPinIcon(pinColor, true), [pinColor]);

  return (
    <div dir="ltr" className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSync tabKey={tabKey} points={points} selected={selected} />
        {points.map((point) => (
          <Marker
            key={point.index}
            position={[point.lat, point.lng]}
            icon={point.index === selectedIndex ? selectedIcon : defaultIcon}
            eventHandlers={{ click: () => onSelect?.(point.index) }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
