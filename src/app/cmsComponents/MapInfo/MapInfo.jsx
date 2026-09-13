"use client";

import { useTranslation } from "react-i18next";
import MapInfoCitySelector from "./components/MapInfoCitySelector";
import MapInfoCountryTabs from "./components/MapInfoCountryTabs";
import MapInfoDetails from "./components/MapInfoDetails";
import MapInfoHeader from "./components/MapInfoHeader";
import MapInfoOfficeTabs from "./components/MapInfoOfficeTabs";
import { useMapInfoSelection } from "./hooks/useMapInfoSelection";
import {
  getContactFieldLabels,
  getMapInfoContent,
} from "./utils/helpers";
import { resolveMapInfoStyle } from "./utils/style";

const MapInfo = ({ lang = "en", data, style }) => {
  const { t } = useTranslation();
  const resolvedStyle = resolveMapInfoStyle(style);
  const labels = getContactFieldLabels(t);
  const { title, description, branches, hasContent } = getMapInfoContent(
    data,
    lang
  );
  const {
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
  } = useMapInfoSelection(branches);

  if (!hasContent) {
    return null;
  }

  return (
    <>
      <MapInfoHeader
        title={title}
        description={description}
        style={resolvedStyle}
      />

      {resolvedStyle.showCountries ? (
        <MapInfoCountryTabs
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryClick}
          style={resolvedStyle}
        />
      ) : null}

      {resolvedStyle.showCities ? (
        <MapInfoCitySelector
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityClick}
          cityLabel={labels.city}
          style={resolvedStyle}
        />
      ) : null}

      {resolvedStyle.showOffices ? (
        <MapInfoOfficeTabs
          offices={cityOffices}
          selectedOfficeIndex={selectedOfficeIndex}
          onOfficeChange={setSelectedOfficeIndex}
          style={resolvedStyle}
        />
      ) : null}

      <MapInfoDetails
        office={displayOffice}
        labels={labels}
        lang={lang}
        style={resolvedStyle}
      />
    </>
  );
};

export default MapInfo;
