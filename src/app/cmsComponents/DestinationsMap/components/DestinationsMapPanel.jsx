"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PageContentContainer from "@/components/layout/PageContentContainer";
import DestinationsCities from "./DestinationsCities";
import DestinationsMapOverlays from "./DestinationsMapOverlays";
import {
  DEFAULT_CENTER,
  buildCurvePoints,
  buildRoutesMap,
  getPlaneDirection,
  transformDestinationData,
} from "../utils/helpers";
import {
  DEFAULT_DESTINATIONS_MAP_STYLE,
  MAP_RADIUS_CLASS,
} from "../utils/style";

const DestinationsMapCanvas = dynamic(() => import("./DestinationsMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-primary-1/20 text-sm text-white/80">
      Loading map…
    </div>
  ),
});

export default function DestinationsMapPanel({
  lang = "en",
  cities = [],
  routes = [],
  labels = {},
  style,
}) {
  const OurDestinationsData = useMemo(
    () => transformDestinationData(cities),
    [cities]
  );
  const routesData = useMemo(
    () => (Array.isArray(routes) ? routes : []),
    [routes]
  );
  const routesMap = useMemo(() => buildRoutesMap(routesData), [routesData]);
  const availableFromCityIds = useMemo(
    () => new Set(routesData.map((route) => route.fromCityId)),
    [routesData]
  );

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapTarget, setMapTarget] = useState(null);
  const [planeDirection, setPlaneDirection] = useState("E");
  const [pendingDestination, setPendingDestination] = useState(null);

  const [showNewRoutes, setShowNewRoutes] = useState(false);
  const [showNetwork, setShowNetwork] = useState(true);

  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromDestination, setFromDestination] = useState(null);
  const [toDestination, setToDestination] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const [animatedPoints, setAnimatedPoints] = useState(null);
  const [planePosition, setPlanePosition] = useState(null);

  const destinationImages = useMemo(() => {
    if (!selectedDestination?.image?.urls?.length) {
      return selectedDestination?.image?.src
        ? [selectedDestination.image.src]
        : [];
    }
    return selectedDestination.image.urls;
  }, [selectedDestination]);

  const getSuggestions = useCallback(
    (value, excludeId, field = null, fromCityId = null, showAllWhenEmpty = false) => {
      const q = value.trim().toLowerCase();
      let availableDestinations = OurDestinationsData;

      if (field === "from") {
        availableDestinations = OurDestinationsData.filter((d) =>
          availableFromCityIds.has(d.id)
        );
        if (!q) return [];
      } else if (field === "to" && fromCityId) {
        const availableToCityIds = routesMap.get(fromCityId) || [];
        const availableToIdsSet = new Set(availableToCityIds);
        availableDestinations = OurDestinationsData.filter((d) =>
          availableToIdsSet.has(d.id)
        );
        if (showAllWhenEmpty && !q) {
          return availableDestinations.filter((d) =>
            excludeId ? d.id !== excludeId : true
          );
        }
        if (!q && !showAllWhenEmpty) return [];
      } else if (!q) {
        return [];
      }

      return availableDestinations.filter((d) => {
        if (excludeId && d.id === excludeId) return false;
        return (
          d.city.toLowerCase().includes(q) ||
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q)
        );
      });
    },
    [OurDestinationsData, availableFromCityIds, routesMap]
  );

  const handleSelectDestination = (field, dest) => {
    if (field === "from") {
      setFromDestination(dest);
      setFromValue(dest.city);
      setMapTarget({ lat: dest.lat, lng: dest.lng });
      if (toDestination && toDestination.id === dest.id) {
        setToDestination(null);
        setToValue("");
      }
      setActiveField("to");
    } else {
      setToDestination(dest);
      setToValue(dest.city);
      if (fromDestination) {
        setMapTarget({
          lat: (fromDestination.lat + dest.lat) / 2,
          lng: (fromDestination.lng + dest.lng) / 2,
        });
      } else {
        setMapTarget({ lat: dest.lat, lng: dest.lng });
      }
      setShowNetwork(false);
      setShowNewRoutes(false);
      setActiveField(null);
    }
    setHoveredDestination(dest);
  };

  const handleMarkerClick = (destination) => {
    setSelectedDestination(destination);
    setHoveredDestination(destination);
    setCurrentImageIndex(0);
    setMapTarget({ lat: destination.lat, lng: destination.lng });
  };

  const handleMarkerMouseOver = (destination) => {
    setHoveredDestination(destination);
  };

  const handleMarkerMouseOut = () => {
    if (!selectedDestination) {
      setHoveredDestination(null);
    }
  };

  const closeCard = () => {
    setSelectedDestination(null);
    setHoveredDestination(null);
    setPendingDestination(null);
    setMapTarget(null);
  };

  const resetSearch = () => {
    setFromValue("");
    setToValue("");
    setFromDestination(null);
    setToDestination(null);
    setHoveredDestination(null);
    setCurrentImageIndex(0);
    setShowNetwork(true);
    setMapTarget({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
    setSelectedDestination(null);
    setPendingDestination(null);
  };

  const filteredDestinations = OurDestinationsData.filter((d) => {
    const inNewRoutes = d.isNewRoute;
    const inNetwork = !d.isNewRoute;
    const isSelectedFrom = fromDestination?.id === d.id;
    const isSelectedTo = toDestination?.id === d.id;
    if (isSelectedFrom || isSelectedTo) return true;
    return (showNewRoutes && inNewRoutes) || (showNetwork && inNetwork);
  });

  useEffect(() => {
    let animationId = null;

    if (fromDestination && toDestination) {
      const pts = buildCurvePoints(
        { lat: fromDestination.lat, lng: fromDestination.lng },
        { lat: toDestination.lat, lng: toDestination.lng }
      );
      const total = pts.length;
      const durationMs = 5000;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / durationMs, 1);
        const idx = Math.max(1, Math.floor(t * (total - 1)));
        const currentPoint = pts[idx];
        const prevPoint = pts[idx - 1];
        setAnimatedPoints(pts.slice(0, idx + 1));
        setPlanePosition(currentPoint);
        setPlaneDirection(getPlaneDirection(prevPoint, currentPoint));
        if (t < 1) {
          animationId = window.requestAnimationFrame(step);
        }
      };

      animationId = window.requestAnimationFrame(step);
    } else {
      setAnimatedPoints(null);
      setPlanePosition(null);
    }

    return () => {
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId);
      }
    };
  }, [fromDestination, toDestination]);

  const fromSuggestions =
    activeField === "from" ? getSuggestions(fromValue, null, "from") : [];
  const toSuggestions =
    activeField === "to" && fromDestination
      ? getSuggestions(
          toValue,
          fromDestination?.id,
          "to",
          fromDestination?.id,
          !toValue.trim()
        )
      : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === destinationImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? destinationImages.length - 1 : prev - 1
    );
  };

  if (!OurDestinationsData.length && !routesData.length) {
    return null;
  }

  const resolvedStyle = style || DEFAULT_DESTINATIONS_MAP_STYLE;
  const radiusClass =
    MAP_RADIUS_CLASS[resolvedStyle.mapRadius] ?? MAP_RADIUS_CLASS.sm;

  return (
    <section className="relative flex items-center justify-center">
      <PageContentContainer>
        <div className={`relative z-0 h-[500px] overflow-hidden ${radiusClass}`}>
        <DestinationsMapCanvas
          mapTarget={mapTarget}
          onMoveEnd={() => {
            if (pendingDestination) {
              setSelectedDestination(pendingDestination);
              setPendingDestination(null);
            }
          }}
          animatedPoints={animatedPoints}
          planePosition={planePosition}
          planeDirection={planeDirection}
          filteredDestinations={filteredDestinations}
          hoveredDestination={hoveredDestination}
          fromDestination={fromDestination}
          toDestination={toDestination}
          onMarkerClick={handleMarkerClick}
          onMarkerMouseOver={handleMarkerMouseOver}
          onMarkerMouseOut={handleMarkerMouseOut}
        />

        <DestinationsMapOverlays
          labels={labels}
          style={resolvedStyle}
          fromValue={fromValue}
          toValue={toValue}
          fromDestination={fromDestination}
          toDestination={toDestination}
          activeField={activeField}
          fromSuggestions={fromSuggestions}
          toSuggestions={toSuggestions}
          showReset={Boolean(fromDestination || toDestination)}
          showBookNow={Boolean(fromDestination && toDestination)}
          showNewRoutes={showNewRoutes}
          showNetwork={showNetwork}
          onFromChange={(e) => {
            setFromValue(e.target.value);
            setFromDestination(null);
            setActiveField("from");
          }}
          onToChange={(e) => {
            setToValue(e.target.value);
            setToDestination(null);
            if (fromDestination) setActiveField("to");
          }}
          onFromFocus={() => setActiveField("from")}
          onToFocus={() => {
            if (fromDestination) setActiveField("to");
          }}
          onSelectDestination={handleSelectDestination}
          onReset={resetSearch}
          onToggleNewRoutes={() => setShowNewRoutes((v) => !v)}
          onToggleNetwork={() => setShowNetwork((v) => !v)}
        />

        {selectedDestination && destinationImages.length > 0 ? (
          <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
            <div className="pointer-events-auto lg:translate-x-48">
              <DestinationsCities
                destination={selectedDestination}
                images={destinationImages}
                currentImageIndex={currentImageIndex}
                onClose={closeCard}
                onNext={nextImage}
                onPrev={prevImage}
                onDotClick={setCurrentImageIndex}
                lang={lang}
              />
            </div>
          </div>
        ) : null}
        </div>
      </PageContentContainer>
    </section>
  );
}
