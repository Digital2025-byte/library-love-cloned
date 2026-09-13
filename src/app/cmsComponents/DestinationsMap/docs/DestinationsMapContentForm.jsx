"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";

const LABEL_KEYS = [
  "fromLabel",
  "toLabel",
  "resetLabel",
  "bookNowLabel",
  "newRoutesLabel",
  "ourNetworkLabel",
];

const emptyCity = () => ({
  cityId: "",
  cityName: "",
  countryName: "",
  IATACode: "",
  latitude: "",
  longitude: "",
  price: "",
  currency: "",
  numberOfFlightsPerWeek: "",
  duration: "",
  flightType: "",
  imageUrl: "",
});

const emptyRoute = () => ({
  fromCityId: "",
  toCityId: "",
});

function cityFields(item, { index, update, idPrefix }) {
  return (
    <>
      <InspectorField
        id={`${idPrefix}-${index}-id`}
        label="City ID"
        value={item.cityId || ""}
        onChange={(value) => update("cityId", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-name`}
        label="Name"
        value={item.cityName || ""}
        onChange={(value) => update("cityName", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-country`}
        label="Country"
        value={item.countryName || ""}
        onChange={(value) => update("countryName", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-iata`}
        label="IATA"
        value={item.IATACode || ""}
        onChange={(value) => update("IATACode", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-lat`}
        label="Latitude"
        value={String(item.latitude ?? "")}
        onChange={(value) => update("latitude", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-lng`}
        label="Longitude"
        value={String(item.longitude ?? "")}
        onChange={(value) => update("longitude", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-price`}
        label="Price"
        value={String(item.price ?? "")}
        onChange={(value) => update("price", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-currency`}
        label="Currency"
        value={item.currency || ""}
        onChange={(value) => update("currency", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-flights`}
        label="Flights per week"
        value={String(item.numberOfFlightsPerWeek ?? "")}
        onChange={(value) => update("numberOfFlightsPerWeek", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-duration`}
        label="Duration"
        value={String(item.duration ?? "")}
        onChange={(value) => update("duration", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-type`}
        label="Flight type"
        value={item.flightType || ""}
        onChange={(value) => update("flightType", value)}
      />
      <InspectorField
        id={`${idPrefix}-${index}-image`}
        label="Image URL"
        value={item.imageUrl || ""}
        onChange={(value) => update("imageUrl", value)}
      />
    </>
  );
}

function buildCityOptions(content) {
  const cities = [
    ...(content.newRouteCities || []),
    ...(content.networkCities || []),
  ];

  return [
    { value: "", label: "Select city" },
    ...cities
      .filter((city) => city.cityId || city.cityName)
      .map((city) => ({
        value: city.cityId || city.cityName,
        label:
          [city.cityName, city.IATACode || city.cityId]
            .filter(Boolean)
            .join(" · ") || city.cityId,
      })),
  ];
}

export default function DestinationsMapContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));
  const cityOptions = buildCityOptions(content);
  const newRoutesTitle = content.newRoutesLabel || "New routes";
  const networkTitle = content.ourNetworkLabel || "Our network";

  return (
    <div>
      <InspectorSection title="Labels" onReset={() => reset(LABEL_KEYS)}>
        <InspectorField
          id="destinations-map-from"
          label="From"
          value={content.fromLabel || ""}
          onChange={(value) => updateField("fromLabel", value)}
        />
        <InspectorField
          id="destinations-map-to"
          label="To"
          value={content.toLabel || ""}
          onChange={(value) => updateField("toLabel", value)}
        />
        <InspectorField
          id="destinations-map-reset"
          label="Reset"
          value={content.resetLabel || ""}
          onChange={(value) => updateField("resetLabel", value)}
        />
        <InspectorField
          id="destinations-map-book"
          label="Book now"
          value={content.bookNowLabel || ""}
          onChange={(value) => updateField("bookNowLabel", value)}
        />
        <InspectorField
          id="destinations-map-new-routes"
          label="New routes"
          value={content.newRoutesLabel || ""}
          onChange={(value) => updateField("newRoutesLabel", value)}
        />
        <InspectorField
          id="destinations-map-network"
          label="Our network"
          value={content.ourNetworkLabel || ""}
          onChange={(value) => updateField("ourNetworkLabel", value)}
        />
      </InspectorSection>

      <InspectorSection
        title={newRoutesTitle}
        onReset={() => reset(["newRouteCities"])}
      >
        <InspectorRepeater
          items={content.newRouteCities || []}
          createItem={emptyCity}
          itemLabel={(item, index) =>
            item.cityName || item.IATACode || `Route ${index + 1}`
          }
          addLabel="Add Route"
          onChange={(newRouteCities) =>
            onChange({ ...content, newRouteCities })
          }
        >
          {(item, ctx) =>
            cityFields(item, {
              ...ctx,
              idPrefix: "destinations-map-new",
            })
          }
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection
        title={networkTitle}
        onReset={() => reset(["networkCities"])}
      >
        <InspectorRepeater
          items={content.networkCities || []}
          createItem={emptyCity}
          itemLabel={(item, index) =>
            item.cityName || item.IATACode || `Route ${index + 1}`
          }
          addLabel="Add Route"
          onChange={(networkCities) => onChange({ ...content, networkCities })}
        >
          {(item, ctx) =>
            cityFields(item, {
              ...ctx,
              idPrefix: "destinations-map-network",
            })
          }
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Connections" onReset={() => reset(["routes"])}>
        <InspectorRepeater
          items={content.routes || []}
          createItem={emptyRoute}
          itemLabel={(item, index) => {
            const from =
              cityOptions.find((option) => option.value === item.fromCityId)
                ?.label || item.fromCityId;
            const to =
              cityOptions.find((option) => option.value === item.toCityId)
                ?.label || item.toCityId;
            if (item.fromCityId || item.toCityId) {
              return `${from || "From"} → ${to || "To"}`;
            }
            return `Connection ${index + 1}`;
          }}
          addLabel="Add Connection"
          onChange={(routes) => onChange({ ...content, routes })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorSelect
                id={`destinations-map-route-${index}-from`}
                label="From"
                value={item.fromCityId || ""}
                options={cityOptions}
                onChange={(value) => update("fromCityId", value)}
              />
              <InspectorSelect
                id={`destinations-map-route-${index}-to`}
                label="To"
                value={item.toCityId || ""}
                options={cityOptions}
                onChange={(value) => update("toCityId", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
