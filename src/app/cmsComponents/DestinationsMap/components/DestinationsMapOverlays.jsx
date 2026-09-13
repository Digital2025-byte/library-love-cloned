"use client";

import { getThemeColorCss } from "@/styles/themeColors";
import { DEFAULT_DESTINATIONS_MAP_STYLE } from "../utils/style";

export default function DestinationsMapOverlays({
  labels = {},
  style = DEFAULT_DESTINATIONS_MAP_STYLE,
  fromValue,
  toValue,
  fromDestination,
  toDestination,
  activeField,
  fromSuggestions = [],
  toSuggestions = [],
  showReset,
  showBookNow,
  showNewRoutes,
  showNetwork,
  onFromChange,
  onToChange,
  onFromFocus,
  onToFocus,
  onSelectDestination,
  onReset,
  onToggleNewRoutes,
  onToggleNetwork,
}) {
  const searchBg = getThemeColorCss(style.searchBg, "white");
  const filterBg = getThemeColorCss(style.filterBg, "white");
  const filterText = getThemeColorCss(style.filterText, "secondary-2");
  const bookBg = getThemeColorCss(style.bookBg, "primary-2");
  const bookText = getThemeColorCss(style.bookText, "white");

  return (
    <div className="pointer-events-none absolute inset-0">
      {style.showSearch ? (
        <div className="pointer-events-auto absolute top-5 start-5 end-5 flex flex-col items-stretch gap-3 sm:end-auto sm:flex-row sm:items-center">
          <div
            className="z-[999] flex w-full items-center gap-2 rounded-sm px-3 py-2 shadow-lg sm:w-auto sm:px-4"
            style={{ backgroundColor: searchBg }}
          >
            <div className="relative w-full sm:w-40">
              <input
                type="text"
                placeholder={labels.from || "From"}
                value={fromValue}
                onChange={onFromChange}
                onFocus={onFromFocus}
                className="w-full border-none bg-transparent text-sm outline-none placeholder-gray-400"
              />
              {activeField === "from" && fromSuggestions.length > 0 ? (
                <ul className="absolute left-0 z-[2000] mt-1 max-h-60 w-48 overflow-y-auto rounded-lg bg-white text-sm shadow-lg">
                  {fromSuggestions.map((d) => (
                    <li
                      key={d.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectDestination("from", d);
                      }}
                    >
                      {d.city}, {d.country}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <span className="h-6 w-px bg-gray-200" />

            <div className="relative w-full sm:w-40">
              <input
                type="text"
                placeholder={labels.to || "To"}
                value={toValue}
                disabled={!fromDestination}
                onChange={onToChange}
                onFocus={onToFocus}
                className={`w-full border-none bg-transparent text-sm outline-none placeholder-gray-400 ${
                  !fromDestination ? "cursor-not-allowed opacity-60" : ""
                }`}
              />
              {activeField === "to" && toSuggestions.length > 0 ? (
                <ul className="absolute left-0 z-[2000] mt-1 max-h-60 w-48 overflow-y-auto rounded-lg bg-white text-sm shadow-lg">
                  {toSuggestions.map((d) => (
                    <li
                      key={d.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectDestination("to", d);
                      }}
                    >
                      {d.city}, {d.country}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {style.showReset && showReset ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-sm px-4 py-1.5 text-xs font-semibold text-primary-1 hover:text-primary-2"
              >
                {labels.reset || "Reset"}
              </button>
            ) : null}
            {style.showBookNow && showBookNow ? (
              <button
                type="button"
                className="rounded-sm px-4 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: bookBg, color: bookText }}
                onClick={() => {}}
              >
                {labels.bookNow || "Book now"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {style.showFilters ? (
        <div
          className={`pointer-events-auto absolute end-5 z-[990] flex flex-wrap justify-start gap-2 sm:top-5 sm:start-auto sm:justify-end ${
            style.showSearch ? "top-[4.75rem] start-5" : "top-5 start-5"
          }`}
        >
          <button
            type="button"
            onClick={onToggleNewRoutes}
            className="flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-medium shadow-lg sm:text-sm"
            style={{ backgroundColor: filterBg, color: filterText }}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                showNewRoutes
                  ? "border-[#A6CFE0] bg-[#A6CFE0]"
                  : "border-gray-300"
              }`}
            >
              {showNewRoutes ? (
                <span className="h-2 w-2 rounded-[2px]" />
              ) : null}
            </span>
            <span>{labels.newRoutes || "New routes"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleNetwork}
            className="flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-medium shadow-lg sm:text-sm"
            style={{ backgroundColor: filterBg, color: filterText }}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                showNetwork
                  ? "border-[#BAA981] bg-[#BAA981]"
                  : "border-gray-300"
              }`}
            >
              {showNetwork ? <span className="h-2 w-2 rounded-[2px]" /> : null}
            </span>
            <span>{labels.ourNetwork || "Our network"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
