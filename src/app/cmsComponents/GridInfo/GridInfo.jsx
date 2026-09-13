"use client";

import GridInfoCityFilter from "./components/GridInfoCityFilter";
import GridInfoGrid from "./components/GridInfoGrid";
import GridInfoHeader from "./components/GridInfoHeader";
import { useGridInfoCities } from "./hooks/useGridInfoCities";
import { getGridInfoContent } from "./utils/helpers";
import { resolveGridInfoStyle } from "./utils/style";

export default function GridInfo({ lang = "en", data, style }) {
  const resolvedStyle = resolveGridInfoStyle(style);
  const { title, description, items, hasContent } = getGridInfoContent(
    data,
    lang
  );
  const { cities, selectedCity, setSelectedCity, filteredItems } =
    useGridInfoCities(items);

  if (!hasContent) {
    return null;
  }

  const visibleItems = resolvedStyle.showFilter ? filteredItems : items;

  return (
    <>
      <GridInfoHeader
        title={title}
        description={description}
        style={resolvedStyle}
      />
      {resolvedStyle.showFilter ? (
        <GridInfoCityFilter
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          style={resolvedStyle}
        />
      ) : null}
      <GridInfoGrid items={visibleItems} lang={lang} style={resolvedStyle} />
    </>
  );
}
