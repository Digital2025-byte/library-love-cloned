import { useEffect, useMemo, useState } from "react";
import {
  getUniqueCountries,
  groupBranchesByCountry,
} from "../utils/helpers";

export function useMapInfoSelection(branches = []) {
  const countries = useMemo(() => getUniqueCountries(branches), [branches]);
  const branchesByCountry = useMemo(
    () => groupBranchesByCountry(branches),
    [branches]
  );

  const [selectedCountry, setSelectedCountry] = useState(countries[0] || "");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedOfficeIndex, setSelectedOfficeIndex] = useState(0);

  useEffect(() => {
    if (countries.length > 0 && !countries.includes(selectedCountry)) {
      setSelectedCountry(countries[0]);
      setSelectedCity(null);
      setSelectedOfficeIndex(0);
    }
  }, [countries, selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry || !branchesByCountry[selectedCountry]) return [];
    // Preserve first-seen city order from branches (object insertion order).
    return Object.keys(branchesByCountry[selectedCountry]);
  }, [selectedCountry, branchesByCountry]);

  const cityOffices = useMemo(() => {
    if (!selectedCountry || !branchesByCountry[selectedCountry]) return [];

    if (selectedCity && branchesByCountry[selectedCountry][selectedCity]) {
      return branchesByCountry[selectedCountry][selectedCity];
    }

    if (cities.length === 1) {
      return branchesByCountry[selectedCountry][cities[0]] || [];
    }

    return [];
  }, [selectedCity, selectedCountry, branchesByCountry, cities]);

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
    } else if (
      selectedCity &&
      cities.length > 0 &&
      !cities.includes(selectedCity)
    ) {
      setSelectedCity(cities[0]);
    }
  }, [selectedCountry, cities, selectedCity]);

  useEffect(() => {
    setSelectedOfficeIndex(0);
  }, [selectedCity, selectedCountry]);

  const displayOffice = useMemo(() => {
    if (!cityOffices.length) return null;
    return cityOffices[selectedOfficeIndex] || cityOffices[0];
  }, [cityOffices, selectedOfficeIndex]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setSelectedOfficeIndex(0);

    if (branchesByCountry[country]) {
      const countryCities = Object.keys(branchesByCountry[country]);
      setSelectedCity(countryCities[0] || null);
    } else {
      setSelectedCity(null);
    }
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setSelectedOfficeIndex(0);
  };

  return {
    countries,
    cities,
    cityOffices,
    selectedCountry,
    selectedCity,
    selectedOfficeIndex,
    displayOffice,
    handleCountryClick,
    handleCityClick,
    setSelectedOfficeIndex,
  };
}
