"use client";

import {
  InspectorField,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "countryName"];
const IMAGE_KEYS = ["imageUrl", "imageAlt"];
const CARD_KEYS = [
  "weatherTitle",
  "description",
  "weather",
  "localTime",
  "duration",
  "numberOfFlightPerWeek",
  "nextFlight",
  "labels",
];

export default function HeaderWithCityInfoContentForm({
  content,
  onChange,
  defaults,
}) {
  const labels = content.labels || {};
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const updateLabel = (key, value) => {
    onChange({
      ...content,
      labels: { ...labels, [key]: value },
    });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Title" onReset={() => reset(TITLE_KEYS)}>
        <InspectorField
          id="header-city-info-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="header-city-info-country"
          label="Country"
          value={content.countryName || ""}
          onChange={(value) => updateField("countryName", value)}
        />
      </InspectorSection>

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="header-city-info-image"
          label="Image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="header-city-info-alt"
          label="Image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>

      <InspectorSection title="City card" onReset={() => reset(CARD_KEYS)}>
        <InspectorField
          id="header-city-info-card-title"
          label="Card title"
          value={content.weatherTitle || ""}
          onChange={(value) => updateField("weatherTitle", value)}
        />
        <InspectorField
          id="header-city-info-card-description"
          label="Card description"
          value={content.description || ""}
          onChange={(value) => updateField("description", value)}
          multiline
        />
        <InspectorField
          id="header-city-info-weather-label"
          label="Weather label"
          value={labels.weather || ""}
          onChange={(value) => updateLabel("weather", value)}
        />
        <InspectorField
          id="header-city-info-weather"
          label="Weather"
          value={content.weather || ""}
          onChange={(value) => updateField("weather", value)}
        />
        <InspectorField
          id="header-city-info-time-label"
          label="Local time label"
          value={labels.localTime || ""}
          onChange={(value) => updateLabel("localTime", value)}
        />
        <InspectorField
          id="header-city-info-time"
          label="Local time"
          value={content.localTime || ""}
          onChange={(value) => updateField("localTime", value)}
        />
        <InspectorField
          id="header-city-info-duration-label"
          label="Duration label"
          value={labels.flightDuration || ""}
          onChange={(value) => updateLabel("flightDuration", value)}
        />
        <InspectorField
          id="header-city-info-duration"
          label="Duration"
          value={content.duration || ""}
          onChange={(value) => updateField("duration", value)}
        />
        <InspectorField
          id="header-city-info-flights-label"
          label="Flights label"
          value={labels.flightsPerWeek || ""}
          onChange={(value) => updateLabel("flightsPerWeek", value)}
        />
        <InspectorField
          id="header-city-info-flights"
          label="Flights per week"
          value={content.numberOfFlightPerWeek || ""}
          onChange={(value) => updateField("numberOfFlightPerWeek", value)}
        />
        <InspectorField
          id="header-city-info-next-label"
          label="Next flight label"
          value={labels.nextFlight || ""}
          onChange={(value) => updateLabel("nextFlight", value)}
        />
        <InspectorField
          id="header-city-info-next"
          label="Next flight"
          value={content.nextFlight || ""}
          onChange={(value) => updateField("nextFlight", value)}
        />
      </InspectorSection>

      <BacklinksEditor
        idPrefix="header-city-info-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
        showReset
      />
    </div>
  );
}
