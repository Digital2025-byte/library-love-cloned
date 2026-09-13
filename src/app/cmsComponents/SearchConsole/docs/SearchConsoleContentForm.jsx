"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const FIELD_KEYS = ["label", "placeholder", "submitLabel"];
const POPULAR_KEYS = ["popularLabel", "popularItems"];

const emptyItem = () => ({ label: "" });

export default function SearchConsoleContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Search field" onReset={() => reset(FIELD_KEYS)}>
        <InspectorField
          id="search-console-label"
          label="Label"
          value={content.label || ""}
          onChange={(value) => updateField("label", value)}
        />
        <InspectorField
          id="search-console-placeholder"
          label="Placeholder"
          value={content.placeholder || ""}
          onChange={(value) => updateField("placeholder", value)}
        />
        <InspectorField
          id="search-console-submit"
          label="Button label"
          value={content.submitLabel || ""}
          onChange={(value) => updateField("submitLabel", value)}
        />
      </InspectorSection>

      <InspectorSection title="Popular topics" onReset={() => reset(POPULAR_KEYS)}>
        <InspectorField
          id="search-console-popular-label"
          label="Row label"
          value={content.popularLabel || ""}
          onChange={(value) => updateField("popularLabel", value)}
        />
        <InspectorRepeater
          items={content.popularItems || []}
          createItem={emptyItem}
          itemLabel={(item, index) => item.label || `Chip ${index + 1}`}
          addLabel="Add Chip"
          onChange={(popularItems) => onChange({ ...content, popularItems })}
        >
          {(item, { index, update }) => (
            <InspectorField
              id={`search-console-popular-${index}`}
              label="Chip label"
              value={item.label || ""}
              onChange={(value) => update("label", value)}
            />
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
