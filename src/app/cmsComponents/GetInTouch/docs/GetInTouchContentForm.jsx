"use client";

import {
  InspectorField,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const TEXT_KEYS = ["title", "label", "hours", "note"];
const PHONE_KEYS = ["phoneDisplay", "phoneHref"];
const IMAGE_KEYS = ["imageUrl", "imageAlt"];

export default function GetInTouchContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Text" onReset={() => reset(TEXT_KEYS)}>
        <InspectorField
          id="get-in-touch-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="get-in-touch-label"
          label="Label"
          value={content.label || ""}
          onChange={(value) => updateField("label", value)}
        />
        <InspectorField
          id="get-in-touch-hours"
          label="Hours"
          value={content.hours || ""}
          onChange={(value) => updateField("hours", value)}
        />
        <InspectorField
          id="get-in-touch-note"
          label="Note"
          value={content.note || ""}
          onChange={(value) => updateField("note", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Phone" onReset={() => reset(PHONE_KEYS)}>
        <InspectorField
          id="get-in-touch-phone-display"
          label="Phone (shown)"
          value={content.phoneDisplay || ""}
          onChange={(value) => updateField("phoneDisplay", value)}
        />
        <InspectorField
          id="get-in-touch-phone-href"
          label="Phone link (tel:)"
          value={content.phoneHref || ""}
          onChange={(value) => updateField("phoneHref", value)}
        />
      </InspectorSection>

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="get-in-touch-image"
          label="Image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="get-in-touch-alt"
          label="Image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>
    </div>
  );
}
