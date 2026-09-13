"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const HEADER_KEYS = ["title", "subtitle"];

const emptyLocation = () => ({
  name: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  hours: "",
  lat: "",
  lng: "",
});

const emptyTab = () => ({ label: "", locations: [emptyLocation()] });

export default function LocationDirectoryContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Header" onReset={() => reset(HEADER_KEYS)}>
        <InspectorField
          id="location-directory-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="location-directory-subtitle"
          label="Subtitle"
          value={content.subtitle || ""}
          onChange={(value) => updateField("subtitle", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Tabs" onReset={() => reset(["tabs"])}>
        <InspectorRepeater
          items={content.tabs || []}
          createItem={emptyTab}
          itemLabel={(item, index) => item.label || `Tab ${index + 1}`}
          addLabel="Add Tab"
          titleKey="label"
          titlePlaceholder="Tab title"
          onChange={(tabs) => onChange({ ...content, tabs })}
        >
          {(tab, { index, update }) => (
            <>
              <InspectorField
                id={`location-directory-${index}-label`}
                label="Tab title"
                value={tab.label || ""}
                onChange={(value) => update("label", value)}
              />
              <InspectorRepeater
                items={tab.locations || []}
                createItem={emptyLocation}
                itemLabel={(loc, locIndex) =>
                  loc.name || `Location ${locIndex + 1}`
                }
                addLabel="Add Location"
                titleKey="name"
                titlePlaceholder="Location name"
                onChange={(locations) => update("locations", locations)}
              >
                {(loc, { index: locIndex, update: updateLoc }) => (
                  <>
                    <InspectorField
                      id={`location-${index}-${locIndex}-name`}
                      label="Name"
                      value={loc.name || ""}
                      onChange={(value) => updateLoc("name", value)}
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-city`}
                      label="City"
                      value={loc.city || ""}
                      onChange={(value) => updateLoc("city", value)}
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-address`}
                      label="Address"
                      value={loc.address || ""}
                      onChange={(value) => updateLoc("address", value)}
                      multiline
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-phone`}
                      label="Phone"
                      value={loc.phone || ""}
                      onChange={(value) => updateLoc("phone", value)}
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-email`}
                      label="Email"
                      value={loc.email || ""}
                      onChange={(value) => updateLoc("email", value)}
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-hours`}
                      label="Hours"
                      value={loc.hours || ""}
                      onChange={(value) => updateLoc("hours", value)}
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-lat`}
                      label="Latitude (map)"
                      value={loc.lat ?? ""}
                      onChange={(value) => updateLoc("lat", value)}
                    />
                    <InspectorField
                      id={`location-${index}-${locIndex}-lng`}
                      label="Longitude (map)"
                      value={loc.lng ?? ""}
                      onChange={(value) => updateLoc("lng", value)}
                    />
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
