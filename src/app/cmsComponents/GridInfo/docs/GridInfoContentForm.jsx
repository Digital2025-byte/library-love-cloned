"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";

const TITLE_KEYS = ["title", "description"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({
  name: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  workingHoursText: "",
});

export default function GridInfoContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorTitleSection
        idPrefix="grid-info"
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
          addLabel="Add Item"
          onChange={(items) => onChange({ ...content, items })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`grid-info-${index}-name`}
                label="Name"
                value={item.name || ""}
                onChange={(value) => update("name", value)}
              />
              <InspectorField
                id={`grid-info-${index}-city`}
                label="City"
                value={item.city || ""}
                onChange={(value) => update("city", value)}
              />
              <InspectorField
                id={`grid-info-${index}-address`}
                label="Address"
                value={item.address || ""}
                onChange={(value) => update("address", value)}
                multiline
              />
              <InspectorField
                id={`grid-info-${index}-phone`}
                label="Phone"
                value={item.phone || ""}
                onChange={(value) => update("phone", value)}
              />
              <InspectorField
                id={`grid-info-${index}-email`}
                label="Email"
                value={item.email || ""}
                onChange={(value) => update("email", value)}
              />
              <InspectorField
                id={`grid-info-${index}-hours`}
                label="Hours"
                value={item.workingHoursText || ""}
                onChange={(value) => update("workingHoursText", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
