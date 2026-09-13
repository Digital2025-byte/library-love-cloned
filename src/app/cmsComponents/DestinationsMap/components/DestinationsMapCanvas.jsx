"use client";

import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../destinations-map.css";
import MapFocusController from "./MapFocusController";
import ResetViewButton from "./ResetViewButton";
import WorldLandLayer from "./WorldLandLayer";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_SEA_COLOR,
  createCustomIcon,
  createPlaneIcon,
} from "../utils/helpers";

export default function DestinationsMapCanvas({
  mapTarget,
  onMoveEnd,
  animatedPoints,
  planePosition,
  planeDirection,
  filteredDestinations,
  hoveredDestination,
  fromDestination,
  toDestination,
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut,
}) {
  const planeIcon = useMemo(
    () => createPlaneIcon(L, planeDirection),
    [planeDirection]
  );

  return (
    <div className="flycham-map-shell">
      <MapContainer
        className="flycham-map"
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={4}
        maxZoom={7}
        zoomSnap={0.25}
        zoomDelta={0.5}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          backgroundColor: MAP_SEA_COLOR,
        }}
        scrollWheelZoom
        wheelPxPerZoomLevel={100}
        zoomControl={false}
      >
      <MapFocusController target={mapTarget} onMoveEnd={onMoveEnd} />

      <WorldLandLayer />

      <ZoomControl position="bottomright" />
      <ResetViewButton center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} />

      {animatedPoints ? (
        <>
          <Polyline
            positions={animatedPoints}
            pathOptions={{
              color: "#C4B59A",
              weight: 2,
              opacity: 0.85,
            }}
          />
          {planePosition ? (
            <Marker
              position={planePosition}
              icon={planeIcon}
              interactive={false}
            />
          ) : null}
        </>
      ) : null}

      {filteredDestinations.map((destination) => (
        <Marker
          key={destination.id}
          position={[destination.lat, destination.lng]}
          icon={createCustomIcon(L, destination, {
            hoveredDestination,
            fromDestination,
            toDestination,
          })}
          eventHandlers={{
            click: () => onMarkerClick(destination),
            mouseover: () => onMarkerMouseOver(destination),
            mouseout: onMarkerMouseOut,
          }}
          zIndexOffset={
            hoveredDestination?.id === destination.id ||
            fromDestination?.id === destination.id ||
            toDestination?.id === destination.id
              ? 9999
              : 1
          }
        />
      ))}
    </MapContainer>
    </div>
  );
}
