"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import LocationCard from "./LocationCard";
import { locationHasCoords } from "../utils/helpers";
import {
  CARD_GAP_CLASS,
  COLUMNS_CLASS,
  DEFAULT_LOCATION_DIRECTORY_STYLE,
  MAP_HEIGHT_CLASS,
  SECTION_PADDING_CLASS,
  TITLE_ALIGN_CLASS,
} from "../utils/style";

const CARD_RADIUS_TO_MAP = {
  none: "rounded-none",
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-3xl",
};

const LocationMapCanvas = dynamic(() => import("./LocationMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-primary-1/10 text-sm text-600">
      Loading map…
    </div>
  ),
});

export default function LocationDirectoryPanel({
  lang = "en",
  content,
  style = DEFAULT_LOCATION_DIRECTORY_STYLE,
}) {
  const tabs = content.tabs || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (activeIndex >= tabs.length) {
      setActiveIndex(0);
    }
  }, [tabs.length, activeIndex]);

  // Clear the selection whenever the active tab changes.
  useEffect(() => {
    setSelectedIndex(null);
  }, [activeIndex]);

  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;
  const gapClass = CARD_GAP_CLASS[style.cardGap] ?? CARD_GAP_CLASS.default;
  const alignClass =
    TITLE_ALIGN_CLASS[style.titleAlign] ?? TITLE_ALIGN_CLASS.left;

  const activeTab = tabs[activeIndex] || tabs[0];
  const locations = activeTab?.locations || [];

  // Map points: active-tab locations that have coordinates, tagged by index.
  const mapPoints = useMemo(
    () =>
      locations
        .map((loc, index) => ({ ...loc, index }))
        .filter((loc) => locationHasCoords(loc)),
    [locations]
  );
  const mapEnabled = style.showMap && mapPoints.length > 0;

  const showHeader =
    style.showHeader &&
    ((style.showTitle && content.title) ||
      (style.showSubtitle && content.subtitle));
  const showTabs = tabs.length > 1;

  // With the map on, cards sit in one column beside it; otherwise the grid.
  const columnsClass = mapEnabled
    ? "md:grid-cols-1"
    : COLUMNS_CLASS[style.columns] ?? COLUMNS_CLASS[2];
  const mapHeightClass =
    MAP_HEIGHT_CLASS[style.mapHeight] ?? MAP_HEIGHT_CLASS.default;
  const mapRadiusClass = CARD_RADIUS_TO_MAP[style.mapRadius] ?? "rounded-2xl";

  const cardsBlock = (
    <div className={`grid grid-cols-1 ${columnsClass} ${gapClass}`}>
      {locations.map((location, index) => (
        <LocationCard
          key={`${location.name}-${index}`}
          location={location}
          style={style}
          selectable={mapEnabled}
          selected={mapEnabled && selectedIndex === index}
          onSelect={() => setSelectedIndex(index)}
        />
      ))}
    </div>
  );

  const mapBlock = mapEnabled ? (
    <div
      className={`overflow-hidden ${mapRadiusClass} ${mapHeightClass} lg:sticky lg:top-24`}
    >
      <LocationMapCanvas
        points={mapPoints}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        pinColor={getThemeColorCss(style.mapPinColor, "primary-1")}
        zoom={Number(style.mapZoom) || 12}
        tabKey={String(activeIndex)}
      />
    </div>
  ) : null;

  return (
    <PageContentContainer as="section" className={paddingClass}>
      <div className="flex flex-col gap-4 md:gap-6">
        {showHeader ? (
          <div className={`flex flex-col gap-2 ${alignClass}`}>
            {style.showTitle && content.title ? (
              <h2
                className={`${typography.sectionTitle} m-0`}
                style={{
                  color: getThemeColorCss(style.titleColor, "700"),
                  fontWeight: getFontWeightValue(style.titleFontWeight),
                }}
              >
                {content.title}
              </h2>
            ) : null}
            {style.showSubtitle && content.subtitle ? (
              <p
                className={`${typography.sectionDescription} m-0 max-w-3xl`}
                style={{ color: getThemeColorCss(style.subtitleColor, "600") }}
              >
                {content.subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        {showTabs ? (
          <div
            role="tablist"
            className="flex flex-wrap items-center gap-4 border-b border-200"
          >
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${tab.label}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`${typography.itemTitle} -mb-px cursor-pointer border-0 border-b-2 border-solid bg-transparent px-0 pb-3`}
                  style={{
                    color: isActive
                      ? getThemeColorCss(style.activeTabColor, "primary-1")
                      : getThemeColorCss(style.inactiveTabColor, "600"),
                    borderColor: isActive
                      ? getThemeColorCss(style.activeTabColor, "primary-1")
                      : "transparent",
                    fontWeight: getFontWeightValue(
                      isActive ? "semibold" : "medium"
                    ),
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {mapEnabled ? (
          <div
            className={`grid grid-cols-1 items-start gap-4 md:gap-6 ${
              style.mapSide === "left"
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
                : "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            }`}
          >
            {style.mapSide === "left" ? (
              <>
                {mapBlock}
                {cardsBlock}
              </>
            ) : (
              <>
                {cardsBlock}
                {mapBlock}
              </>
            )}
          </div>
        ) : (
          cardsBlock
        )}
      </div>
    </PageContentContainer>
  );
}
