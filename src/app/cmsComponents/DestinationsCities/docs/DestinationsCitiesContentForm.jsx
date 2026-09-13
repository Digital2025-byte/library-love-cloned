"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinBacklinkSourceText,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  cityName: "",
  IATACode: "",
  subtitle: "",
  numberOfFlightsPerWeek: "",
  duration: "",
  description: "",
  links: [],
  imageUrl: "",
  imageAlt: "",
  buttonLabel: "",
});

export default function DestinationsCitiesContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorTitleSection
        idPrefix="destinations-cities"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <InspectorSection title="Items" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={emptyItem}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`destinations-cities-${index}-city`}
                label="City"
                value={item.cityName || ""}
                onChange={(value) => update("cityName", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-iata`}
                label="IATA code"
                value={item.IATACode || ""}
                onChange={(value) => update("IATACode", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-origin`}
                label="Origin"
                value={item.subtitle || ""}
                onChange={(value) => update("subtitle", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-flights`}
                label="Flights per week"
                value={item.numberOfFlightsPerWeek || ""}
                onChange={(value) => update("numberOfFlightsPerWeek", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-duration`}
                label="Duration"
                value={item.duration || ""}
                onChange={(value) => update("duration", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-description`}
                label="Description"
                value={item.description || ""}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`destinations-cities-${index}-image`}
                label="Image URL"
                value={item.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-alt`}
                label="Image alt"
                value={item.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
              <InspectorField
                id={`destinations-cities-${index}-button`}
                label="Button label"
                value={item.buttonLabel || ""}
                onChange={(value) => update("buttonLabel", value)}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="destinations-cities-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          description: joinBacklinkSourceText(
            content.title,
            content.description
          ),
          items: content.items,
          titleKey: "cityName",
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
