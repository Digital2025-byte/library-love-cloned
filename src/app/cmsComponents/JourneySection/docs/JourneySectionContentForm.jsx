"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  InspectorSelect,
  applyInspectorReset,
} from "@/components/inspector";
import { JOURNEY_ICON_OPTIONS } from "../utils/constants";

const HEADER_KEYS = ["title", "subtitle"];

const emptyStep = () => ({
  icon: "calendar",
  title: "",
  linksText: "",
});

export default function JourneySectionContentForm({
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
          id="journey-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="journey-subtitle"
          label="Subtitle"
          value={content.subtitle || ""}
          onChange={(value) => updateField("subtitle", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Steps" onReset={() => reset(["steps"])}>
        <InspectorRepeater
          items={content.steps || []}
          createItem={emptyStep}
          itemLabel={(item, index) => item.title || `Step ${index + 1}`}
          addLabel="Add Step"
          onChange={(steps) => onChange({ ...content, steps })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorSelect
                id={`journey-${index}-icon`}
                label="Icon"
                value={item.icon || "calendar"}
                options={JOURNEY_ICON_OPTIONS}
                onChange={(value) => update("icon", value)}
              />
              <InspectorField
                id={`journey-${index}-title`}
                label="Step title"
                value={item.title || ""}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`journey-${index}-links`}
                label="Links (one per line)"
                value={item.linksText || ""}
                onChange={(value) => update("linksText", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
