import { useEffect, useMemo, useState } from "react";
import { getPreferredCity, getUniqueCities } from "../utils/helpers";

export function useGridInfoCities(items = []) {
  const cities = useMemo(() => getUniqueCities(items), [items]);
  const preferredCity = useMemo(() => getPreferredCity(cities), [cities]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (cities.length === 0) {
      if (selectedCity !== null) {
        setSelectedCity(null);
      }
      return;
    }

    if (!selectedCity || !cities.includes(selectedCity)) {
      setSelectedCity(preferredCity);
    }
  }, [cities, selectedCity, preferredCity]);

  const filteredItems = useMemo(() => {
    if (cities.length > 1 && selectedCity) {
      return items.filter((item) => item.city === selectedCity);
    }
    return items;
  }, [items, cities.length, selectedCity]);

  return {
    cities,
    selectedCity,
    setSelectedCity,
    filteredItems,
  };
}
