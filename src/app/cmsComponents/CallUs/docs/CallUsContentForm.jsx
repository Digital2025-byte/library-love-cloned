"use client";

import {
  InspectorField,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const COPY_KEYS = ["upperText", "mainText", "bottomText"];

export default function CallUsContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Copy" onReset={() => reset(COPY_KEYS)}>
        <InspectorField
          id="call-us-upper"
          label="Upper text"
          value={content.upperText || ""}
          onChange={(value) => updateField("upperText", value)}
        />
        <InspectorField
          id="call-us-phone"
          label="Phone"
          value={content.mainText || ""}
          onChange={(value) => updateField("mainText", value)}
        />
        <InspectorField
          id="call-us-bottom"
          label="Bottom text"
          value={content.bottomText || ""}
          onChange={(value) => updateField("bottomText", value)}
          multiline
        />
      </InspectorSection>
    </div>
  );
}
