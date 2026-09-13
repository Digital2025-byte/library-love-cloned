import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { CITY_TABS_LIMIT } from "../utils/helpers";
import { DEFAULT_MAP_INFO_STYLE } from "../utils/style";

export default function MapInfoCitySelector({
  cities,
  selectedCity,
  onCityChange,
  cityLabel,
  style = DEFAULT_MAP_INFO_STYLE,
}) {
  if (!Array.isArray(cities) || cities.length <= 1) {
    return null;
  }

  const tabCss = getThemeColorCss(style.tabColor, "primary-1");

  if (cities.length > CITY_TABS_LIMIT) {
    return (
      <div className="mx-auto mb-2 max-w-7xl px-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`${typography.caption} font-medium text-muted`}>
            {cityLabel}
          </span>
          <select
            value={selectedCity || ""}
            onChange={(event) => onCityChange(event.target.value)}
            className={`${typography.button} min-w-55 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 focus:outline-none`}
            style={{ color: tabCss, fontWeight: getFontWeightValue(style.tabFontWeight) }}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-2 max-w-7xl px-3">
      <div className="-mb-px border-b border-gray-200">
        <div className="flex flex-wrap gap-6">
          {cities.map((city) => {
            const isActive = selectedCity === city;

            return (
              <button
                key={city}
                type="button"
                onClick={() => onCityChange(city)}
                className="cursor-pointer py-2 text-xs font-medium transition-colors md:text-sm"
                style={
                  isActive
                    ? {
                        borderBottom: `2px solid ${tabCss}`,
                        color: tabCss,

                        fontWeight: getFontWeightValue(style.tabFontWeight),
                      }
                    : {
                        borderBottom: "2px solid transparent",
                        color: "var(--color-500)",
                      }
                }
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
