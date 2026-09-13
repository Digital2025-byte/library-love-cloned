"use client";

import {
  InspectorField,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const TEXT_KEYS = ["title", "subtitle"];
const FIELD_KEYS = ["caseNumberLabel", "lastNameLabel", "submitLabel"];

export default function TrackRequestContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Text" onReset={() => reset(TEXT_KEYS)}>
        <InspectorField
          id="track-request-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="track-request-subtitle"
          label="Subtitle"
          value={content.subtitle || ""}
          onChange={(value) => updateField("subtitle", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Form fields" onReset={() => reset(FIELD_KEYS)}>
        <InspectorField
          id="track-request-case-label"
          label="Case number label"
          value={content.caseNumberLabel || ""}
          onChange={(value) => updateField("caseNumberLabel", value)}
        />
        <InspectorField
          id="track-request-lastname-label"
          label="Last name label"
          value={content.lastNameLabel || ""}
          onChange={(value) => updateField("lastNameLabel", value)}
        />
        <InspectorField
          id="track-request-submit-label"
          label="Submit button"
          value={content.submitLabel || ""}
          onChange={(value) => updateField("submitLabel", value)}
        />
      </InspectorSection>
    </div>
  );
}
