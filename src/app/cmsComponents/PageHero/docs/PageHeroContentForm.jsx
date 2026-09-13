"use client";

import {
  InspectorField,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const TEXT_KEYS = ["title", "subtitle"];
const IMAGE_KEYS = ["imageUrl", "imageMask", "imageAlt"];

export default function PageHeroContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Text" onReset={() => reset(TEXT_KEYS)}>
        <InspectorField
          id="page-hero-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="page-hero-subtitle"
          label="Subtitle"
          value={content.subtitle || ""}
          onChange={(value) => updateField("subtitle", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="page-hero-image"
          label="Image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="page-hero-mask"
          label="Image mask URL (desktop shape)"
          value={content.imageMask || ""}
          onChange={(value) => updateField("imageMask", value)}
        />
        <InspectorField
          id="page-hero-alt"
          label="Image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>
    </div>
  );
}
